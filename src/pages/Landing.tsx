import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faUtensils,
  faChartLine,
  faFireFlameCurved,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="text-2xl font-bold">Cal AI</div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-foreground hover:text-accent transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-foreground hover:text-accent transition-colors">
              Reviews
            </a>
            <SignedOut>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Button onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
                Transform Your Health with AI-Powered Nutrition Tracking
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                CalorieAI creates personalized meal plans and tracks your calories effortlessly
              </p>
              <Button
                size="lg"
                className="h-14 rounded-xl px-8 text-lg font-semibold"
                onClick={() => navigate("/signup")}
              >
                Start Free Trial
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 p-8">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">📱</div>
                    <p className="text-lg font-semibold">AI-Powered Food Recognition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <FontAwesomeIcon icon={faBrain} className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI-Powered Recognition</h3>
              <p className="text-muted-foreground">
                Simply snap a photo and let our AI identify your food and calculate calories instantly
              </p>
            </Card>

            <Card className="border-none bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personalized Plans</h3>
              <p className="text-muted-foreground">
                Get custom meal plans tailored to your goals, lifestyle, and dietary preferences
              </p>
            </Card>

            <Card className="border-none bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Track calories, macros, and nutrition throughout the day with live updates
              </p>
            </Card>

            <Card className="border-none bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <FontAwesomeIcon icon={faFireFlameCurved} className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Stay Motivated</h3>
              <p className="text-muted-foreground">
                Visual progress tracking and health scores keep you engaged and accountable
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-accent to-accent/80 p-12 text-center text-background">
            <h2 className="mb-4 text-4xl font-bold">
              80% of CalorieAI users maintain their weight loss even 6 months later
            </h2>
            <p className="mb-8 text-xl opacity-90">1000+ CalorieAI people trust us</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon key={star} icon={faStar} className="h-6 w-6" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-none bg-background p-8 shadow-sm">
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className="h-5 w-5 text-accent"
                  />
                ))}
              </div>
              <p className="mb-4 text-lg">
                "I lost 15 lbs in 2 months! I was about to go on Ozempic but decided to give this
                app a shot and it worked! :)"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-semibold">
                  MB
                </div>
                <div>
                  <p className="font-semibold">Marley Brylle</p>
                  <p className="text-sm text-muted-foreground">Verified User</p>
                </div>
              </div>
            </Card>

            <Card className="border-none bg-background p-8 shadow-sm">
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className="h-5 w-5 text-accent"
                  />
                ))}
              </div>
              <p className="mb-4 text-lg">
                "The AI food recognition is incredible! It saves me so much time and makes tracking
                actually enjoyable."
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 font-semibold">
                  BM
                </div>
                <div>
                  <p className="font-semibold">Benny Marcos</p>
                  <p className="text-sm text-muted-foreground">Verified User</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to start your journey?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of people achieving their health goals with CalorieAI
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-xl px-8 text-lg font-semibold sm:w-auto"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-muted-foreground">
          <p>© 2025 CalorieAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
