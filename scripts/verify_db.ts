import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://drvylbsfmpymsjjxbnfj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRydnlsYnNmbXB5bXNqanhibmZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjI4MDEsImV4cCI6MjA3OTQzODgwMX0.jIA0mnCVyvSuPrXXE_YcpnwOAz50s0ZaHjCubzNVxx4"

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
    console.log('Starting full verification flow...');

    // 1. Create a random test user
    const email = `test.user.${Date.now()}@gmail.com`;
    const password = 'TestPassword123!';
    console.log(`Attempting to sign up user: ${email}`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        console.error('Error creating test user:', JSON.stringify(authError, null, 2));
        return;
    }

    const userId = authData.user?.id;
    if (!userId) {
        console.error('User created but no ID returned. Session:', authData.session);
        console.log('If session is null, email confirmation might be required.');
        // If we have no session, we can't proceed with RLS checks that require auth.
        if (!authData.session) {
            console.warn('Cannot proceed with INSERT test because no session was established (email confirmation likely required).');
            return;
        }
    }

    console.log(`User created with ID: ${userId}`);

    // 2. Insert a test meal
    const testMeal = {
        user_id: userId,
        date: new Date().toISOString().split('T')[0],
        meal_type: 'breakfast',
        meal_name: 'Test Meal',
        calories: 500,
        protein: 20,
        carbs: 50,
        fat: 10,
        fiber: 5,
        sugar: 5,
        sodium: 100
    };

    console.log('Attempting to insert test meal...');
    const { data: insertData, error: insertError } = await supabase
        .from('daily_meals')
        .insert([testMeal])
        .select()
        .single();

    if (insertError) {
        console.error('Error inserting meal:', JSON.stringify(insertError, null, 2));
    } else {
        console.log('Meal inserted successfully:', insertData);
    }

    // 3. Read it back
    console.log('Attempting to read back the meal...');
    const { data: readData, error: readError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_name', 'Test Meal');

    if (readError) {
        console.error('Error reading meal:', JSON.stringify(readError, null, 2));
    } else {
        console.log(`Read back ${readData?.length} meals.`);
        if (readData && readData.length > 0) {
            console.log('Verification SUCCESS: Data is being stored and retrieved.');
        } else {
            console.log('Verification FAILED: Meal was inserted but could not be read back (RLS issue?).');
        }
    }
}

verify();
