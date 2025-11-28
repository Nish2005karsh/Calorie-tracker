import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";
export const useOnboarding = () => {
  const { user, isLoaded } = useUser();
  const isOnboardingComplete = useMemo(() => {
    if (!isLoaded || !user) return false;
    // Check if onboarding is marked as complete in user metadata or localStorage
    // For now, we'll use localStorage with user ID to track per-user onboarding
    const onboardingKey = `calai_onboarding_complete_${user.id}`;
    const isComplete = localStorage.getItem(onboardingKey) === "true";
    
    // Also check if user has completed all onboarding steps
    const hasGender = localStorage.getItem("calai_gender");
    const hasWorkoutFrequency = localStorage.getItem("calai_workout_frequency");
    const hasReferral = localStorage.getItem("calai_referral");
    return isComplete || (hasGender && hasWorkoutFrequency && hasReferral);
  }, [user, isLoaded]);

  const markOnboardingComplete = () => {
    if (user) {
      const onboardingKey = `calai_onboarding_complete_${user.id}`;
      localStorage.setItem(onboardingKey, "true");
    }
  };

  return {
    isOnboardingComplete,
    markOnboardingComplete,
    isLoaded,
  };
};

