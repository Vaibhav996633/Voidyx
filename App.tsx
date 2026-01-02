
import React, { useState, useMemo } from 'react';
import { ANIMATIONS } from './animations/data';
import { AppState, Category } from './types';
import AnimationCard from './components/AnimationCard';
import DetailView from './components/DetailView';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'WebGL', 'Text'];

// Extend state to include a landing home view
interface ExtendedAppState extends Omit<AppState, 'view'> {
  view: 'home' | 'gallery' | 'detail';
}

const App: React.FC = () => {
  const [state, setState] = useState<ExtendedAppState>({
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

  const featuredAnimations = useMemo(() => {
    // Show top 3 as featured
    return ANIMATIONS.slice(0, 3);
  }, []);

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
    <div className="min-h-screen hero-gradient flex flex-col selection:bg-white selection:text-black">
      {/* Voidyx Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/60 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={handleGoHome}
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <div className="w-6 h-6 bg-black rounded-lg transform rotate-45 scale-90 group-hover:scale-100 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-3xl tracking-tighter leading-none text-white">VOIDYX</span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.5em] mt-1">Motion Engine</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={handleGoToGallery}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${state.view === 'gallery' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              Library
            </button>
          </div>
        </div>
      </nav>

      {state.view === 'home' && (
        <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-40">
            {/* Hero Section */}
            <header className="text-center space-y-12 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase border border-white/10">
                Motion from the Void
              </div>
              <h1 className="text-7xl md:text-[10rem] font-heading font-black leading-[0.85] tracking-[-0.05em] text-white">
                Cinematic <br />
                <span className="text-zinc-800">Geometry.</span>
              </h1>
              <p className="text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light tracking-tight">
                Voidyx is an open-source foundry for high-end web motion. We build the primitives that power the next generation of digital experiences.
              </p>
              <div className="pt-8">
                <button 
                  onClick={handleGoToGallery}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)] active:scale-95"
                >
                  Explore Library
                </button>
              </div>
            </header>

            {/* Featured Section */}
            <section className="space-y-20">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-heading font-black tracking-tight text-white uppercase">Featured Primitives</h2>
                  <p className="text-zinc-500 font-light text-lg">Our top-tier motion engines, battle-tested for performance.</p>
                </div>
                <button 
                  onClick={handleGoToGallery}
                  className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
                >
                  View All Units
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {featuredAnimations.map(anim => (
                  <AnimationCard 
                    key={anim.id} 
                    animation={anim} 
                    onClick={handleSelect}
                  />
                ))}
              </div>
            </section>

            {/* Info Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-20 py-20 border-t border-white/5">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Pure Performance</h3>
                <p className="text-zinc-500 leading-relaxed font-light">Every primitive is optimized for 60FPS. We use raw WebGL and Canvas to bypass the overhead of heavy frameworks.</p>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Zero-Install</h3>
                <p className="text-zinc-500 leading-relaxed font-light">Copy-paste architecture. No npm packages, no complex build steps. Just drop the self-contained script into your project.</p>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold uppercase tracking-tight">Full Control</h3>
                <p className="text-zinc-500 leading-relaxed font-light">Voidyx provides a real-time kernel override system. Tweak colors, speeds, and physics directly in the browser before exporting.</p>
              </div>
            </section>
          </div>
        </main>
      )}

      {state.view === 'gallery' && (
        <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-24">
            {/* Gallery Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h1 className="text-6xl font-heading font-black text-white uppercase tracking-tighter">Motion Library</h1>
                <p className="text-zinc-500 text-xl font-light">Complete collection of generative motion units.</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
                 {/* Filters */}
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setState(s => ({ ...s, selectedCategory: cat }))}
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                        state.selectedCategory === cat 
                          ? 'bg-white text-black' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full md:w-[320px] group">
                  <input 
                    type="text"
                    placeholder="Search kernel..."
                    value={state.searchQuery}
                    onChange={(e) => setState(s => ({ ...s, searchQuery: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 transition-all font-light placeholder:text-zinc-800 tracking-tight"
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredAnimations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">No primitives found for current filter.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {state.view === 'detail' && selectedAnimation && (
        <DetailView 
          animation={selectedAnimation} 
          onBack={handleBackToGallery} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-40 px-8 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="col-span-1 md:col-span-8 space-y-12">
            <div className="flex items-center gap-5 cursor-pointer" onClick={handleGoHome}>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                <div className="w-7 h-7 bg-black rounded-lg transform rotate-45" />
              </div>
              <span className="font-heading font-black text-4xl tracking-tighter text-white">VOIDYX</span>
            </div>
            <p className="text-zinc-500 text-2xl max-w-2xl font-light leading-relaxed tracking-tight">
              Crafting motion for the modern web. Every animation is an exploration of physics, light, and geometry.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-4 space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">System</h4>
            <ul className="space-y-6 text-sm text-zinc-600">
              <li><button onClick={handleGoHome} className="hover:text-white transition-colors">Manifesto</button></li>
              <li><button onClick={handleGoToGallery} className="hover:text-white transition-colors">Complete Library</button></li>
              <li><a href="https://github.com" className="hover:text-white transition-colors">GitHub Source</a></li>
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
