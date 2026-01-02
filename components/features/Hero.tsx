
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
    <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
      <div className="max-w-7xl mx-auto space-y-40">
        <header className="text-center space-y-12 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full text-[11px] font-bold text-white/50 tracking-[0.4em] uppercase border border-white/10">
            Motion from the Void
          </div>
          <h1 className="text-7xl md:text-[10rem] font-heading font-black leading-[0.85] tracking-[-0.05em] text-white">
            Cinematic <br />
            <span className="text-zinc-900">Interfaces.</span>
          </h1>
          <p className="text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light tracking-tight">
            Voidyx is a specialized motion foundry. We forge high-fidelity generative primitives for surfaces that demand deep immersion.
          </p>
          <div className="pt-8">
            <button 
              onClick={onEnterGallery} 
              className="bg-white text-black px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Enter Library
            </button>
          </div>
        </header>

        <section className="space-y-20">
          <div className="flex justify-between items-end gap-6">
            <h2 className="text-4xl font-heading font-black tracking-tight text-white uppercase">Featured Primitives</h2>
            <button 
              onClick={onEnterGallery} 
              className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
            >
              Open Vault 
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredAnimations.map(anim => (
              <AnimationCard key={anim.id} animation={anim} onClick={onSelect} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Hero;
