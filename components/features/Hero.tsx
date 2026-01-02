
import React from 'react';
import AnimationCard from '../AnimationCard';
import { AnimationEntry } from '../../types';

interface HeroProps {
  featuredAnimations: AnimationEntry[];
  onSelect: (id: string) => void;
  onEnterGallery: () => void;
}

const Hero: React.FC<HeroProps> = ({ featuredAnimations, onSelect, onEnterGallery }) => {
  return (
    <main className="flex-1 pt-56 pb-40 px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-48">
        <header className="text-center space-y-12 max-w-6xl mx-auto">
          <div className="reveal-1 inline-flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl px-6 py-2.5 rounded-full text-[9px] font-black text-zinc-500 tracking-[0.5em] uppercase border border-white/[0.05]">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></span>
            Visions from the Void
          </div>
          
          <h1 className="text-7xl md:text-[12rem] font-heading font-black leading-[0.75] tracking-[-0.07em] text-white">
            <span className="reveal-2 block">Cinematic</span>
            <span className="reveal-3 block text-outline mt-4">Interfaces.</span>
          </h1>
          
          <p className="reveal-4 text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light tracking-tight px-4">
            A specialized motion foundry for high-fidelity generative primitives. Surfaces crafted for absolute visual immersion.
          </p>
          
          <div className="reveal-5 pt-10">
            <button 
              onClick={onEnterGallery} 
              className="group relative bg-white text-black px-16 py-6 rounded-full font-black text-[12px] uppercase tracking-[0.6em] hover:bg-zinc-100 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] active:scale-95"
            >
              Enter the Vault
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 blur-2xl transition-opacity"></div>
            </button>
          </div>
        </header>

        <section className="space-y-24 reveal-5">
          <div className="flex justify-between items-end gap-6 border-b border-white/[0.05] pb-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-heading font-black tracking-tight text-white uppercase italic">Active Units</h2>
               <div className="flex items-center gap-4">
                 <span className="text-[9px] font-mono text-white tracking-widest uppercase bg-white/5 px-3 py-1 rounded border border-white/10">Batch 01</span>
                 <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Registry Sync: Stable</p>
               </div>
            </div>
            <button 
              onClick={onEnterGallery} 
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 hover:text-white transition-all"
            >
              Access Vault 
              <div className="w-10 h-[1px] bg-zinc-800 group-hover:w-14 group-hover:bg-white transition-all"></div>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredAnimations.map((anim, idx) => (
              <div key={anim.id} className={`reveal-${Math.min(5, idx + 3)}`}>
                <AnimationCard animation={anim} onClick={onSelect} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Hero;
