import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth, useClerk } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner, faRightFromBracket, faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAuthenticatedClient } from "@/lib/supabase";
import { fetchUserProfile, updateUserProfile, UserProfile } from "@/lib/api";
import { computeGoals, UnitSystem } from "@/lib/goals";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [units, setUnits] = useState<UnitSystem>(
    (localStorage.getItem("calai_units") as UnitSystem) || "metric"
  );

  const [form, setForm] = useState({
    calorie_goal: "",
    protein_goal: "",
    carbs_goal: "",
    fats_goal: "",
    current_weight: "",
    desired_weight: "",
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isUserLoaded || !user) return;
      try {
        setIsLoading(true);
        const supabase = createAuthenticatedClient(getToken);
        const p = await fetchUserProfile(supabase, user.id);
        setProfile(p);
        if (p) {
          setForm({
            calorie_goal: String(p.calorie_goal ?? ""),
            protein_goal: String(p.protein_goal ?? ""),
            carbs_goal: String(p.carbs_goal ?? ""),
            fats_goal: String(p.fats_goal ?? ""),
            current_weight: p.current_weight != null ? String(p.current_weight) : "",
            desired_weight: p.desired_weight != null ? String(p.desired_weight) : "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
        toast.error("Failed to load your profile.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isUserLoaded, user]);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUnitsChange = (next: UnitSystem) => {
    setUnits(next);
    localStorage.setItem("calai_units", next);
  };

  const num = (v: string) => (v === "" ? undefined : Math.max(parseFloat(v) || 0, 0));

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const supabase = createAuthenticatedClient(getToken);

      await updateUserProfile(supabase, user.id, {
        calorie_goal: num(form.calorie_goal) ?? 0,
        protein_goal: num(form.protein_goal) ?? 0,
        carbs_goal: num(form.carbs_goal) ?? 0,
        fats_goal: num(form.fats_goal) ?? 0,
        current_weight: num(form.current_weight),
        desired_weight: num(form.desired_weight),
      });
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Recalculate macro/calorie goals from stored profile + onboarding answers.
  const handleRecalculate = () => {
    const weightKg = num(form.current_weight);
    const goalWeightKg = num(form.desired_weight);
    const heightCm = parseFloat(localStorage.getItem("calai_height") || "0");
    const age = parseFloat(localStorage.getItem("calai_age") || "0");
    if (!weightKg || !goalWeightKg || !heightCm || !age) {
      toast.error("Need weight, goal weight, height and age to recalculate. Set them first.");
      return;
    }
    const goals = computeGoals({
      gender: profile?.gender,
      weightKg,
      heightCm,
      age,
      goalWeightKg,
      workoutFrequency: profile?.workout_frequency,
      weightSpeedLbs: parseFloat(localStorage.getItem("calai_weight_speed") || "1.0"),
    });
    setForm((prev) => ({
      ...prev,
      calorie_goal: String(goals.calorieGoal),
      protein_goal: String(goals.proteinGoal),
      carbs_goal: String(goals.carbsGoal),
      fats_goal: String(goals.fatsGoal),
    }));
    toast.success("Goals recalculated — remember to Save.");
  };

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 text-primary" />
      </div>
    );
  }

  const weightUnit = units === "metric" ? "kg" : "lbs";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* Appearance */}
        <Card className="border-none p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Appearance</h2>
          <div className="inline-flex rounded-xl border border-border p-1">
            {([
              { value: "light", label: "Light", icon: faSun },
              { value: "dark", label: "Dark", icon: faMoon },
              { value: "system", label: "System", icon: faDesktop },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  theme === opt.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Units */}
        <Card className="border-none p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Units</h2>
          <div className="inline-flex rounded-xl border border-border p-1">
            <button
              onClick={() => handleUnitsChange("metric")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                units === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Metric (kg)
            </button>
            <button
              onClick={() => handleUnitsChange("imperial")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                units === "imperial" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Imperial (lbs)
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Display preference for weights across the app.
          </p>
        </Card>

        {/* Daily Goals */}
        <Card className="border-none p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Daily Goals</h2>
            <Button variant="outline" size="sm" onClick={handleRecalculate}>
              Recalculate
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calorie_goal">Calories</Label>
              <Input id="calorie_goal" type="number" value={form.calorie_goal}
                onChange={(e) => setField("calorie_goal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein_goal">Protein (g)</Label>
              <Input id="protein_goal" type="number" value={form.protein_goal}
                onChange={(e) => setField("protein_goal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs_goal">Carbs (g)</Label>
              <Input id="carbs_goal" type="number" value={form.carbs_goal}
                onChange={(e) => setField("carbs_goal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fats_goal">Fats (g)</Label>
              <Input id="fats_goal" type="number" value={form.fats_goal}
                onChange={(e) => setField("fats_goal", e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Weight */}
        <Card className="border-none p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Weight ({weightUnit})</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_weight">Current</Label>
              <Input id="current_weight" type="number" value={form.current_weight}
                onChange={(e) => setField("current_weight", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desired_weight">Goal</Label>
              <Input id="desired_weight" type="number" value={form.desired_weight}
                onChange={(e) => setField("desired_weight", e.target.value)} />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Stored in kg. Enter values in your selected unit's terms.
          </p>
        </Card>

        <Button
          onClick={handleSave}
          className="h-12 w-full rounded-xl text-lg font-semibold"
          disabled={isSaving}
        >
          {isSaving ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : null}
          Save Changes
        </Button>

        {/* Account */}
        <Card className="border-none p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Account</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Signed in as {user?.primaryEmailAddress?.emailAddress || user?.id}
          </p>
          <Button
            variant="destructive"
            onClick={() => signOut(() => navigate("/"))}
            className="w-full"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
