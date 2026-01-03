-- Create the animations table
CREATE TABLE IF NOT EXISTS animations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  complexity TEXT,
  html TEXT,
  css TEXT,
  js TEXT,
  cdn_links JSONB DEFAULT '[]'::jsonb,
  config JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read (Select)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'animations'
      AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON animations
      FOR SELECT
      USING (true);
  END IF;
END $$;
