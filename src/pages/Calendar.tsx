import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowLeft, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createAuthenticatedClient } from "@/lib/supabase";
import { fetchUserProfile, fetchDailyMeals, UserProfile, Meal } from "@/lib/api";
import { getMonthlyLogs } from "@/lib/streaks";

const Calendar = () => {
    const navigate = useNavigate();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { getToken } = useAuth();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [monthlyLogs, setMonthlyLogs] = useState<{ date: string; total_calories: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
    const [isLoadingMeals, setIsLoadingMeals] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!isUserLoaded || !user) return;

            try {
                setIsLoading(true);
                const token = await getToken({ template: 'supabase' });
                if (!token) throw new Error('Failed to get Supabase token');

                const supabase = createAuthenticatedClient(token);

                // Fetch profile for calorie goal
                const profile = await fetchUserProfile(supabase, user.id);
                setUserProfile(profile);

                // Fetch logs for current month
                const month = currentDate.getMonth() + 1; // 1-indexed
                const year = currentDate.getFullYear();
                const logs = await getMonthlyLogs(user.id, month, year);
                setMonthlyLogs(logs || []);

            } catch (error) {
                console.error("Failed to load calendar data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [isUserLoaded, user, currentDate]);

    const handleDateClick = async (date: Date) => {
        setSelectedDate(date);
        setIsLoadingMeals(true);
        try {
            if (user) {
                const token = await getToken({ template: 'supabase' });
                if (token) {
                    const supabase = createAuthenticatedClient(token);
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const meals = await fetchDailyMeals(supabase, user.id, dateStr);
                    setSelectedMeals(meals);
                }
            }
        } catch (error) {
            console.error("Failed to fetch meals for date", error);
        } finally {
            setIsLoadingMeals(false);
        }
    };

    const getColorClass = (calories: number, goal: number) => {
        if (calories === 0) return "bg-muted/20"; // No logs
        const ratio = calories / goal;
        if (ratio > 1.1) return "bg-destructive/20 text-destructive border-destructive/50"; // Red (Over)
        if (ratio < 0.8) return "bg-warning/20 text-warning border-warning/50"; // Yellow (Under)
        return "bg-success/20 text-success border-success/50"; // Green (Good)
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    // Padding days for grid alignment
    const startDay = getDay(startOfMonth(currentDate)); // 0 = Sunday
    const paddingDays = Array(startDay).fill(null);

    if (!isUserLoaded || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 text-primary" />
            </div>
        );
    }

    const goalCalories = userProfile?.calorie_goal || 1910;

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                        <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold">Calendar</h1>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8">
                {/* Month Navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Button variant="outline" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                    <Button variant="outline" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center font-medium text-muted-foreground">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {paddingDays.map((_, i) => (
                        <div key={`padding-${i}`} className="aspect-square" />
                    ))}
                    {daysInMonth.map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const log = monthlyLogs.find(l => l.date === dateStr);
                        const calories = log?.total_calories || 0;
                        const colorClass = calories > 0 ? getColorClass(calories, goalCalories) : "bg-card hover:bg-accent/10";

                        return (
                            <Card
                                key={dateStr}
                                className={`aspect-square p-2 flex flex-col items-center justify-center cursor-pointer transition-colors border ${colorClass}`}
                                onClick={() => handleDateClick(date)}
                            >
                                <span className={`text-sm font-semibold ${!isSameMonth(date, currentDate) ? "text-muted-foreground" : ""}`}>
                                    {format(date, "d")}
                                </span>
                                {calories > 0 && (
                                    <span className="text-xs mt-1 font-medium">{Math.round(calories)}</span>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Meal Details Modal */}
            <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Meals for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
                        </DialogTitle>
                    </DialogHeader>

                    {isLoadingMeals ? (
                        <div className="flex justify-center py-8">
                            <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-primary" />
                        </div>
                    ) : selectedMeals.length > 0 ? (
                        <div className="space-y-4 mt-4">
                            {selectedMeals.map((meal, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-semibold capitalize">{meal.meal_name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{meal.meal_type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{meal.calories} cal</p>
                                        <p className="text-xs text-muted-foreground">
                                            P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t mt-4 flex justify-between font-bold">
                                <span>Total</span>
                                <span>{selectedMeals.reduce((sum, m) => sum + m.calories, 0)} cal</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-muted-foreground">No meals logged for this day.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Calendar;
