import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircle } from "@fortawesome/free-solid-svg-icons";

const WorkoutFrequency = () => {
  const navigate = useNavigate();
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedFrequency) {
      localStorage.setItem("calai_workout_frequency", selectedFrequency);
      navigate("/onboarding/referral");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/gender")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[12%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">
          How many workouts do you do per week?
        </h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          This will be used to calibrate your custom plan.
        </p>

        <div className="mb-8 space-y-4">
          <Card
            onClick={() => setSelectedFrequency("0-2")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedFrequency === "0-2"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FontAwesomeIcon icon={faCircle} className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-semibold">0-2</p>
                  <p className="text-sm text-muted-foreground">Workouts now and then</p>
                </div>
              </div>
              {selectedFrequency === "0-2" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>

          <Card
            onClick={() => setSelectedFrequency("3-5")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedFrequency === "3-5"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center gap-1 rounded-full bg-muted">
                  <FontAwesomeIcon icon={faCircle} className="h-3 w-3 text-muted-foreground" />
                  <FontAwesomeIcon icon={faCircle} className="h-3 w-3 text-muted-foreground" />
                  <FontAwesomeIcon icon={faCircle} className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-semibold">3-5</p>
                  <p className="text-sm text-muted-foreground">A few workouts per week</p>
                </div>
              </div>
              {selectedFrequency === "3-5" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>

          <Card
            onClick={() => setSelectedFrequency("6+")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedFrequency === "6+"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 grid-cols-2 gap-1 rounded-full bg-muted p-2">
                  <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-muted-foreground" />
                  <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-muted-foreground" />
                  <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-muted-foreground" />
                  <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-semibold">6+</p>
                  <p className="text-sm text-muted-foreground">Dedicated athlete</p>
                </div>
              </div>
              {selectedFrequency === "6+" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedFrequency}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WorkoutFrequency;
