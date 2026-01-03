
import React from 'react';
import { AnimationEntry } from '../types';
import Sandbox from './Sandbox';

interface AnimationCardProps {
  animation: AnimationEntry;
  onClick: (id: string) => void;
  premium?: boolean;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ animation, onClick, premium }) => {
  const defaultConfig = Object.fromEntries(animation.config?.map(c => [c.id, c.default]) || []);

  return (
    <div 
      onClick={() => onClick(animation.id)}
      className="group relative flex flex-col bg-black border border-white/[0.05] rounded-none overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/30 hover:shadow-[0_0_50px_rgba(255,255,255,0.03)]"
    >
      <div className="aspect-[16/9] w-full bg-[#050505] relative overflow-hidden">
        {premium && (
          <div className="absolute top-2 right-2 z-50 flex items-center gap-1">
            <svg className="w-5 h-5 text-yellow-400 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33-3.87-3.77 5.34-.78L10 2z" />
            </svg>
            <span className="text-[10px] font-bold text-yellow-400 uppercase">Premium</span>
          </div>
        )}
        {/* Cinematic Scanline Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <Sandbox animation={animation} isThumbnail={true} currentConfig={defaultConfig} />
        
        {/* Module Encasing Overlays */}
        <div className="absolute inset-0 z-30 border-[10px] border-black transition-all group-hover:border-[6px]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
        
        {/* Top Metadata */}
        <div className="absolute top-5 left-5 z-40 flex items-center gap-2">
          <div className="w-1 h-1 bg-white/30 rounded-full group-hover:bg-white transition-colors"></div>
          <span className="text-[7px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-600 group-hover:text-zinc-400 transition-colors">
            {animation.category} // UNIT_{animation.id.slice(0,3).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-8 relative z-30 space-y-4 bg-black transition-colors">
        <div className="flex justify-between items-baseline">
          <h3 className="font-heading text-2xl font-black text-white tracking-tight uppercase group-hover:tracking-wider transition-all duration-700">
            {animation.name}
          </h3>
          <span className="text-[7px] font-mono text-zinc-800 tracking-widest uppercase font-bold">
            0{animation.id.length % 9}
          </span>
        </div>
        
        <p className="text-[12px] text-zinc-600 leading-relaxed font-light line-clamp-2 group-hover:text-zinc-400 transition-colors duration-500">
          {animation.description}
        </p>

        {/* Deploy Indicator */}
        <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-1 group-hover:translate-y-0">
          <span className="text-[7px] font-mono text-white uppercase tracking-[0.6em]">Initialize</span>
          <div className="h-[1px] flex-1 mx-4 bg-white/10 group-hover:bg-white/40 transition-colors"></div>
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AnimationCard;
