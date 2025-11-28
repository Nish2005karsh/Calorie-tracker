import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useEffect } from "react";

const Summary = () => {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useOnboarding();

  useEffect(() => {
    // Mark onboarding as complete when user reaches summary page
    markOnboardingComplete();
  }, [markOnboardingComplete]);

  // Mock data - will come from context later
  const userData = {
    goalWeight: 6,
    targetDate: "May 2",
    dailyCalories: 1910,
    carbs: 221,
    protein: 136,
    fats: 53,
    healthScore: 7,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/referral")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[90%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <FontAwesomeIcon icon={faCheck} className="h-10 w-10 text-success" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            Congratulations your custom plan is ready!
          </h1>
          <p className="text-lg text-muted-foreground">
            You should lose:{" "}
            <span className="font-bold text-accent">
              {userData.goalWeight} lbs by {userData.targetDate}
            </span>
          </p>
        </div>

        <Card className="mb-6 border-none p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Daily recommendation</h2>
            <p className="text-sm text-muted-foreground">You can edit this anytime</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <svg className="h-20 w-20" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    className="text-accent transition-all"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute ml-16 mt-16"
                >
                  <FontAwesomeIcon icon={faPencil} className="h-3 w-3" />
                </Button>
              </div>
              <p className="mb-1 text-2xl font-bold">{userData.dailyCalories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <svg className="h-20 w-20" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="75.36"
                    className="text-warning transition-all"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute ml-16 mt-16"
                >
                  <FontAwesomeIcon icon={faPencil} className="h-3 w-3" />
                </Button>
              </div>
              <p className="mb-1 text-2xl font-bold">{userData.carbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <svg className="h-20 w-20" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    className="text-accent transition-all"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute ml-16 mt-16"
                >
                  <FontAwesomeIcon icon={faPencil} className="h-3 w-3" />
                </Button>
              </div>
              <p className="mb-1 text-2xl font-bold">{userData.protein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>

            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <svg className="h-20 w-20" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="100.48"
                    className="text-destructive transition-all"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute ml-16 mt-16"
                >
                  <FontAwesomeIcon icon={faPencil} className="h-3 w-3" />
                </Button>
              </div>
              <p className="mb-1 text-2xl font-bold">{userData.fats}g</p>
              <p className="text-sm text-muted-foreground">Fats</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">Health Score</p>
              <p className="text-2xl font-bold text-destructive">
                {userData.healthScore}/10
              </p>
            </div>
            <Progress value={userData.healthScore * 10} className="h-3" />
          </div>
        </Card>

        <Button
          onClick={() => navigate("/dashboard")}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Let's get started!
        </Button>
      </div>
    </div>
  );
};

export default Summary;
