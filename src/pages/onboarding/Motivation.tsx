import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Motivation = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/onboarding/speed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/weight")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[42%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            Losing <span className="text-accent">6 lbs</span> is a realistic target. It's not hard at all!
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">90%</span> of users say that the change is obvious after using Cal AI and it is not easy to rebound!
          </p>
        </div>

        {/* Motivational Icon/Illustration */}
        <div className="mb-16 flex justify-center">
          <div className="relative">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="text-8xl">💪</div>
            </div>
            <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-success shadow-lg">
              <span className="text-3xl">✓</span>
            </div>
          </div>
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

export default Motivation;