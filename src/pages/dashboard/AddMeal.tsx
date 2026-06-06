import { useState, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera, faSpinner, faCheck, faKeyboard, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { useUser, useAuth } from "@clerk/clerk-react";
import { addMeal, Meal } from "@/lib/api";
import { createAuthenticatedClient } from "@/lib/supabase";
import { updateStreak } from "@/lib/streaks";
import { analyzeMeal } from "@/lib/gemini";
import { lookupBarcode } from "@/lib/openfoodfacts";
// Lazy-loaded so the ZXing barcode library is only fetched when scanning.
const BarcodeScanner = lazy(() => import("@/components/BarcodeScanner"));
import { getLocalDateString } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

type Mode = "choose" | "manual";

const emptyManual = {
  meal_name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  fiber: "",
  sugar: "",
  sodium: "",
};

const AddMeal = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const mealType = searchParams.get("type") || "breakfast";
  // Allow adding a meal to a specific (e.g. past) day via ?date=YYYY-MM-DD
  const date = searchParams.get("date") || getLocalDateString();

  const [mode, setMode] = useState<Mode>("choose");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState<any>(null);
  const [manual, setManual] = useState({ ...emptyManual });
  const [isSaving, setIsSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const dateLabel =
    date === getLocalDateString() ? "" : ` (${format(new Date(date + "T00:00:00"), "MMM d")})`;

  // Shared persistence: insert the meal, bump the streak, go back to the dashboard.
  const persistMeal = async (meal: Omit<Meal, "user_id">) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Failed to get Supabase token");

      const supabase = createAuthenticatedClient(token);
      await addMeal(supabase, user.id, meal);
      await updateStreak(supabase, user.id, new Date());

      toast.success("Meal added!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save meal", error);
      toast.error("Failed to save meal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (files && files[0]) {
      setIsLoading(true);
      try {
        const result = await analyzeMeal(files[0]);
        setAnalyzedMeal(result);
      } catch (error) {
        console.error("Analysis failed", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to analyze the image. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBarcodeDetected = async (code: string) => {
    setScanning(false);
    setIsLookingUp(true);
    try {
      const product = await lookupBarcode(code);
      setManual({
        meal_name: product.mealName,
        calories: String(product.calories),
        protein: String(product.protein),
        carbs: String(product.carbs),
        fat: String(product.fat),
        fiber: String(product.fiber),
        sugar: String(product.sugar),
        sodium: String(product.sodium),
      });
      setMode("manual");
      toast.success("Found it! Values are per 100g — adjust for your portion, then save.");
    } catch (error) {
      console.error("Barcode lookup failed", error);
      toast.error(
        error instanceof Error ? error.message : "Could not find that product. Try manual entry."
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSaveAnalyzed = () => {
    if (!analyzedMeal) return;
    persistMeal({
      date,
      meal_type: mealType as any,
      meal_name: analyzedMeal.mealName,
      calories: Math.round(analyzedMeal.calories) || 0,
      protein: Math.round(analyzedMeal.protein) || 0,
      carbs: Math.round(analyzedMeal.carbs) || 0,
      fat: Math.round(analyzedMeal.fat) || 0,
      fiber: Math.round(analyzedMeal.fiber) || 0,
      sugar: Math.round(analyzedMeal.sugar) || 0,
      sodium: Math.round(analyzedMeal.sodium) || 0,
      confidence_score: analyzedMeal.confidenceScore,
      health_score: analyzedMeal.healthScore,
    });
  };

  const handleSaveManual = () => {
    const calories = parseFloat(manual.calories);
    if (!manual.meal_name.trim()) {
      toast.error("Please enter a meal name.");
      return;
    }
    if (!(calories >= 0)) {
      toast.error("Please enter a valid calorie amount.");
      return;
    }
    const num = (v: string) => Math.max(Math.round(parseFloat(v) || 0), 0);
    persistMeal({
      date,
      meal_type: mealType as any,
      meal_name: manual.meal_name.trim(),
      calories: num(manual.calories),
      protein: num(manual.protein),
      carbs: num(manual.carbs),
      fat: num(manual.fat),
      fiber: num(manual.fiber),
      sugar: num(manual.sugar),
      sodium: num(manual.sodium),
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const setManualField = (key: keyof typeof emptyManual, value: string) =>
    setManual((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      {scanning && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 text-white" />
            </div>
          }
        >
          <BarcodeScanner
            onDetected={handleBarcodeDetected}
            onClose={() => setScanning(false)}
            onError={(msg) => toast.error(msg)}
          />
        </Suspense>
      )}
      {isLookingUp && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <FontAwesomeIcon icon={faSpinner} spin className="mb-4 h-12 w-12 text-white" />
          <p className="text-white">Looking up product...</p>
        </div>
      )}

      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold capitalize">
          Add Your {mealType}
          {dateLabel}
        </h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          {mode === "manual"
            ? "Enter the nutrition details manually"
            : "Take a photo, upload an image, or enter details manually"}
        </p>

        {/* Review screen after AI analysis */}
        {analyzedMeal ? (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">{analyzedMeal.mealName}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analyzedMeal.calories}</p>
                  <p className="text-sm text-muted-foreground">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{analyzedMeal.protein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{analyzedMeal.carbs}g</p>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{analyzedMeal.fat}g</p>
                  <p className="text-sm text-muted-foreground">Fats</p>
                </div>
              </div>

              {/* Health score + rationale from the AI */}
              {(analyzedMeal.healthScore != null || analyzedMeal.rationale) && (
                <div className="mt-6 rounded-xl bg-muted p-4">
                  {analyzedMeal.healthScore != null && (
                    <p className="mb-1 font-semibold">
                      Health Score: {analyzedMeal.healthScore}/10
                    </p>
                  )}
                  {analyzedMeal.rationale && (
                    <p className="text-sm text-muted-foreground">{analyzedMeal.rationale}</p>
                  )}
                  {analyzedMeal.confidenceScore != null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Confidence: {Math.round(analyzedMeal.confidenceScore * 100)}%
                    </p>
                  )}
                </div>
              )}
            </Card>

            <Button
              onClick={handleSaveAnalyzed}
              className="h-14 w-full rounded-xl text-lg font-semibold"
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
              )}
              Add to {mealType}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setAnalyzedMeal(null)}
              className="w-full"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        ) : mode === "manual" ? (
          /* Manual entry form */
          <div className="space-y-6">
            <Card className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="meal_name">Meal name</Label>
                <Input
                  id="meal_name"
                  placeholder="e.g. Grilled chicken salad"
                  value={manual.meal_name}
                  onChange={(e) => setManualField("meal_name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input id="calories" type="number" inputMode="numeric" placeholder="kcal"
                    value={manual.calories} onChange={(e) => setManualField("calories", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input id="protein" type="number" inputMode="numeric" placeholder="g"
                    value={manual.protein} onChange={(e) => setManualField("protein", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" type="number" inputMode="numeric" placeholder="g"
                    value={manual.carbs} onChange={(e) => setManualField("carbs", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input id="fat" type="number" inputMode="numeric" placeholder="g"
                    value={manual.fat} onChange={(e) => setManualField("fat", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input id="fiber" type="number" inputMode="numeric" placeholder="optional"
                    value={manual.fiber} onChange={(e) => setManualField("fiber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sugar">Sugar (g)</Label>
                  <Input id="sugar" type="number" inputMode="numeric" placeholder="optional"
                    value={manual.sugar} onChange={(e) => setManualField("sugar", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sodium">Sodium (mg)</Label>
                  <Input id="sodium" type="number" inputMode="numeric" placeholder="optional"
                    value={manual.sodium} onChange={(e) => setManualField("sodium", e.target.value)} />
                </div>
              </div>
            </Card>

            <Button
              onClick={handleSaveManual}
              className="h-14 w-full rounded-xl text-lg font-semibold"
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
              )}
              Add to {mealType}
            </Button>

            <Button variant="ghost" onClick={() => setMode("choose")} className="w-full" disabled={isSaving}>
              Back to photo upload
            </Button>
          </div>
        ) : (
          /* Default: AI photo upload + manual option */
          <>
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mb-8 border-2 border-dashed p-12 text-center transition-all ${isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FontAwesomeIcon icon={faSpinner} spin className="mb-4 h-12 w-12 text-primary" />
                  <p className="text-lg font-medium">Analyzing your food...</p>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                      <FontAwesomeIcon icon={faCamera} className="h-12 w-12 text-accent" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Take a photo or upload</h3>
                  <p className="text-muted-foreground">Drag and drop or click to select</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>
              )}
            </Card>

            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-14 w-full rounded-xl text-lg font-semibold"
                onClick={() => setScanning(true)}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faBarcode} className="mr-2 h-5 w-5" />
                Scan barcode
              </Button>
              <Button
                variant="outline"
                className="h-14 w-full rounded-xl text-lg font-semibold"
                onClick={() => setMode("manual")}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faKeyboard} className="mr-2 h-5 w-5" />
                Enter manually
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMeal;
