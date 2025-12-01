-- Create weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL, -- Clerk ID
  weight numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight logs" ON weight_logs
  FOR SELECT USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own weight logs" ON weight_logs
  FOR INSERT WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own weight logs" ON weight_logs
  FOR UPDATE USING (user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete their own weight logs" ON weight_logs
  FOR DELETE USING (user_id = (auth.jwt() ->> 'sub'));
