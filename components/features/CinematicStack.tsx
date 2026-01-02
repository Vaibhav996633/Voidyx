
import React, { useState, useEffect, useRef } from 'react';
import { AnimationEntry } from '../../types';
import Sandbox from '../Sandbox';

interface CinematicStackProps {
  animations: AnimationEntry[];
  onSelect: (id: string) => void;
}

const CinematicStack: React.FC<CinematicStackProps> = ({ animations, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef<number>(null);

  useEffect(() => {
    const next = () => {
      setActiveIndex((current) => (current + 1) % animations.length);
    };
    autoPlayRef.current = window.setInterval(next, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [animations.length]);

  return (
    <div className="relative w-full h-[350px] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Depth Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[400px] bg-gradient-radial from-white/[0.03] to-transparent blur-[100px]"></div>
        <div className="absolute bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      </div>

      <div className="relative w-full max-w-7xl h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
        {animations.map((anim, i) => {
          let relIndex = i - activeIndex;
          if (relIndex > animations.length / 2) relIndex -= animations.length;
          if (relIndex < -animations.length / 2) relIndex += animations.length;

          const isActive = relIndex === 0;
          const absRel = Math.abs(relIndex);
          
          const opacity = Math.max(0, 1 - absRel * 0.45);
          const z = isActive ? 150 : -absRel * 200;
          // Responsive horizontal spacing
          const xOffset = window.innerWidth < 640 ? 180 : 350;
          const x = relIndex * xOffset;
          const rotateY = relIndex * -12;
          const scale = isActive ? 1 : 0.75 - (absRel * 0.05);
          const blur = isActive ? 0 : absRel * 3;

          const defaultConfig = Object.fromEntries(anim.config?.map(c => [c.id, c.default]) || []);

          return (
            <div
              key={anim.id}
              onClick={() => onSelect(anim.id)}
              className="absolute transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group"
              style={{
                transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: 100 - absRel,
                filter: `blur(${blur}px)`,
                pointerEvents: absRel > 0.5 ? 'none' : 'auto',
              }}
            >
              {/* Main Card Frame - Responsive Width */}
              <div className="relative w-[280px] sm:w-[400px] lg:w-[500px] h-[180px] sm:h-[240px] lg:h-[300px] bg-[#050505] border border-white/10 group-hover:border-white/30 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                
                {isActive && (
                  <div className="absolute inset-0 z-40 pointer-events-none ring-1 ring-inset ring-white/20 animate-pulse"></div>
                )}

                <div className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity">
                   <Sandbox 
                    animation={anim} 
                    isThumbnail={true} 
                    currentConfig={defaultConfig}
                    className="scale-110"
                  />
                </div>

                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-30 transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                   <div className="flex justify-between items-end">
                      <div className="space-y-0.5 sm:space-y-1">
                        <span className="text-[7px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{anim.category}</span>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white uppercase tracking-tighter italic leading-none">{anim.name}</h3>
                      </div>
                      <div className="hidden sm:block text-[8px] font-mono text-white/20 uppercase tracking-widest border border-white/10 px-2 py-0.5">
                        MOD_0{i + 1}
                      </div>
                   </div>
                </div>

                <div className="absolute top-2 left-2 w-6 h-[1px] bg-white/20 z-40"></div>
                <div className="absolute top-2 left-2 w-[1px] h-6 bg-white/20 z-40"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-50">
        {animations.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-8 h-0.5 transition-all duration-500 ${activeIndex === i ? 'bg-white w-12' : 'bg-white/10 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CinematicStack;
