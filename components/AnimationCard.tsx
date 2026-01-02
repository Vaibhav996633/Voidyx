
import React from 'react';
import { AnimationEntry } from '../types';
import Sandbox from './Sandbox';

interface AnimationCardProps {
  animation: AnimationEntry;
  onClick: (id: string) => void;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ animation, onClick }) => {
  return (
    <div 
      onClick={() => onClick(animation.id)}
      className="group relative flex flex-col bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20 hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] hover:-translate-y-3"
    >
      {/* Immersive Preview */}
      <div className="aspect-[16/11] w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100 opacity-90">
          {/* Preview will render and run automatically */}
          <Sandbox 
            animation={animation} 
            isThumbnail={true} 
            currentConfig={Object.fromEntries(animation.config?.map(c => [c.id, c.default]) || [])}
          />
        </div>
        
        {/* Dynamic Glass Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
        
        {/* Centered Interaction Icon */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
           <div className="w-16 h-16 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center shadow-2xl">
             <svg className="w-7 h-7 text-white ml-1 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
               <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
             </svg>
           </div>
        </div>

        {/* Meta Badge */}
        <div className="absolute top-6 right-6 z-20">
           <span className="text-[8px] font-black tracking-[0.3em] uppercase bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-white/50 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all duration-500">
             {animation.complexity}
           </span>
        </div>
      </div>
      
      {/* Description Section */}
      <div className="p-8 relative z-30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading text-2xl font-black text-white tracking-tighter transition-colors group-hover:text-blue-400 duration-500">
            {animation.name}
          </h3>
          <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
             <div className="w-1 h-1 rounded-full bg-blue-400" />
             <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
               {animation.category}
             </span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light tracking-tight group-hover:text-zinc-300 transition-colors duration-500">
          {animation.description}
        </p>
      </div>

      {/* Decorative Corner Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
  );
};

export default AnimationCard;
