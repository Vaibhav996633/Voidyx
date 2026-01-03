# Supabase

## Setup

1. Create a Supabase project.
2. In the Supabase Dashboard → SQL Editor, run the schema in [schema.sql](schema.sql).
3. Seed the `animations` table (Table Editor is fine).

## Environment variables

For local dev, set these (Vite):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The frontend reads them in [src/lib/supabase.ts](../../src/lib/supabase.ts).
