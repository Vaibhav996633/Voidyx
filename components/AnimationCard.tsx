
import React from 'react';
import { AnimationEntry } from '../types';
import Sandbox from './Sandbox';

interface AnimationCardProps {
  animation: AnimationEntry;
  onClick: (id: string) => void;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ animation, onClick }) => {
  const defaultConfig = Object.fromEntries(animation.config?.map(c => [c.id, c.default]) || []);

  return (
    <div 
      onClick={() => onClick(animation.id)}
      className="group relative flex flex-col bg-[#0a0a0a] border border-white/[0.04] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20 hover:-translate-y-2"
    >
      <div className="aspect-[16/10] w-full bg-black relative overflow-hidden">
        <Sandbox animation={animation} isThumbnail={true} currentConfig={defaultConfig} />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute top-5 right-5 z-20">
           <span className="text-[7px] font-black tracking-[0.3em] uppercase bg-black/80 backdrop-blur-xl border border-white/[0.05] px-3 py-1.5 rounded-full text-zinc-500 group-hover:text-white transition-colors">
            {animation.complexity}
           </span>
        </div>
      </div>
      <div className="p-8 relative z-30 space-y-3">
        <div className="flex justify-between items-baseline">
          <h3 className="font-heading text-xl font-black text-white tracking-tight group-hover:text-white/80 transition-colors uppercase">{animation.name}</h3>
          <span className="text-[8px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-600">[{animation.category.slice(0,3)}]</span>
        </div>
        <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed font-light tracking-tight group-hover:text-zinc-400 transition-colors">
          {animation.description}
        </p>
      </div>
      
      {/* Interactive hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default AnimationCard;
