
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
      className="group relative flex flex-col bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20 hover:-translate-y-3"
    >
      <div className="aspect-[16/11] w-full bg-black relative overflow-hidden">
        <Sandbox animation={animation} isThumbnail={true} currentConfig={defaultConfig} />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
        <div className="absolute top-6 right-6 z-20">
           <span className="text-[8px] font-black tracking-[0.3em] uppercase bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-white/50">{animation.complexity}</span>
        </div>
      </div>
      <div className="p-8 relative z-30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading text-2xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{animation.name}</h3>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">{animation.category}</span>
        </div>
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light tracking-tight group-hover:text-zinc-300 transition-colors">{animation.description}</p>
      </div>
    </div>
  );
};

export default AnimationCard;
