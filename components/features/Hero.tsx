
import React, { useState, useEffect } from 'react';
import AnimationCard from '../AnimationCard';
import { AnimationEntry } from '../../types';

interface HeroProps {
  featuredAnimations: AnimationEntry[];
  onSelect: (id: string) => void;
  onEnterGallery: () => void;
}

const ScrambleText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    let timeout: any;
    let iterations = 0;
    
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(prev => 
          text.split("").map((char, index) => {
            if (index < iterations) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );

        if (iterations >= text.length) clearInterval(interval);
        iterations += 1/3;
      }, 30);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className={className}>{displayText || text.replace(/./g, ' ')}</span>;
};

const Hero: React.FC<HeroProps> = ({ featuredAnimations, onSelect, onEnterGallery }) => {
  return (
    <main className="flex-1 min-h-screen relative z-10 pt-24 md:pt-36">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-20">
        
        {/* Main Header Container */}
        <section className="space-y-12">
          {/* Title Row */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 reveal" style={{ animationDelay: '0.1s' }}>
              <span className="w-10 h-[1px] bg-white/10"></span>
              <p className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/40">Premium Motion Registry</p>
            </div>
            <h1 className="text-[15vw] md:text-[18rem] text-hero select-none reveal" style={{ animationDelay: '0.2s' }}>
              <ScrambleText text="VOIDYX" delay={300} />
            </h1>
          </div>

          {/* Description & CTA Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start reveal" style={{ animationDelay: '0.6s' }}>
            <div className="lg:col-span-7">
              <h2 className="text-4xl md:text-6xl text-accent">
                Premium motion effects <br/>
                <span className="text-zinc-600 italic font-light">without the complexity.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <p className="text-base text-zinc-500 font-light leading-relaxed max-w-md">
                Carefully crafted, optimized web animations with live previews and clean, copy-paste-ready code. Bring immersive visuals to modern interfaces instantly.
              </p>
              <button 
                onClick={onEnterGallery} 
                className="btn-premium group"
              >
                Access Vault
                <svg className="w-4 h-4 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Registry Selection */}
        <section className="mt-32 space-y-12 pb-24">
          <div className="flex justify-between items-center border-b border-white/5 pb-8 reveal" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-baseline gap-4">
              <span className="text-[10px] font-mono text-zinc-800">01</span>
              <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter">Registry</h3>
            </div>
            <button 
              onClick={onEnterGallery} 
              className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-all py-2"
            >
              Explore All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredAnimations.map((anim, idx) => (
              <div 
                key={anim.id} 
                className="reveal" 
                style={{ animationDelay: `${1.0 + (idx * 0.1)}s` }}
              >
                <AnimationCard animation={anim} onClick={onSelect} />
              </div>
            ))}
          </div>
        </section>

        {/* Minimal Footer Accent */}
        <section className="py-24 border-t border-white/5 reveal" style={{ animationDelay: '1.2s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h4 className="text-xl font-heading font-black text-white/20 uppercase tracking-widest italic">
              Motion from the Void.
            </h4>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/10"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Hero;
