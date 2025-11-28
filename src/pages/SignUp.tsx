import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    // Wait for both auth and user to be loaded
    if (authLoaded && userLoaded && isSignedIn && user) {
      // New users should go through onboarding
      // Use replace to avoid back button issues
      navigate("/onboarding/gender", { replace: true });
    }
  }, [isSignedIn, authLoaded, userLoaded, user, navigate]);

  // Don't render SignUp if user is already signed in (to prevent redirect loops)
  if (authLoaded && userLoaded && isSignedIn) {
    return null; // The useEffect will handle the redirect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Cal AI</h1>
          <p className="text-lg text-muted-foreground">Create your account</p>
        </div>
        <div className="flex justify-center">
          <SignUp
            routing="virtual"
            signInUrl="/login"
            afterSignUpUrl="/onboarding/gender"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

