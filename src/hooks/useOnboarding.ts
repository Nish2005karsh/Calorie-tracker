import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

export const useOnboarding = () => {
  const { user, isLoaded } = useUser();

  const isOnboardingComplete = useMemo(() => {
    if (!isLoaded || !user) return false;

    // 1. Cross-device source of truth: Clerk user metadata.
    if (user.unsafeMetadata?.onboardingComplete === true) return true;

    // 2. Fallback to localStorage (per-user flag or the presence of answers).
    const onboardingKey = `calai_onboarding_complete_${user.id}`;
    const isComplete = localStorage.getItem(onboardingKey) === "true";

    const hasGender = localStorage.getItem("calai_gender");
    const hasWorkoutFrequency = localStorage.getItem("calai_workout_frequency");
    const hasReferral = localStorage.getItem("calai_referral");
    return isComplete || !!(hasGender && hasWorkoutFrequency && hasReferral);
  }, [user, isLoaded]);

  const markOnboardingComplete = async () => {
    if (!user) return;
    // Local flag (instant) ...
    const onboardingKey = `calai_onboarding_complete_${user.id}`;
    localStorage.setItem(onboardingKey, "true");
    // ... and persist to Clerk so it survives new devices / cleared storage.
    try {
      await user.update({
        unsafeMetadata: { ...user.unsafeMetadata, onboardingComplete: true },
      });
    } catch (error) {
      console.error("Failed to persist onboarding state to Clerk:", error);
    }
  };

  return {
    isOnboardingComplete,
    markOnboardingComplete,
    isLoaded,
  };
};
