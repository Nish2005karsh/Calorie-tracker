-- Create water_logs table (one row per user per day)
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL, -- Clerk ID
  date date NOT NULL DEFAULT CURRENT_DATE,
  glasses int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

-- RLS Policies
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own water logs" ON water_logs
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own water logs" ON water_logs
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own water logs" ON water_logs
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete their own water logs" ON water_logs
  FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));
