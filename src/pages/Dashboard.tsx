import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPlus,
  faMugHot,
  faUtensils,
  faBowlFood,
  faCookie,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { fetchDailyMeals, fetchUserProfile, Meal, UserProfile } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded } = useUser();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const [meals, setMeals] = useState<Meal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isUserLoaded || !user) return;

      try {
        setIsLoading(true);
        const [fetchedMeals, fetchedProfile] = await Promise.all([
          fetchDailyMeals(user.id, today),
          fetchUserProfile(user.id),
        ]);

        setMeals(fetchedMeals);
        setUserProfile(fetchedProfile);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isUserLoaded, user, today]);

  // Calculate totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const breakfastCalories = meals
    .filter((m) => m.meal_type === "breakfast")
    .reduce((sum, m) => sum + m.calories, 0);
  const lunchCalories = meals
    .filter((m) => m.meal_type === "lunch")
    .reduce((sum, m) => sum + m.calories, 0);
  const dinnerCalories = meals
    .filter((m) => m.meal_type === "dinner")
    .reduce((sum, m) => sum + m.calories, 0);
  const snacksCalories = meals
    .filter((m) => m.meal_type === "snacks" || m.meal_type === "snack")
    .reduce((sum, m) => sum + m.calories, 0);

  // Use profile goals or defaults
  const goalCalories = userProfile?.calorie_goal || 1910;
  const goalProtein = userProfile?.protein_goal || 136;
  const goalCarbs = userProfile?.carbs_goal || 221;
  const goalFats = userProfile?.fats_goal || 53;

  const calorieProgress = Math.min((totalCalories / goalCalories) * 100, 100);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Cal AI</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Date Selector */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Button variant="ghost">Yesterday</Button>
          <Button variant="default" className="rounded-xl">
            Today
          </Button>
        </div>

        {/* Daily Calories Overview */}
        <Card className="mb-8 border-none p-8 shadow-sm">
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Daily Calories</p>
            <div className="mb-4 text-6xl font-bold">{Math.round(totalCalories)}</div>
            <p className="mb-4 text-muted-foreground">Goal: {goalCalories} cal</p>
            <Progress value={calorieProgress} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              {Math.max(goalCalories - totalCalories, 0)} calories remaining
            </p>
          </div>
        </Card>

        {/* Macros Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Protein</p>
              <div className="mb-2 text-3xl font-bold text-accent">
                {Math.round(totalProtein)}g
              </div>
              <Progress
                value={(totalProtein / goalProtein) * 100}
                className="mb-2 h-2"
              />
              <p className="text-xs text-muted-foreground">
                of {goalProtein}g
              </p>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Carbs</p>
              <div className="mb-2 text-3xl font-bold text-warning">
                {Math.round(totalCarbs)}g
              </div>
              <Progress
                value={(totalCarbs / goalCarbs) * 100}
                className="mb-2 h-2"
              />
              <p className="text-xs text-muted-foreground">
                of {goalCarbs}g
              </p>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Fats</p>
              <div className="mb-2 text-3xl font-bold text-destructive">
                {Math.round(totalFats)}g
              </div>
              <Progress
                value={(totalFats / goalFats) * 100}
                className="mb-2 h-2"
              />
              <p className="text-xs text-muted-foreground">of {goalFats}g</p>
            </div>
          </Card>
        </div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Meals</h2>

          <Card className="border-none p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <FontAwesomeIcon icon={faMugHot} className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Breakfast</p>
                  <p className="text-sm text-muted-foreground">{Math.round(breakfastCalories)} cal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/add-meal?type=breakfast")}
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="font-semibold">Lunch</p>
                  <p className="text-sm text-muted-foreground">{Math.round(lunchCalories)} cal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/add-meal?type=lunch")}
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <FontAwesomeIcon icon={faBowlFood} className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold">Dinner</p>
                  <p className="text-sm text-muted-foreground">{Math.round(dinnerCalories)} cal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/add-meal?type=dinner")}
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <FontAwesomeIcon icon={faCookie} className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold">Snacks</p>
                  <p className="text-sm text-muted-foreground">{Math.round(snacksCalories)} cal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/add-meal?type=snacks")}
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Floating Add Button */}
        <Button
          onClick={() => navigate("/dashboard/add-meal")}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
export default Dashboard;
