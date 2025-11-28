import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const PreviousApps = () => {
  const navigate = useNavigate();
  const [hasTriedApps, setHasTriedApps] = useState<boolean | null>(null);

  const handleNext = () => {
    if (hasTriedApps !== null) {
      localStorage.setItem("calai_tried_apps", hasTriedApps.toString());
      navigate("/onboarding/results");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/referral")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[24%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">
          Have you tried other calorie tracking apps?
        </h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          This will be used to calibrate your custom plan.
        </p>

        <div className="mb-8 space-y-4">
          {/* No Option */}
          <Card
            onClick={() => setHasTriedApps(false)}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              hasTriedApps === false
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FontAwesomeIcon 
                    icon={faThumbsDown} 
                    className="h-6 w-6 text-muted-foreground" 
                  />
                </div>
                <span className="text-xl font-semibold">No</span>
              </div>
              {hasTriedApps === false && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>

          {/* Yes Option */}
          <Card
            onClick={() => setHasTriedApps(true)}
            className={`cursor-pointer border-2 p-6 transition-all hover:shadow-lg ${
              hasTriedApps === true
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FontAwesomeIcon 
                    icon={faThumbsUp} 
                    className="h-6 w-6 text-muted-foreground" 
                  />
                </div>
                <span className="text-xl font-semibold">Yes</span>
              </div>
              {hasTriedApps === true && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </div>
              )}
            </div>
          </Card>
        </div>

        <Button
          onClick={handleNext}
          disabled={hasTriedApps === null}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PreviousApps;