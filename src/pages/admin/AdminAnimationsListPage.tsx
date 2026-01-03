import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type Row = {
  id: string;
  name: string;
  category: string;
  created_at?: string;
};

export default function AdminAnimationsListPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<string>('All');

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const attempt = await supabase
        .from('animations')
        .select('id,name,category,created_at')
        .order('created_at', { ascending: false });

      const res = attempt.error
        ? await supabase.from('animations').select('id,name,category')
        : attempt;

      if (res.error) {
        // eslint-disable-next-line no-console
        console.error('[AdminAnimationsListPage] Failed to load animations:', res.error);
      }

      if (cancelled) return;
      setRows((res.data ?? []) as Row[]);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = rows.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || r.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(rows.map((r) => r.category))).filter(Boolean);

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this animation permanently?');
    if (!ok) return;

    await supabase.from('animations').delete().eq('id', id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-black uppercase tracking-tight">Animations</h1>
          <p className="text-zinc-500 text-sm">Manage content</p>
        </div>

        <Link
          to="/voidyx-admin/animations/new"
          className="bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-95 transition-opacity"
        >
          Add animation
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full md:w-96 focus:border-white/30 transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none focus:border-white/30 transition-colors"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-white/[0.06] bg-black/20">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-black/40">
            <tr>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Name</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Category</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-white/90">{r.name}</td>
                <td className="p-4 text-zinc-500">{r.category}</td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/voidyx-admin/animations/${r.id}/edit`}
                      className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => void onDelete(r.id)}
                      className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td className="p-10 text-zinc-500" colSpan={3}>
                  No animations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
