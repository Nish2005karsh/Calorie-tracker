import { supabase } from './supabase';

export interface Meal {
    id?: string;
    user_id?: string;
    date: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'snack';
    meal_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    confidence_score?: number;
    health_score?: number;
    image_url?: string;
    created_at?: string;
}

export interface UserProfile {
    id?: string;
    user_id: string;
    gender?: string;
    workout_frequency?: string;
    calorie_goal: number;
    protein_goal: number;
    carbs_goal: number;
    fats_goal: number;
    desired_weight?: number;
    current_weight?: number;
    health_score?: number;
}

// Fetch all meals for a specific date
export const fetchDailyMeals = async (client: any, userId: string, date: string) => {
    const { data, error } = await client
        .from('daily_meals')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);

    if (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }

    return data as Meal[];
};

// Add a new meal
export const addMeal = async (client: any, userId: string, meal: Omit<Meal, 'user_id'>) => {
    const { data, error } = await client
        .from('daily_meals')
        .insert([
            {
                ...meal,
                user_id: userId,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error adding meal:', error);
        throw error;
    }

    return data;
};

// Delete a meal
export const deleteMeal = async (client: any, mealId: string) => {
    const { error } = await client
        .from('daily_meals')
        .delete()
        .eq('id', mealId);

    if (error) {
        console.error('Error deleting meal:', error);
        throw error;
    }
};

// Update a meal
export const updateMeal = async (client: any, mealId: string, updates: Partial<Meal>) => {
    const { data, error } = await client
        .from('daily_meals')
        .update(updates)
        .eq('id', mealId)
        .select()
        .single();

    if (error) {
        console.error('Error updating meal:', error);
        throw error;
    }

    return data;
};

// Fetch user profile
export const fetchUserProfile = async (client: any, userId: string) => {
    const { data, error } = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }

    return data as UserProfile | null;
};

// Create or update user profile
export const updateUserProfile = async (client: any, userId: string, updates: Partial<UserProfile>) => {
    // Check if profile exists
    const { data: existingProfile } = await client
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    let data, error;

    if (existingProfile) {
        // Update
        ({ data, error } = await client
            .from('user_profiles')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single());
    } else {
        // Insert
        ({ data, error } = await client
            .from('user_profiles')
            .insert([
                {
                    user_id: userId,
                    ...updates,
                },
            ])
            .select()
            .single());
    }

    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }

    return data;
};

// Log weight
export const logWeight = async (client: any, userId: string, weight: number, date: string) => {
    // Check if weight log exists for this date
    const { data: existingLog } = await client
        .from('weight_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle();

    let error;

    if (existingLog) {
        // Update
        ({ error } = await client
            .from('weight_logs')
            .update({ weight })
            .eq('id', existingLog.id));
    } else {
        // Insert
        ({ error } = await client
            .from('weight_logs')
            .insert([{ user_id: userId, weight, date }]));
    }

    if (error) {
        console.error('Error logging weight:', error);
        throw error;
    }
};

// Fetch weight history
export const fetchWeightHistory = async (client: any, userId: string) => {
    const { data, error } = await client
        .from('weight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching weight history:', error);
        throw error;
    }

    return data;
};
