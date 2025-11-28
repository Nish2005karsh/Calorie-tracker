// import { text } from "stream/consumers"
// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faCamera, faSearch, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { useUser } from "@clerk/clerk-react";
// import { addMeal } from "@/lib/api";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera, faSearch, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@clerk/clerk-react";
import { addMeal } from "@/lib/api";

// Send image to n8n and get analysis
const analyzeMeal = async (imageFile: File) => {
  try {
    console.log('Uploading image...');

    // Create FormData (sends as binary)
    const formData = new FormData();
    formData.append('image', imageFile);

    // Send to n8n webhook
    const response = await fetch('https://nick-moreno.app.n8n.cloud/webhook-test/fb1795ae-7290-48be-8c52-27b50eb32691', {
      method: 'POST',
      body: formData, // ⭐ Send FormData, not JSON
      // ⭐ Don't set Content-Type header - browser will set it automatically
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to analyze meal: ${response.status}`);
    }

    // Get response text first to debug
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Parse JSON
    const result = JSON.parse(responseText);

    console.log('=== AI ANALYSIS ===');
    console.log('Meal:', result.mealName);
    console.log('Calories:', result.calories);
    console.log('Protein:', result.protein + 'g');
    console.log('Carbs:', result.carbs + 'g');
    console.log('Fat:', result.fat + 'g');
    console.log('Full data:', result);

    return result;

  } catch (error) {
    console.error('Error analyzing meal:', error);
    throw error;
  }
};

const AddMeal = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const mealType = searchParams.get("type") || "breakfast"; // Default to breakfast if not specified
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (files && files[0]) {
      setIsLoading(true);
      try {
        const result = await analyzeMeal(files[0]);
        setAnalyzedMeal(result);
      } catch (error) {
        console.error("Analysis failed", error);
        // You might want to show an error toast here
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (analyzedMeal && user) {
      setIsSaving(true);
      try {
        await addMeal(user.id, {
          date: new Date().toISOString().split('T')[0],
          meal_type: mealType as any,
          meal_name: analyzedMeal.mealName,
          calories: analyzedMeal.calories,
          protein: analyzedMeal.protein,
          carbs: analyzedMeal.carbs,
          fat: analyzedMeal.fat,
          fiber: analyzedMeal.fiber || 0,
          sugar: analyzedMeal.sugar || 0,
          sodium: analyzedMeal.sodium || 0,
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to save meal", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-background">
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
        </h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Take a photo or upload an image of your food
        </p>

        {!analyzedMeal ? (
          <>
            <Card
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mb-8 border-2 border-dashed p-12 text-center transition-all ${
  isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
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

            <Button
              variant="outline"
              className="h-14 w-full rounded-xl text-lg font-semibold"
              onClick={() => {
                console.log("Manual search");
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2 h-5 w-5" />
              Search food manually
            </Button>
          </>
        ) : (
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
            </Card>

            <Button
              onClick={handleSave}
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
        )}
      </div>
    </div>
  );
};

export default AddMeal;
