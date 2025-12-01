-- Create user_streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id text PRIMARY KEY, -- Removed FK to auth.users because we use Clerk IDs (text)
  streak_start_date date NOT NULL DEFAULT CURRENT_DATE,
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_log_date date
);

-- Create badges table (definitions of badges)
-- Actually, the user request implies a structure where we store earned badges. 
-- "badges: { id: uuid, user_id: uuid, badge_name: string, day_requirement: number, achieved_at: timestamp }"
-- This looks like a "user_badges" table. I will name it 'user_badges' to be clear it stores earned badges.

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL, -- Removed FK to auth.users
  badge_name text NOT NULL,
  day_requirement int, -- Optional, as some badges might not be day-based
  achieved_at timestamptz DEFAULT now()
);

-- RLS Policies

-- user_streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks" ON user_streaks
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own streaks" ON user_streaks
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own streaks" ON user_streaks
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

-- user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" ON user_badges
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own badges" ON user_badges
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
