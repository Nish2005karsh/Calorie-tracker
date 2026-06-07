-- =====================================================================
-- CalorieAI — complete database setup for a FRESH Supabase project.
-- Run this whole file once in the Supabase SQL Editor.
-- All tables key on the Clerk user id (text) and use RLS that matches
-- the Clerk JWT's `sub` claim: auth.jwt() ->> 'sub'.
-- =====================================================================

-- ---------- daily_meals ----------
CREATE TABLE IF NOT EXISTS daily_meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL,
  meal_name text NOT NULL,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  fiber numeric NOT NULL DEFAULT 0,
  sugar numeric NOT NULL DEFAULT 0,
  sodium numeric NOT NULL DEFAULT 0,
  confidence_score numeric,
  health_score int,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can insert their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can update their own meals" ON daily_meals;
DROP POLICY IF EXISTS "Users can delete their own meals" ON daily_meals;
CREATE POLICY "Users can view their own meals" ON daily_meals
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own meals" ON daily_meals
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update their own meals" ON daily_meals
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can delete their own meals" ON daily_meals
  FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));

-- ---------- user_profiles ----------
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL UNIQUE,
  gender text,
  workout_frequency text,
  calorie_goal int DEFAULT 0,
  protein_goal int DEFAULT 0,
  carbs_goal int DEFAULT 0,
  fats_goal int DEFAULT 0,
  desired_weight numeric,
  current_weight numeric,
  health_score int,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

-- ---------- user_streaks ----------
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id text PRIMARY KEY,
  streak_start_date date NOT NULL DEFAULT CURRENT_DATE,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_log_date date
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON user_streaks;
CREATE POLICY "Users can view their own streaks" ON user_streaks
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own streaks" ON user_streaks
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update their own streaks" ON user_streaks
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

-- ---------- user_badges ----------
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  badge_name text NOT NULL,
  day_requirement int,
  achieved_at timestamptz DEFAULT now()
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own badges" ON user_badges
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- ---------- weight_logs ----------
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  weight numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can insert their own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can update their own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can delete their own weight logs" ON weight_logs;
CREATE POLICY "Users can view their own weight logs" ON weight_logs
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own weight logs" ON weight_logs
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update their own weight logs" ON weight_logs
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can delete their own weight logs" ON weight_logs
  FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));

-- ---------- water_logs ----------
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  glasses int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can insert their own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can update their own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can delete their own water logs" ON water_logs;
CREATE POLICY "Users can view their own water logs" ON water_logs
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert their own water logs" ON water_logs
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update their own water logs" ON water_logs
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));
CREATE POLICY "Users can delete their own water logs" ON water_logs
  FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));
  
