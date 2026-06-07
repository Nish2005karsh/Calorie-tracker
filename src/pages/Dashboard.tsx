import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPlus,
  faMugHot,
  faUtensils,
  faBowlFood,
  faCookie,
  faSpinner,
  faFire,
  faCalendarAlt,
  faMedal,
  faChartPie,
  faWeightScale,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faGlassWater,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { fetchDailyMeals, fetchUserProfile, deleteMeal, Meal, UserProfile, logWeight, getWaterGlasses, setWaterGlasses } from "@/lib/api";
import { createAuthenticatedClient } from "@/lib/supabase";
import { getStreak, getBadges, Streak, Badge } from "@/lib/streaks";
import { getLocalDateString } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { addDays, isToday, format } from "date-fns";
import { toast } from "sonner";

const MEAL_CATEGORIES = [
  { type: "breakfast", label: "Breakfast", icon: faMugHot, bg: "bg-accent/10", text: "text-accent" },
  { type: "lunch", label: "Lunch", icon: faUtensils, bg: "bg-warning/10", text: "text-warning" },
  { type: "dinner", label: "Dinner", icon: faBowlFood, bg: "bg-destructive/10", text: "text-destructive" },
  { type: "snacks", label: "Snacks", icon: faCookie, bg: "bg-success/10", text: "text-success" },
] as const;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = getLocalDateString(selectedDate);
  const viewingToday = isToday(selectedDate);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [weight, setWeight] = useState("");
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);

  const WATER_GOAL = 8; // glasses per day
  const [water, setWater] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!isUserLoaded || !user) return;

      try {
        setIsLoading(true);
        const supabase = createAuthenticatedClient(getToken);

        const [fetchedMeals, fetchedProfile, fetchedStreak, fetchedBadges, fetchedWater] = await Promise.all([
          fetchDailyMeals(supabase, user.id, dateStr),
          fetchUserProfile(supabase, user.id),
          getStreak(supabase, user.id),
          getBadges(supabase, user.id),
          getWaterGlasses(supabase, user.id, dateStr),
        ]);

        setMeals(fetchedMeals);
        setUserProfile(fetchedProfile);
        setStreak(fetchedStreak);
        setBadges(fetchedBadges);
        setWater(fetchedWater);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isUserLoaded, user, dateStr]);

  const handleLogWeight = async () => {
    if (!weight || !user) return;
    setIsLoggingWeight(true);
    try {
      const supabase = createAuthenticatedClient(getToken);
      await logWeight(supabase, user.id, parseFloat(weight), dateStr);
      setWeight("");
      toast.success("Weight logged!");
    } catch (error) {
      console.error("Failed to log weight", error);
      toast.error("Failed to log weight.");
    } finally {
      setIsLoggingWeight(false);
    }
  };

  const handleAdjustWater = async (delta: number) => {
    if (!user) return;
    const next = Math.max(water + delta, 0);
    const previous = water;
    setWater(next); // optimistic
    try {
      const supabase = createAuthenticatedClient(getToken);
      await setWaterGlasses(supabase, user.id, dateStr, next);
    } catch (error) {
      console.error("Failed to update water", error);
      toast.error("Failed to update water.");
      setWater(previous); // rollback
    }
  };

  const handleDeleteMeal = async (mealId?: string) => {
    if (!mealId || !user) return;
    const previous = meals;
    setMeals((prev) => prev.filter((m) => m.id !== mealId)); // optimistic
    try {
      const supabase = createAuthenticatedClient(getToken);
      await deleteMeal(supabase, mealId);
      toast.success("Meal deleted");
    } catch (error) {
      console.error("Failed to delete meal", error);
      toast.error("Failed to delete meal.");
      setMeals(previous); // rollback
    }
  };

  const mealsForType = (type: string) =>
    meals.filter((m) => m.meal_type === type || (type === "snacks" && m.meal_type === "snack"));

  // Calculate totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fat, 0);

  // Use profile goals or defaults
  const goalCalories = userProfile?.calorie_goal || 1910;
  const goalProtein = userProfile?.protein_goal || 136;
  const goalCarbs = userProfile?.carbs_goal || 221;
  const goalFats = userProfile?.fats_goal || 53;

  const calorieProgress = Math.min((totalCalories / goalCalories) * 100, 100);

  const macroData = [
    { name: 'Protein', value: totalProtein, color: '#f97316' },
    { name: 'Carbs', value: totalCarbs, color: '#eab308' },
    { name: 'Fats', value: totalFats, color: '#ef4444' },
  ];

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
            <Button variant="ghost" size="icon" onClick={() => navigate("/analytics")}>
              <FontAwesomeIcon icon={faChartPie} className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/calendar")}>
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Date Selector */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDate((d) => addDays(d, -1))}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Button variant="default" className="rounded-xl min-w-[140px]">
            {viewingToday ? "Today" : format(selectedDate, "EEE, MMM d")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            disabled={viewingToday}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
          {!viewingToday && (
            <Button variant="outline" className="rounded-xl" onClick={() => setSelectedDate(new Date())}>
              Jump to Today
            </Button>
          )}
        </div>

        {/* Streak & Badges Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card className="border-none p-6 shadow-sm flex items-center justify-between bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
                <FontAwesomeIcon icon={faFire} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak?.current_streak || 0} Days</p>
              </div>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <FontAwesomeIcon icon={faMedal} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{badges.length}</p>
              </div>
            </div>
            {badges.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Latest: {badges[badges.length - 1].badge_name}
              </div>
            )}
          </Card>
        </div>

        {/* Daily Calories Overview */}
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card className="border-none p-8 shadow-sm">
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

          {/* Macro Pie Chart */}
          <Card className="border-none p-6 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold mb-4">Macro Distribution</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" /> Protein
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500" /> Carbs
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" /> Fats
              </div>
            </div>
          </Card>
        </div>

        {/* Weight Logging */}
        <Card className="mb-8 border-none p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
              <FontAwesomeIcon icon={faWeightScale} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Log Weight</h3>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="kg"
                className="w-24"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Button onClick={handleLogWeight} disabled={isLoggingWeight}>
                {isLoggingWeight ? <FontAwesomeIcon icon={faSpinner} spin /> : "Log"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Water Tracking */}
        <Card className="mb-8 border-none p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/20">
              <FontAwesomeIcon icon={faGlassWater} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Water</h3>
              <p className="text-sm text-muted-foreground">
                {water} / {WATER_GOAL} glasses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAdjustWater(-1)}
                disabled={water <= 0}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <span className="w-8 text-center text-lg font-bold">{water}</span>
              <Button variant="outline" size="icon" onClick={() => handleAdjustWater(1)}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </div>
          <Progress value={Math.min((water / WATER_GOAL) * 100, 100)} className="mt-4 h-2" />
        </Card>

        {/* Macros Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Protein</p>
              <div className="mb-2 text-3xl font-bold text-accent">{Math.round(totalProtein)}g</div>
              <Progress value={(totalProtein / goalProtein) * 100} className="mb-2 h-2" />
              <p className="text-xs text-muted-foreground">of {goalProtein}g</p>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Carbs</p>
              <div className="mb-2 text-3xl font-bold text-warning">{Math.round(totalCarbs)}g</div>
              <Progress value={(totalCarbs / goalCarbs) * 100} className="mb-2 h-2" />
              <p className="text-xs text-muted-foreground">of {goalCarbs}g</p>
            </div>
          </Card>

          <Card className="border-none p-6 shadow-sm">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold">Fats</p>
              <div className="mb-2 text-3xl font-bold text-destructive">{Math.round(totalFats)}g</div>
              <Progress value={(totalFats / goalFats) * 100} className="mb-2 h-2" />
              <p className="text-xs text-muted-foreground">of {goalFats}g</p>
            </div>
          </Card>
        </div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{viewingToday ? "Today's Meals" : "Meals"}</h2>

          {MEAL_CATEGORIES.map((cat) => {
            const items = mealsForType(cat.type);
            const catCalories = items.reduce((sum, m) => sum + m.calories, 0);
            return (
              <Card key={cat.type} className="border-none p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cat.bg}`}>
                      <FontAwesomeIcon icon={cat.icon} className={`h-6 w-6 ${cat.text}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{cat.label}</p>
                      <p className="text-sm text-muted-foreground">{Math.round(catCalories)} cal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/dashboard/add-meal?type=${cat.type}&date=${dateStr}`)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                  </Button>
                </div>

                {/* Individual logged items for this category */}
                {items.length > 0 && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {items.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{meal.meal_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(meal.calories)} cal · P {Math.round(meal.protein)}g · C{" "}
                            {Math.round(meal.carbs)}g · F {Math.round(meal.fat)}g
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteMeal(meal.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Floating Add Button */}
        <Button
          onClick={() => navigate(`/dashboard/add-meal?date=${dateStr}`)}
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
