import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const Speed = () => {
  const navigate = useNavigate();
  const [selectedSpeed, setSelectedSpeed] = useState<string>("1.0");

  const speeds = [
    {
      value: "0.2",
      lbs: "0.2 lbs",
      icon: "🐢",
      label: "Slow & Steady",
    },
    {
      value: "1.0",
      lbs: "1.0 lbs",
      icon: "🐰",
      label: "Balanced",
      recommended: true,
    },
    {
      value: "3.0",
      lbs: "3.0 lbs",
      icon: "🐆",
      label: "Aggressive",
    },
  ];

  const handleNext = () => {
    localStorage.setItem("calai_weight_speed", selectedSpeed);
    navigate("/onboarding/summary");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/motivation")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[48%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">
          How fast do you want to reach your goal?
        </h1>
        <p className="mb-12 text-center text-sm text-muted-foreground">
          Loss weight speed per week
        </p>

        {/* Speed Display */}
        <div className="mb-12 text-center">
          <p className="mb-6 text-5xl font-bold">{selectedSpeed} lbs</p>

          {/* Animal Icons with Labels */}
          <div className="mb-8 flex items-end justify-center gap-8">
            {speeds.map((speed) => (
              <div
                key={speed.value}
                className={`flex flex-col items-center transition-all ${selectedSpeed === speed.value ? "scale-110" : "opacity-50"
                  }`}
              >
                <div className={`mb-2 text-5xl transition-all ${selectedSpeed === speed.value ? "animate-bounce" : ""
                  }`}>
                  {speed.icon}
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {speed.lbs}
                </p>
              </div>
            ))}
          </div>

          {/* Slider Track */}
          <div className="relative mx-auto mb-4 h-2 w-full max-w-md rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-success via-warning to-destructive transition-all duration-300"
              style={{
                width:
                  selectedSpeed === "0.2"
                    ? "16.66%"
                    : selectedSpeed === "1.0"
                      ? "50%"
                      : "100%",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left:
                  selectedSpeed === "0.2"
                    ? "16.66%"
                    : selectedSpeed === "1.0"
                      ? "50%"
                      : "100%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="h-6 w-6 rounded-full border-4 border-background bg-primary shadow-lg" />
            </div>
          </div>
        </div>

        {/* Speed Options */}
        <div className="mb-8 space-y-3">
          {speeds.map((speed) => (
            <Card
              key={speed.value}
              onClick={() => setSelectedSpeed(speed.value)}
              className={`relative cursor-pointer border-2 p-4 transition-all hover:shadow-lg ${selectedSpeed === speed.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{speed.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-semibold">{speed.lbs}</p>
                      {speed.recommended && (
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{speed.label}</p>
                  </div>
                </div>
                {selectedSpeed === speed.value && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    ✓
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="h-14 w-full rounded-xl bg-primary text-lg font-semibold hover:bg-primary/90"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Speed;