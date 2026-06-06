// Like streaks.ts, these take an authenticated Supabase `client`. The anon
// client returns nothing under RLS.
import { getLocalDateString } from './utils';

interface DailyTotal {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

// daily_meals stores one row per meal. The charts expect one row per DAY, so we
// sum the meals of each date here. Without this, a day with 3 meals shows up as
// 3 separate points on the chart.
const aggregateByDate = (rows: any[]): DailyTotal[] => {
    const byDate = new Map<string, DailyTotal>();
    for (const row of rows) {
        const existing = byDate.get(row.date) || {
            date: row.date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
        };
        existing.calories += row.calories || 0;
        existing.protein += row.protein || 0;
        existing.carbs += row.carbs || 0;
        existing.fat += row.fat || 0;
        byDate.set(row.date, existing);
    }
    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const fetchStatsSince = async (client: any, userId: string, daysAgo: number) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - daysAgo);

    const startStr = getLocalDateString(start);
    const endStr = getLocalDateString(today);

    const { data, error } = await client
        .from('daily_meals')
        .select('date, calories, protein, carbs, fat')
        .eq('user_id', userId)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching stats:', error);
        return [];
    }
    return aggregateByDate(data || []);
};

export const fetchWeeklyStats = (client: any, userId: string) =>
    fetchStatsSince(client, userId, 6);

export const fetchMonthlyStats = (client: any, userId: string) =>
    fetchStatsSince(client, userId, 29);
