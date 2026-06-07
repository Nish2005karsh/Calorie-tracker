import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

export const useOnboarding = () => {
  const { user, isLoaded } = useUser();

  const isOnboardingComplete = useMemo(() => {
    if (!isLoaded || !user) return false;

    // Use ONLY per-user sources of truth. Do NOT fall back to the global
    // onboarding-answer keys (calai_gender, etc.) — those aren't user-scoped,
    // so a different user signing in on the same browser would wrongly be
    // treated as already onboarded and skip onboarding.

    // 1. Cross-device source of truth: Clerk user metadata.
    if (user.unsafeMetadata?.onboardingComplete === true) return true;

    // 2. Per-user localStorage flag (keyed by this user's id).
    return localStorage.getItem(`calai_onboarding_complete_${user.id}`) === "true";
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
