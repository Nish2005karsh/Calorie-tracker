-- 1. Drop existing policies that depend on the user_id column
-- We must drop these because they are strongly typed to the old UUID column.
DROP POLICY IF EXISTS "Users can view their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can insert their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can update their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can delete their own meals" ON daily_meals;

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- 2. Drop Foreign Key constraints (if not already dropped)
ALTER TABLE daily_meals DROP CONSTRAINT IF EXISTS daily_meals_user_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- 3. Change user_id column type to TEXT
ALTER TABLE daily_meals ALTER COLUMN user_id TYPE text;
ALTER TABLE user_profiles ALTER COLUMN user_id TYPE text;

-- 4. Re-create Policies compatible with Clerk IDs (Text)
-- We use (auth.jwt() ->> 'sub') to get the user ID from the token as text.
-- This works for both Supabase Auth and Clerk (if configured).

-- Policies for daily_meals
CREATE POLICY "Users can view their own meals" ON daily_meals 
FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own meals" ON daily_meals 
FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own meals" ON daily_meals 
FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete their own meals" ON daily_meals 
FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles 
FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own profile" ON user_profiles 
FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own profile" ON user_profiles 
FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));
