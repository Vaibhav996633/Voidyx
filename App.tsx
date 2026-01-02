
import React, { useState, useMemo } from 'react';
import { ANIMATIONS } from './animations/data';
import { AppState, Category } from './types';
import AnimationCard from './components/AnimationCard';
import DetailView from './components/DetailView';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'WebGL', 'Text'];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'gallery',
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

  const selectedAnimation = useMemo(() => {
    return ANIMATIONS.find(a => a.id === state.selectedId);
  }, [state.selectedId]);

  const handleSelect = (id: string) => {
    setState(prev => ({ ...prev, view: 'detail', selectedId: id }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, view: 'gallery', selectedId: null }));
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col selection:bg-white selection:text-black">
      {/* Voidyx Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/60 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setState(p => ({ ...p, view: 'gallery', selectedId: null }))}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <div className="w-6 h-6 bg-black rounded-lg transform rotate-45 scale-90 group-hover:scale-100 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-3xl tracking-tighter leading-none text-white">VOIDYX</span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.5em] mt-1">Motion Engine</span>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <a href="https://github.com" className="bg-white text-black px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.15)] active:scale-95">
              Source
            </a>
          </div>
        </div>
      </nav>

      {state.view === 'gallery' ? (
        <main className="flex-1 pt-48 pb-40 px-8">
          <div className="max-w-7xl mx-auto space-y-32">
            
            {/* Hero Section */}
            <header className="text-center space-y-10 max-w-5xl mx-auto relative animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full text-[11px] font-bold text-white/60 tracking-[0.25em] uppercase border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Version 3.0 Stable
              </div>
              <h1 className="text-7xl md:text-[11rem] font-heading font-black leading-[0.8] tracking-[-0.05em] text-white">
                Fluid <br />
                <span className="text-zinc-800">Interfaces.</span>
              </h1>
              <p className="text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed font-light tracking-tight">
                Production-grade motion primitives for modern developers. Framework agnostic, 60FPS guaranteed, and fully customizable.
              </p>
            </header>

            {/* Smart Filters */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 no-scrollbar scroll-smooth">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setState(s => ({ ...s, selectedCategory: cat }))}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                      state.selectedCategory === cat 
                        ? 'bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.1)] scale-105' 
                        : 'text-zinc-600 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-[450px] group px-2 md:px-0">
                <input 
                  type="text"
                  placeholder="Explore by keyword or engine..."
                  value={state.searchQuery}
                  onChange={(e) => setState(s => ({ ...s, searchQuery: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all font-light placeholder:text-zinc-800 tracking-tight"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700 group-focus-within:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredAnimations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {filteredAnimations.map(anim => (
                  <AnimationCard 
                    key={anim.id} 
                    animation={anim} 
                    onClick={handleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center glass rounded-[4rem] border-dashed border-white/5">
                <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">No matching primitives found.</p>
              </div>
            )}
          </div>
        </main>
      ) : (
        selectedAnimation && <DetailView animation={selectedAnimation} onBack={handleBack} />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-40 px-8 bg-black mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="col-span-1 md:col-span-8 space-y-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                <div className="w-7 h-7 bg-black rounded-lg transform rotate-45" />
              </div>
              <span className="font-heading font-black text-4xl tracking-tighter">VOIDYX</span>
            </div>
            <p className="text-zinc-500 text-2xl max-w-2xl font-light leading-relaxed tracking-tight">
              A meticulously curated library of professional web motion primitives. Designed for developers who demand perfection.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-4 space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">System</h4>
            <ul className="space-y-6 text-sm text-zinc-600">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord Community</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-32 mt-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">© 2025 VOIDYX SYSTEMS INT.</p>
          <div className="flex gap-16 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">License Agreement</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
