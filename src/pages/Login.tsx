import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useOnboarding } from "@/hooks/useOnboarding";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isOnboardingComplete, isLoaded: onboardingLoaded } = useOnboarding();

  useEffect(() => {
    if (isSignedIn && onboardingLoaded) {
      // If user hasn't completed onboarding, redirect to onboarding
      if (!isOnboardingComplete) {
        navigate("/onboarding/gender");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isSignedIn, isOnboardingComplete, onboardingLoaded, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Cal AI</h1>
          <p className="text-lg text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            routing="virtual"
            signUpUrl="/signup"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
