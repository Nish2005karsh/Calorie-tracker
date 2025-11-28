import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Gender = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      // Store selection (will use Context/Zustand later)
      localStorage.setItem("calai_gender", selectedGender);
      navigate("/onboarding/workout-frequency");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[6%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">Choose your Gender</h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          This will be used to calibrate your custom plan.
        </p>

        <div className="mb-8 space-y-4">
          <Card
            onClick={() => setSelectedGender("male")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedGender === "male"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👨</div>
                <span className="text-xl font-semibold">Male</span>
              </div>
              {selectedGender === "male" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>

          <Card
            onClick={() => setSelectedGender("female")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedGender === "female"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👩</div>
                <span className="text-xl font-semibold">Female</span>
              </div>
              {selectedGender === "female" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>

          <Card
            onClick={() => setSelectedGender("other")}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              selectedGender === "other"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⚧️</div>
                <span className="text-xl font-semibold">Other</span>
              </div>
              {selectedGender === "other" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedGender}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Gender;
