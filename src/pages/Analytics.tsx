import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createAuthenticatedClient } from "@/lib/supabase";
import { fetchUserProfile, fetchWeightHistory } from "@/lib/api";
import { fetchWeeklyStats, fetchMonthlyStats } from "@/lib/analytics";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const Analytics = () => {
    const navigate = useNavigate();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { getToken } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [calorieGoal, setCalorieGoal] = useState(2000);

    useEffect(() => {
        const loadData = async () => {
            if (!isUserLoaded || !user) return;

            try {
                setIsLoading(true);
                const token = await getToken({ template: 'supabase' });
                if (!token) throw new Error('Failed to get Supabase token');

                const supabase = createAuthenticatedClient(token);

                const [profile, weekly, monthly, weight] = await Promise.all([
                    fetchUserProfile(supabase, user.id),
                    fetchWeeklyStats(user.id),
                    fetchMonthlyStats(user.id),
                    fetchWeightHistory(supabase, user.id),
                ]);

                if (profile) setCalorieGoal(profile.calorie_goal);
                setWeeklyStats(weekly || []);
                setMonthlyStats(monthly || []);
                setWeightHistory(weight || []);

            } catch (error) {
                console.error("Failed to load analytics data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [isUserLoaded, user]);

    if (!isUserLoaded || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <FontAwesomeIcon icon={faSpinner} spin className="h-12 w-12 text-primary" />
            </div>
        );
    }

    // Process data for charts
    const weeklyData = weeklyStats.map(stat => ({
        name: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: stat.calories,
        goal: calorieGoal,
    }));

    const macroData = weeklyStats.map(stat => ({
        name: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
        protein: stat.protein,
        carbs: stat.carbs,
        fat: stat.fat,
    }));

    const weightData = weightHistory.map(log => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: log.weight,
    }));

    // Calculate averages
    const avgCalories = weeklyStats.reduce((sum, s) => sum + s.calories, 0) / (weeklyStats.length || 1);
    const avgProtein = weeklyStats.reduce((sum, s) => sum + s.protein, 0) / (weeklyStats.length || 1);
    const avgCarbs = weeklyStats.reduce((sum, s) => sum + s.carbs, 0) / (weeklyStats.length || 1);
    const avgFat = weeklyStats.reduce((sum, s) => sum + s.fat, 0) / (weeklyStats.length || 1);

    const avgMacroData = [
        { name: 'Protein', value: avgProtein, color: '#f97316' }, // orange-500
        { name: 'Carbs', value: avgCarbs, color: '#eab308' },    // yellow-500
        { name: 'Fat', value: avgFat, color: '#ef4444' },       // red-500
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                        <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold">Analytics</h1>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">

                {/* Weekly Calories */}
                <Card className="p-6 border-none shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Weekly Calories</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="goal" stroke="#ef4444" strokeDasharray="5 5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                        Average: {Math.round(avgCalories)} kcal / day
                    </p>
                </Card>

                {/* Macro Trends */}
                <Card className="p-6 border-none shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Macro Trends (Last 7 Days)</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={macroData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="protein" stackId="1" stroke="#f97316" fill="#f97316" />
                                <Area type="monotone" dataKey="carbs" stackId="1" stroke="#eab308" fill="#eab308" />
                                <Area type="monotone" dataKey="fat" stackId="1" stroke="#ef4444" fill="#ef4444" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Average Macro Distribution */}
                <Card className="p-6 border-none shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Average Macro Distribution</h2>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={avgMacroData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {avgMacroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Weight Progress */}
                <Card className="p-6 border-none shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default Analytics;
