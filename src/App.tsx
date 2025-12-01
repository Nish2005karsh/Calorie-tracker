import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Gender from "./pages/onboarding/Gender";
import WorkoutFrequency from "./pages/onboarding/WorkoutFrequency";
import Referral from "./pages/onboarding/Referral";
import PreviousApps from "./pages/onboarding/PreviousApps";
import Results from "./pages/onboarding/Results";
import Weight from "./pages/onboarding/Weight";
import Motivation from "./pages/onboarding/Motivation";
import Speed from "./pages/onboarding/Speed";
import Summary from "./pages/onboarding/Summary";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import AddMeal from "./pages/dashboard/AddMeal";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Get the publishable key from environment variables
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/onboarding/gender"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Gender />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/workout-frequency"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <WorkoutFrequency />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/referral"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Referral />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/previous-apps"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <PreviousApps />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/results"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/weight"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Weight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/motivation"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Motivation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/speed"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Speed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/summary"
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <Summary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add-meal"
              element={
                <ProtectedRoute>
                  <AddMeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
