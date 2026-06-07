import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faWeightScale, faUsers, faCamera } from "@fortawesome/free-solid-svg-icons";

const STEPS = [
  {
    img: "/screen1.png",
    icon: faUser,
    title: "Tell us about you",
    desc: "Answer a couple of quick questions, starting with your gender, so we can calibrate your plan.",
  },
  {
    img: "/screen2.png",
    icon: faWeightScale,
    title: "Set your weight goals",
    desc: "Enter your current and target weight — we calculate your personalized calorie & macro targets.",
  },
  {
    img: "/screen3.png",
    icon: faUsers,
    title: "Connect with us",
    desc: "Tell us how you found us and finish setting up your custom plan in seconds.",
  },
  {
    img: "/screen4.png",
    icon: faCamera,
    title: "Snap & track",
    desc: "Just photograph your meal — our AI instantly identifies it and logs calories, protein, carbs & fats.",
  },
];

const SLIDE_MS = 3000;

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  // Auto-advance the slideshow.
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % STEPS.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [active]); // resetting on `active` keeps timing consistent after a manual click

  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-lg text-muted-foreground">
          From sign-up to your first logged meal in seconds.
        </p>

        <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
          {/* Phone slideshow */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/10 bg-card shadow-2xl">
              <img
                key={active}
                src={STEPS[active].img}
                alt={STEPS[active].title}
                className="w-full animate-in fade-in duration-700"
              />
            </div>
            {/* Progress dots */}
            <div className="mt-6 flex gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to step ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step explanations */}
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <button
                key={step.title}
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                  i === active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    i === active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <FontAwesomeIcon icon={step.icon} className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
