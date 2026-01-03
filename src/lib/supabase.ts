/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Remove manual ImportMetaEnv and ImportMeta interfaces
// Vite already provides the correct types via the reference above

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;