
import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/features/Hero';
import AnimationCard from './components/AnimationCard';
import DetailView from './components/DetailView';
import { useGallery } from './hooks/useGallery';
import { LiquidEffect } from './components/ui/LiquidEffect';
import { Category } from './types';

const CATEGORIES: (Category | 'All')[] = ['All', 'Background', 'Interactive', 'Particle', 'WebGL', 'Text'];

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
      {/* Background Interactive Layer */}
      <LiquidEffect />
      
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
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/[0.03] pb-12">
              <div className="space-y-3">
                <h1 className="text-6xl font-heading font-black text-white uppercase tracking-tighter">Vault</h1>
                <p className="text-zinc-600 text-lg font-light tracking-tight italic">Registry of Generative Units.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-full overflow-x-auto no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setCategory(cat)} 
                      className={`px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-all ${state.selectedCategory === cat ? 'bg-white text-black scale-105' : 'text-zinc-600 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative group w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Search library..." 
                    value={state.searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="bg-black/20 border border-white/[0.05] rounded-full px-6 py-3 text-[10px] font-light tracking-widest text-white focus:border-white/20 outline-none w-full transition-all" 
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none text-[8px] font-mono">QRY</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAnimations.length > 0 ? (
                filteredAnimations.map(anim => (
                  <AnimationCard 
                    key={anim.id} 
                    animation={anim} 
                    onClick={(id) => setView('detail', id)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-40 text-center space-y-4">
                  <p className="text-zinc-700 font-mono text-[9px] uppercase tracking-[0.5em]">Unit Not Found // Reset Query.</p>
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
