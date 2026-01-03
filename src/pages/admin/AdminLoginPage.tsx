import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const from = (location.state as any)?.from as string | undefined;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate(from ?? '/voidyx-admin/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isNetwork = /Failed to fetch/i.test(message);
      setError(
        isNetwork
          ? 'Network error contacting Supabase Auth (request closed). Check internet/VPN, firewall/antivirus, and disable adblock for *.supabase.co.'
          : message
      );
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-8 border border-white/[0.06] bg-black/40 px-8 py-10">
        <div className="space-y-2">
          <p className="text-white/80 font-heading font-black uppercase tracking-tighter text-3xl">VOIDYX</p>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.6em]">Admin access</p>
        </div>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-4 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
            autoComplete="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-4 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-red-400 text-[11px]">{error}</p>}

        {!isSupabaseConfigured && (
          <p className="text-amber-300/80 text-[11px]">
            Missing config: set <span className="font-mono">VITE_SUPABASE_URL</span> and{' '}
            <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isSupabaseConfigured}
            className="w-full bg-white text-black px-6 py-4 text-[10px] font-black uppercase tracking-[0.5em] disabled:opacity-50 hover:opacity-95 transition-opacity"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
