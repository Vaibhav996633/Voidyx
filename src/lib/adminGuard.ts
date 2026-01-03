import { supabase } from './supabase';

export async function requireAdmin() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    // Surface real PostgREST/Postgres failures (e.g., missing table, RLS/grants issues)
    throw new Error(`ADMIN_CHECK_FAILED:${error.message}`);
  }

  if (!data) {
    throw new Error('NOT_ADMIN');
  }

  return user;
}
