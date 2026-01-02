import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import AnimationCard from './components/AnimationCard';
import DetailView from './components/DetailView';
import { useGallery } from './hooks/useGallery';
import { Category } from './types';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'Text'];

const App: React.FC = () => {
  const {
    state,
    filteredAnimations,
    featuredAnimations,
    selectedAnimation,
    setView,
    setSearchQuery,
    setCategory
  } = useGallery();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-white selection:text-black">
      {/* Global Navigation */}
      <Navbar 
        currentView={state.view} 
        onNavigate={(view) => setView(view)} 
      />

      {/* View Orchestration */}
      {state.view === 'home' && (
        <Hero 
          featuredAnimations={featuredAnimations} 
          onSelect={(id) => setView('detail', id)} 
          onEnterGallery={() => setView('gallery')}
        />
      )}

      {state.view === 'gallery' && (
        <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
          <div className="max-w-7xl mx-auto space-y-24">
            {/* Gallery Header with Back Button */}
            <div className="flex flex-col space-y-12">
              <button 
                onClick={() => setView('home')} 
                className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors w-fit"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setCategory(cat)} 
                        className={`px-8 py-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${state.selectedCategory === cat ? 'bg-white text-black' : 'text-zinc-meta hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="relative group w-full md:w-80">
                    <input 
                      type="text" 
                      placeholder="Search library..." 
                      value={state.searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="bg-black border border-white/[0.05] rounded-none px-8 py-4 text-[11px] font-light tracking-widest text-white focus:border-white/40 outline-none w-full transition-all" 
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-dim pointer-events-none text-[9px] font-mono">/SEARCH</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredAnimations.length > 0 ? (
                filteredAnimations.map(anim => (
                  <AnimationCard 
                    key={anim.id} 
                    animation={anim} 
                    onClick={(id) => setView('detail', id)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-60 text-center space-y-4">
                  <p className="text-zinc-dim font-mono text-[11px] uppercase tracking-[0.8em]">Unit Not Found // Reset Search Parameters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {state.view === 'detail' && selectedAnimation && (
        <DetailView 
          animation={selectedAnimation} 
          onBack={() => setView('gallery')} 
        />
      )}

      <Footer />
    </div>
  );
};

export default App;