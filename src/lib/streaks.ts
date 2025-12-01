import { supabase } from './supabase';

export interface Streak {
    user_id: string;
    streak_start_date: string;
    current_streak: number;
    longest_streak: number;
    last_log_date: string;
}

export interface Badge {
    id: string;
    user_id: string;
    badge_name: string;
    day_requirement: number;
    achieved_at: string;
}

export const getStreak = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching streak:', error);
        return null;
    }
    return data as Streak | null;
};

export const updateStreak = async (userId: string, logDate: Date) => {
    const today = new Date(logDate);
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    let streak = await getStreak(userId);

    if (!streak) {
        // Create new streak record
        const { error } = await supabase.from('user_streaks').insert({
            user_id: userId,
            streak_start_date: todayStr,
            current_streak: 1,
            longest_streak: 1,
            last_log_date: todayStr,
        });
        if (error) console.error('Error creating streak:', error);
        return;
    }

    const lastLogDate = new Date(streak.last_log_date);
    lastLogDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastLogDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Already logged today, do nothing
        return;
    } else if (diffDays === 1) {
        // Consecutive day
        const newCurrent = streak.current_streak + 1;
        const newLongest = Math.max(streak.longest_streak, newCurrent);

        const { error } = await supabase
            .from('user_streaks')
            .update({
                current_streak: newCurrent,
                longest_streak: newLongest,
                last_log_date: todayStr,
            })
            .eq('user_id', userId);

        if (error) console.error('Error updating streak:', error);

        // Check for badges
        await checkAndAwardBadges(userId, newCurrent);

    } else {
        // Streak broken
        const { error } = await supabase
            .from('user_streaks')
            .update({
                current_streak: 1,
                streak_start_date: todayStr,
                last_log_date: todayStr,
            })
            .eq('user_id', userId);

        if (error) console.error('Error resetting streak:', error);
    }
};

export const getBadges = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching badges:', error);
        return [];
    }
    return data as Badge[];
};

export const checkAndAwardBadges = async (userId: string, currentStreak: number) => {
    const badgesToAward = [];

    if (currentStreak >= 3) badgesToAward.push({ name: '3-Day Streak', req: 3 });
    if (currentStreak >= 7) badgesToAward.push({ name: '7-Day Hero', req: 7 });
    if (currentStreak >= 10) badgesToAward.push({ name: '10-Day Champion', req: 10 });
    if (currentStreak >= 14) badgesToAward.push({ name: '14-Day Consistency', req: 14 });
    if (currentStreak >= 21) badgesToAward.push({ name: '21-Day Habit Builder', req: 21 });

    // Fetch existing badges to avoid duplicates
    const existingBadges = await getBadges(userId);
    const existingNames = new Set(existingBadges.map(b => b.badge_name));

    for (const badge of badgesToAward) {
        if (!existingNames.has(badge.name)) {
            const { error } = await supabase.from('user_badges').insert({
                user_id: userId,
                badge_name: badge.name,
                day_requirement: badge.req,
            });
            if (error) console.error(`Error awarding badge ${badge.name}:`, error);
        }
    }
};

export const getMonthlyLogs = async (userId: string, month: number, year: number) => {
    // Month is 0-indexed in JS Date, but let's assume 1-indexed for API or handle accordingly.
    // Let's use 1-indexed for the argument to be clear.

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_meals')
        .select('date, total_calories')
        .eq('user_id', userId)
        .gte('date', startStr)
        .lte('date', endStr);

    if (error) {
        console.error('Error fetching monthly logs:', error);
        return [];
    }
    return data;
};
