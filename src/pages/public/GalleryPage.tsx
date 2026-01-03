import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimationCard from '../../components/AnimationCard';
import { useGallery } from '../../hooks/useGallery';
import type { Category } from '../../types';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'Text'];

export default function GalleryPage() {
  const navigate = useNavigate();
  const { free, premium, loading } = useGallery();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<Category | 'All'>('All');

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-8 relative overflow-hidden">
        <div className="relative z-10 text-center space-y-6 animate-fade-in">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.8em]">Loading library…</p>
        </div>
      </main>
    );
  }

  const all = [...free, ...premium];
  const premiumIds = new Set(premium.map((p) => p.id));

  const filtered = all.filter((anim) => {
    const matchesCategory = category === 'All' || anim.category === category;
    const s = search.toLowerCase();
    const matchesSearch =
      anim.name.toLowerCase().includes(s) || (anim.description ?? '').toLowerCase().includes(s);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col space-y-12">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors w-fit"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Back to Hub</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/[0.03] pb-12">
            <div className="space-y-4">
              <h1 className="text-8xl font-heading font-black text-white uppercase tracking-tighter">Vault</h1>
              <p className="text-zinc-meta text-xl font-light tracking-tight italic">Registry of Generative Units.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center w-full md:w-auto">
              <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-none overflow-x-auto no-scrollbar max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-8 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${
                      category === cat ? 'bg-white text-black' : 'text-zinc-meta hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative group w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search library..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-black border border-white/[0.05] rounded-none px-8 py-4 text-[11px] font-light tracking-widest text-white focus:border-white/40 outline-none w-full transition-all"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-dim pointer-events-none text-[9px] font-mono">/SEARCH</div>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">All Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filtered.length ? (
              filtered.map((anim) => (
                <AnimationCard
                  key={anim.id}
                  animation={anim}
                  onClick={(id) => navigate(`/animations/${id}`)}
                  premium={premiumIds.has(anim.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-60 text-center space-y-4">
                <p className="text-zinc-dim font-mono text-[11px] uppercase tracking-[0.8em]">Unit Not Found // Reset Search Parameters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
