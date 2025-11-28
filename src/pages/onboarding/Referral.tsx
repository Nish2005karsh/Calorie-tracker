import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faGlobe,
  faTv,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faYoutube,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

const Referral = () => {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const sources = [
    { id: "instagram", label: "Instagram", icon: faInstagram },
    { id: "facebook", label: "Facebook", icon: faFacebook },
    { id: "tiktok", label: "TikTok", icon: faTiktok },
    { id: "youtube", label: "YouTube", icon: faYoutube },
    { id: "google", label: "Google", icon: faGoogle },
    { id: "tv", label: "TV", icon: faTv },
    { id: "friend", label: "Friend or family", icon: faUsers },
    { id: "other", label: "Other", icon: faGlobe },
  ];

  const handleNext = () => {
    if (selectedSource) {
      localStorage.setItem("calai_referral", selectedSource);
      navigate("/onboarding/previous-apps");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/workout-frequency")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[18%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-12 text-center text-4xl font-bold">
          Where did you hear about us?
        </h1>

        <div className="mb-8 space-y-3">
          {sources.map((source) => (
            <Card
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`cursor-pointer border-2 p-5 transition-all hover:shadow-lg ${selectedSource === source.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <FontAwesomeIcon
                      icon={source.icon}
                      className="h-5 w-5 text-muted-foreground"
                    />
                  </div>
                  <span className="text-lg font-medium">{source.label}</span>
                </div>
                {selectedSource === source.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    ✓
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedSource}
          className="h-14 w-full rounded-xl text-lg font-semibold"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Referral;
