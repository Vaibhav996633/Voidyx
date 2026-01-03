import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requireAdmin } from '../../lib/adminGuard';

type Props = {
  children: React.ReactNode;
};

export default function AdminGate({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = React.useState(false);
  const [fatalError, setFatalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await requireAdmin();
        if (!cancelled) setReady(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (cancelled) return;

        if (msg === 'NOT_AUTHENTICATED') {
          navigate('/voidyx-admin/login', { replace: true, state: { from: location.pathname } });
          return;
        }

        if (msg.startsWith('ADMIN_CHECK_FAILED:')) {
          setFatalError(msg.replace('ADMIN_CHECK_FAILED:', '').trim() || 'Admin check failed');
          return;
        }

        navigate('/', { replace: true });
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate, location.pathname]);

  if (fatalError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="border border-white/[0.06] bg-black/40 px-8 py-10 w-full max-w-xl space-y-4">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.6em]">Admin error</p>
          <p className="text-white/90 text-sm">
            Supabase returned an internal error while checking admin access.
          </p>
          <p className="text-red-300 text-[11px] font-mono break-words">{fatalError}</p>
          <p className="text-zinc-500 text-xs">
            This usually means the `admin_users` table or its RLS/GRANT policies are missing or misconfigured.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="border border-white/[0.06] bg-black/40 px-8 py-10 w-full max-w-md">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.6em]">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
