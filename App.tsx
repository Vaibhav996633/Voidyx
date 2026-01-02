
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
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h1 className="text-6xl font-heading font-black text-white uppercase tracking-tighter">Motion Library</h1>
                <p className="text-zinc-600 text-xl font-light">Complete collection of Generative Units.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setCategory(cat)} 
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state.selectedCategory === cat ? 'bg-white text-black shadow-lg scale-105' : 'text-zinc-500 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative group w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Search primitives..." 
                    value={state.searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-light tracking-tight text-white focus:ring-1 focus:ring-white/30 outline-none w-full transition-all group-hover:border-white/20" 
                  />
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
                <div className="col-span-full py-40 text-center space-y-4">
                  <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">No results found for your search.</p>
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
