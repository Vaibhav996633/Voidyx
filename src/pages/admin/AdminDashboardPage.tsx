import React from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
  const [total, setTotal] = React.useState<number>(0);
  const [featured, setFeatured] = React.useState<number>(0);
  const [recentNames, setRecentNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // total
      const totalRes = await supabase.from('animations').select('*', { count: 'exact', head: true });

      // featured (optional: only if column exists)
      const featuredRes = await supabase
        .from('animations')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true as any);

      // recent (prefer created_at ordering; fall back if missing)
      const recentAttempt = await supabase
        .from('animations')
        .select('name')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentRes = recentAttempt.error
        ? await supabase.from('animations').select('name').limit(5)
        : recentAttempt;

      if (featuredRes.error) {
        // eslint-disable-next-line no-console
        console.warn('[AdminDashboardPage] Featured query failed (optional):', featuredRes.error);
      }
      if (recentRes.error) {
        // eslint-disable-next-line no-console
        console.warn('[AdminDashboardPage] Recent query failed:', recentRes.error);
      }

      if (cancelled) return;
      setTotal(totalRes.count ?? 0);
      setFeatured(featuredRes.error ? 0 : featuredRes.count ?? 0);
      setRecentNames((recentRes.data ?? []).map((r: any) => r.name).filter(Boolean));
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Content overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black border border-white/[0.06] p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-500">Total</p>
          <p className="text-4xl font-heading font-black mt-3">{total}</p>
        </div>
        <div className="bg-black border border-white/[0.06] p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-500">Featured</p>
          <p className="text-4xl font-heading font-black mt-3">{featured}</p>
        </div>
        <div className="bg-black border border-white/[0.06] p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-zinc-500">Recently added</p>
          <div className="mt-3 space-y-1">
            {recentNames.length ? (
              recentNames.map((n) => (
                <p key={n} className="text-sm text-white/80">
                  {n}
                </p>
              ))
            ) : (
              <p className="text-sm text-zinc-500">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
