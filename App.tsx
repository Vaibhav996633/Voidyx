
import React, { useState, useMemo } from 'react';
import { ANIMATIONS } from './data/animations';
import { AppState, Category } from './types';
import AnimationCard from './components/AnimationCard';
import DetailView from './components/DetailView';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'WebGL', 'Text'];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    selectedId: null,
    searchQuery: '',
    selectedCategory: 'All',
  });

  const filteredAnimations = useMemo(() => {
    return ANIMATIONS.filter(anim => {
      const matchesSearch = anim.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            anim.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesCategory = state.selectedCategory === 'All' || anim.category === state.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [state.searchQuery, state.selectedCategory]);

  const featuredAnimations = useMemo(() => ANIMATIONS.slice(0, 3), []);

  const selectedAnimation = useMemo(() => {
    return ANIMATIONS.find(a => a.id === state.selectedId);
  }, [state.selectedId]);

  const handleSelect = (id: string) => {
    setState(prev => ({ ...prev, view: 'detail', selectedId: id }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGallery = () => {
    setState(prev => ({ ...prev, view: 'gallery', selectedId: null }));
  };

  const handleGoHome = () => {
    setState(prev => ({ ...prev, view: 'home', selectedId: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToGallery = () => {
    setState(prev => ({ ...prev, view: 'gallery', selectedId: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-white selection:text-black">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/60 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={handleGoHome}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <div className="w-6 h-6 bg-black rounded-lg transform rotate-45 scale-90 group-hover:scale-100 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-3xl tracking-tighter leading-none text-white uppercase">VOIDYX</span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.5em] mt-1">Motion Engine</span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <button onClick={handleGoToGallery} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${state.view === 'gallery' ? 'text-white underline decoration-2 underline-offset-8' : 'text-zinc-500 hover:text-white'}`}>Library</button>
            <button onClick={handleGoHome} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${state.view === 'home' ? 'text-white underline decoration-2 underline-offset-8' : 'text-zinc-500 hover:text-white'}`}>Manifesto</button>
          </div>
        </div>
      </nav>

      {state.view === 'home' && (
        <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
          <div className="max-w-7xl mx-auto space-y-40">
            <header className="text-center space-y-12 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full text-[11px] font-bold text-white/50 tracking-[0.4em] uppercase border border-white/10">Motion from the Void</div>
              <h1 className="text-7xl md:text-[10rem] font-heading font-black leading-[0.85] tracking-[-0.05em] text-white">Cinematic <br /><span className="text-zinc-900">Interfaces.</span></h1>
              <p className="text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light tracking-tight">Voidyx is a specialized motion foundry. We forge high-fidelity generative primitives for surfaces that demand deep immersion.</p>
              <div className="pt-8">
                <button onClick={handleGoToGallery} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] active:scale-95">Enter Library</button>
              </div>
            </header>

            <section className="space-y-20">
              <div className="flex justify-between items-end gap-6">
                <h2 className="text-4xl font-heading font-black tracking-tight text-white uppercase">Featured Primitives</h2>
                <button onClick={handleGoToGallery} className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors">Open Vault <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {featuredAnimations.map(anim => <AnimationCard key={anim.id} animation={anim} onClick={handleSelect} />)}
              </div>
            </section>
          </div>
        </main>
      )}

      {state.view === 'gallery' && (
        <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h1 className="text-6xl font-heading font-black text-white uppercase tracking-tighter">Motion Library</h1>
                <p className="text-zinc-600 text-xl font-light">Complete collection of Generative Units.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setState(s => ({ ...s, selectedCategory: cat }))} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.selectedCategory === cat ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-white'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Search primitives..." value={state.searchQuery} onChange={(e) => setState(s => ({ ...s, searchQuery: e.target.value }))} className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-light tracking-tight text-white focus:ring-1 focus:ring-white/30 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredAnimations.map(anim => <AnimationCard key={anim.id} animation={anim} onClick={handleSelect} />)}
            </div>
          </div>
        </main>
      )}

      {state.view === 'detail' && selectedAnimation && <DetailView animation={selectedAnimation} onBack={handleBackToGallery} />}

      <footer className="border-t border-white/5 py-40 px-8 bg-black z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">© 2025 VOIDYX SYSTEMS INT.</p>
          <div className="flex gap-16 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
