import { supabase } from './supabase';

export const fetchWeeklyStats = async (userId: string) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const startStr = sevenDaysAgo.toISOString().split('T')[0];
    const endStr = today.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_meals')
        .select('date, calories, protein, carbs, fat')
        .eq('user_id', userId)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching weekly stats:', error);
        return [];
    }
    return data;
};

export const fetchMonthlyStats = async (userId: string) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const startStr = thirtyDaysAgo.toISOString().split('T')[0];
    const endStr = today.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_meals')
        .select('date, calories, protein, carbs, fat')
        .eq('user_id', userId)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching monthly stats:', error);
        return [];
    }
    return data;
};
