import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { lbsToKg, ftInToCm, UnitSystem } from "@/lib/goals";

const Weight = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<UnitSystem>("metric");

  // Raw input values (interpreted according to `units`)
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const isValid = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const goalNum = parseFloat(goalWeight);
    const heightValid =
      units === "metric"
        ? parseFloat(heightCm) > 0
        : parseFloat(heightFt) > 0;
    return ageNum > 0 && weightNum > 0 && goalNum > 0 && heightValid;
  };

  const handleNext = () => {
    if (!isValid()) return;

    // Normalize everything to metric (kg / cm) for storage.
    const weightKg =
      units === "metric" ? parseFloat(weight) : lbsToKg(parseFloat(weight));
    const goalWeightKg =
      units === "metric" ? parseFloat(goalWeight) : lbsToKg(parseFloat(goalWeight));
    const cm =
      units === "metric"
        ? parseFloat(heightCm)
        : ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0);

    localStorage.setItem("calai_units", units);
    localStorage.setItem("calai_age", age);
    localStorage.setItem("calai_weight", weightKg.toFixed(1));
    localStorage.setItem("calai_goal_weight", goalWeightKg.toFixed(1));
    localStorage.setItem("calai_height", cm.toFixed(1));

    navigate("/onboarding/motivation");
  };

  const weightUnit = units === "metric" ? "kg" : "lbs";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/results")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[36%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">Tell us about yourself</h1>
        <p className="mb-8 text-center text-lg text-muted-foreground">
          This is used to calculate your personalized calorie & macro goals.
        </p>

        {/* Units toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-border p-1">
            <button
              onClick={() => setUnits("metric")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                units === "metric"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => setUnits("imperial")}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                units === "imperial"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Imperial (lbs, ft)
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              inputMode="numeric"
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Height */}
          {units === "metric" ? (
            <div className="space-y-2">
              <Label htmlFor="height-cm">Height (cm)</Label>
              <Input
                id="height-cm"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="flex gap-4">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="in"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Current weight ({weightUnit})</Label>
            <Input
              id="weight"
              type="number"
              inputMode="decimal"
              placeholder={units === "metric" ? "e.g. 80" : "e.g. 176"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-weight">Goal weight ({weightUnit})</Label>
            <Input
              id="goal-weight"
              type="number"
              inputMode="decimal"
              placeholder={units === "metric" ? "e.g. 75" : "e.g. 165"}
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isValid()}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Weight;
