import React, { useState, useEffect, useRef, useMemo } from 'react';
import AnimationCard from '../AnimationCard';
import CinematicStack from './CinematicStack';
import { AnimationEntry } from '../../types';

interface HeroProps {
  featuredAnimations: AnimationEntry[];
  onSelect: (id: string) => void;
  onEnterGallery: () => void;
}

const CinematicTitle: React.FC<{ text: string }> = ({ text }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const chars = "!@#$%^&*()_+{}:<>?|ABCD0123456789";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayValue(prev => 
        text.split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
        setIsLocked(true);
      }
      iteration += 1 / 3;
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative group">
      <h1 className="absolute inset-0 text-white/5 blur-2xl select-none scale-110 pointer-events-none transition-transform duration-[3000ms] group-hover:scale-125 font-heading font-black"
          style={{ fontSize: 'clamp(4rem, 18vw, 16rem)', letterSpacing: '-0.05em' }}>
        {text}
      </h1>
      <h1 
        className={`relative font-heading font-black text-white leading-[0.8] tracking-tighter uppercase transition-all duration-[2000ms] ease-out select-none
          ${isLocked ? 'tracking-[-0.07em] opacity-100' : 'tracking-[0.5em] opacity-50 blur-sm'}
        `}
        style={{ 
          fontSize: 'clamp(4rem, 18vw, 16rem)',
          textShadow: isLocked ? '0 0 40px rgba(255,255,255,0.2)' : 'none'
        }}
      >
        {displayValue}
      </h1>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ featuredAnimations, onSelect, onEnterGallery }) => {
  return (
    <main className="flex-1 relative z-10 w-full overflow-hidden">
      {/* 1. Hero Landing */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-8">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-white/[0.03] rounded-full blur-[140px] animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center w-full max-w-7xl px-4 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          <div className="w-full flex justify-center py-6">
            <CinematicTitle text="VOIDYX" />
          </div>
          <div className="space-y-4">
            <p className="text-sm sm:text-lg md:text-2xl font-mono text-zinc-500 uppercase tracking-[0.8em] sm:tracking-[1.2em] reveal opacity-0 animate-[reveal-up_1s_ease-out_1.5s_forwards]">
              Motion from the Void
            </p>
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 animate-[reveal-up_1s_ease-out_2s_forwards]">
          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.6em] whitespace-nowrap">Initialize Registry</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </section>

      <div className="w-full max-w-[1920px] mx-auto space-y-24 sm:space-y-40 pb-32">
        {/* 2. Platform Manifesto Section - Fully Responsive */}
        <section className="px-6 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="space-y-8 reveal">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">Foundry Manifesto</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter leading-none">
                Powerful. Modern. <br className="hidden sm:block"/> Without Complexity.
              </h2>
            </div>
            <p className="text-xl sm:text-2xl text-zinc-400 font-light leading-snug tracking-tight">
              Voidyx is a premium animation platform built for developers and designers who want <span className="text-white">cinematic motion effects</span> without the complexity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-2 border-l border-white/10 pl-4">
                <h4 className="text-[10px] font-mono text-white uppercase tracking-widest">Performance First</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Optimized GPU-accelerated units for fluid 60FPS integration.</p>
              </div>
              <div className="space-y-2 border-l border-white/10 pl-4">
                <h4 className="text-[10px] font-mono text-white uppercase tracking-widest">Deploy Ready</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Clean, copy-paste snippets for HTML, CSS, and JavaScript.</p>
              </div>
            </div>
          </div>
          
          <div className="relative w-full bg-zinc-900/10 border border-white/5 overflow-hidden group min-h-[300px] sm:min-h-[500px] flex flex-col">
             <div className="absolute top-4 left-4 z-50 pointer-events-none">
                <div className="text-[7px] sm:text-[9px] font-mono text-zinc-600 uppercase tracking-[0.8em] flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                   Live Preview // Active
                </div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10"></div>
             <div className="flex-1 relative">
                <CinematicStack animations={featuredAnimations.slice(0, 3)} onSelect={onSelect} />
             </div>
          </div>
        </section>

        {/* 3. Full Registry Showcase */}
        <section className="px-6 sm:px-8 lg:px-20 space-y-12 sm:space-y-16">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-b border-white/5 pb-8 gap-4">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tighter">Core Registry</h2>
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">Voidyx — Motion from the Void.</p>
            </div>
            <button onClick={onEnterGallery} className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] hover:text-white transition-colors">View All Units [A-Z]</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredAnimations.map((anim, idx) => (
              <div key={anim.id} className="reveal" style={{ animationDelay: `${0.1 + (idx * 0.1)}s` }}>
                <AnimationCard animation={anim} onClick={onSelect} />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-8">
            <button onClick={onEnterGallery} className="btn-neon group w-full sm:w-auto">
              Access Full Vault &rarr;
            </button>
          </div>
        </section>

        {/* 4. Deep Dive Description (Requested placement at bottom) */}
        <section className="px-6 sm:px-8 lg:px-20 py-24 bg-white/[0.01] border-t border-white/[0.03]">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-light leading-relaxed tracking-tight">
              Every animation on Voidyx is carefully crafted and optimized for smooth performance, allowing users to preview effects in real time and instantly integrate them into their projects using simple HTML, CSS, and JavaScript. With a minimal black-themed UI and a strong emphasis on motion quality, Voidyx makes it easy to bring immersive visuals to modern websites.
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-4">
               {['WebGL Core', 'Canvas Primitives', 'React Integrated', 'Standard CSS'].map(tag => (
                 <span key={tag} className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-white/20 rotate-45"></div> {tag}
                 </span>
               ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Hero;