/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Remove manual ImportMetaEnv and ImportMeta interfaces
// Vite already provides the correct types via the reference above

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);