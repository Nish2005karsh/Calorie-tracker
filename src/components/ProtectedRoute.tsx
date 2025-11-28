import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useOnboarding } from "@/hooks/useOnboarding";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isOnboardingComplete, isLoaded: onboardingLoaded } = useOnboarding();

  if (!isLoaded || !onboardingLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding is required and not complete, redirect to onboarding
  if (requireOnboarding && !isOnboardingComplete) {
    return <Navigate to="/onboarding/gender" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

