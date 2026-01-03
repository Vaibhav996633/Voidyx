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

-- Optional: Premium animations table (used by the app)
CREATE TABLE IF NOT EXISTS premium_animations (
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

-- Admin allowlist table (checked by requireAdmin() in the frontend)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

ALTER TABLE premium_animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper: is the current authed user an admin?
-- Note: service_role and postgres bypass RLS anyway.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  );
$$;

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

-- Public read for premium_animations (so the public gallery can show premium items).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'premium_animations'
      AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON premium_animations
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin-only writes for animations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'animations' AND policyname = 'Admin write access'
  ) THEN
    CREATE POLICY "Admin write access"
      ON animations
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admin write access (update)"
      ON animations
      FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admin write access (delete)"
      ON animations
      FOR DELETE
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- Admin-only writes for premium_animations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'premium_animations' AND policyname = 'Admin write access'
  ) THEN
    CREATE POLICY "Admin write access"
      ON premium_animations
      FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admin write access (update)"
      ON premium_animations
      FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    CREATE POLICY "Admin write access (delete)"
      ON premium_animations
      FOR DELETE
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- admin_users visibility (a user can see their own row; admins can manage the list)
DO $$
BEGIN
  -- IMPORTANT:
  -- Never reference public.is_admin() in admin_users policies.
  -- public.is_admin() reads admin_users, and referencing it here causes infinite recursion.

  -- Remove any previously-created recursive policies.
  DROP POLICY IF EXISTS "Admin manage" ON admin_users;
  DROP POLICY IF EXISTS "Admin write access" ON admin_users;
  DROP POLICY IF EXISTS "Admin write access (update)" ON admin_users;
  DROP POLICY IF EXISTS "Admin write access (delete)" ON admin_users;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_users' AND policyname = 'Self read'
  ) THEN
    CREATE POLICY "Self read"
      ON admin_users
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Grants required for PostgREST (missing GRANTs can lead to server errors)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.animations TO anon, authenticated;
GRANT SELECT ON TABLE public.premium_animations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.animations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.premium_animations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO authenticated;
