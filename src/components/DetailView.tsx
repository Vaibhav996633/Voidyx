import React, { useState, useEffect, useMemo } from 'react';
import { AnimationEntry } from '../types';
import Sandbox from './Sandbox';
import CodeBlock from './CodeBlock';

interface DetailViewProps {
  animation: AnimationEntry;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ animation, onBack }) => {
  const [config, setConfig] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    animation.config?.forEach(p => {
      defaults[p.id] = p.default;
    });
    return defaults;
  });

  const [panelVisible, setPanelVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPanelVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleConfigChange = (id: string, value: any) => {
    setConfig(prev => ({ ...prev, [id]: value }));
  };

  const cleanJs = useMemo(() => {
    return animation.js.replace(/import.*?;/g, '').replace(/export.*?;/g, '').trim();
  }, [animation.js]);

  const generatedHtmlSnippet = useMemo(() => {
    const scripts = (animation.cdnLinks || []).map(link => `<script src="${link}"></script>`).join('\n  ');
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: #000; }
    ${animation.css}
  </style>
  ${scripts}
</head>
<body>
  ${animation.html}
  <script>
    window.VANTA_CONFIG = ${JSON.stringify(config, null, 2)};
    (function() { ${cleanJs} })();
  </script>
</body>
</html>`.trim();
  }, [animation, config, cleanJs]);

  const handleCopyFull = () => {
    navigator.clipboard.writeText(generatedHtmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black flex flex-col lg:flex-row overflow-hidden">
      
      {/* PREVIEW ZONE */}
      <section 
        className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-black ${
          isFullScreen 
            ? 'fixed inset-0 z-[550] w-full h-full' 
            : 'h-[45vh] lg:h-full lg:flex-1 z-[510]'
        }`}
      >
        <div className="absolute inset-0 w-full h-full">
          <Sandbox 
            animation={animation} 
            currentConfig={config} 
          />
        </div>
        
        {/* Navigation & Actions Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-10 flex justify-between items-start pointer-events-none z-[600]">
          {!isFullScreen && (
            <button 
              onClick={onBack} 
              className="pointer-events-auto group flex items-center gap-2 sm:gap-4 text-white/50 hover:text-white transition-all bg-black/60 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 border border-white/10 rounded-none shadow-2xl"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.4em]">Back</span>
            </button>
          )}

          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`pointer-events-auto group flex items-center gap-2 sm:gap-4 transition-all bg-black/80 backdrop-blur-xl px-4 py-2 sm:px-5 sm:py-3 border border-white/20 rounded-none shadow-2xl ${
              isFullScreen ? 'text-white hover:bg-white hover:text-black border-white/40' : 'text-white/50 hover:text-white'
            } ml-auto`}
          >
            {isFullScreen ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.4em]">Exit Full</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.4em]">Full Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Viewport Accents */}
        {!isFullScreen && (
          <>
            <div className="absolute inset-0 border-[20px] lg:border-[30px] border-black pointer-events-none z-40"></div>
            <div className="absolute inset-4 lg:inset-8 border border-white/5 pointer-events-none z-40"></div>
          </>
        )}
      </section>

      {/* CUSTOMIZATION PANEL */}
      <aside 
        className={`bg-[#080808] border-l lg:border-t-0 border-t border-white/[0.05] overflow-y-auto flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isFullScreen 
            ? 'h-0 w-0 opacity-0 pointer-events-none' 
            : 'h-[55vh] w-full lg:h-full lg:w-[450px] opacity-100'
        } z-[520]`}
      >
        <header className="sticky top-0 z-20 bg-[#080808]/95 backdrop-blur-xl p-6 lg:p-10 border-b border-white/[0.05] flex justify-between items-center">
           <div className="space-y-1">
             <div className="text-[8px] lg:text-[9px] font-mono text-emerald-500 uppercase tracking-[0.4em] mb-1">Unit Online</div>
             <h2 className="text-xl lg:text-2xl font-heading font-black text-white tracking-tighter uppercase leading-none">{animation.name}</h2>
           </div>
           <div className="flex flex-col items-end gap-1">
             <div className="text-[7px] lg:text-[8px] font-mono text-zinc-600 uppercase tracking-widest">UNIT_{animation.id.slice(0,3).toUpperCase()}</div>
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
           </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 space-y-8 lg:space-y-12">
          {/* Tech Spec Grid */}
          <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
             <div className="bg-[#0c0c0c] p-4 lg:p-5 flex flex-col gap-1 lg:gap-2">
                <span className="text-[6px] lg:text-[7px] font-mono text-zinc-600 uppercase tracking-widest">Complexity</span>
                <span className="text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-wider">{animation.complexity}</span>
             </div>
             <div className="bg-[#0c0c0c] p-4 lg:p-5 flex flex-col gap-1 lg:gap-2">
                <span className="text-[6px] lg:text-[7px] font-mono text-zinc-600 uppercase tracking-widest">Category</span>
                <span className="text-[9px] lg:text-[10px] font-mono text-white uppercase tracking-wider">{animation.category}</span>
             </div>
          </div>

          {/* Config Controls */}
          <section className="space-y-8 lg:space-y-12">
            <div className="flex items-center gap-4">
               <h3 className="text-[9px] lg:text-[10px] font-mono font-black text-white uppercase tracking-[0.4em]">Parameters</h3>
               <div className="h-[1px] flex-1 bg-white/[0.03]"></div>
            </div>
            
            {animation.config?.map((param) => (
              <div key={param.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] lg:text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{param.label}</label>
                  <span className="text-[8px] lg:text-[9px] font-mono text-white tracking-widest border border-white/10 px-2 py-1 bg-white/[0.02]">{config[param.id]}</span>
                </div>
                
                {param.type === 'color' ? (
                  <input 
                    type="color" 
                    value={config[param.id]} 
                    onChange={(e) => handleConfigChange(param.id, e.target.value)} 
                    className="w-full h-10 bg-black cursor-pointer appearance-none border border-white/10" 
                  />
                ) : (
                  <input 
                    type="range" 
                    min={param.min} 
                    max={param.max} 
                    step={param.step} 
                    value={config[param.id]} 
                    onChange={(e) => handleConfigChange(param.id, parseFloat(e.target.value))} 
                    className="w-full h-[2px] bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
                  />
                )}
              </div>
            ))}
          </section>

          {/* Code Export */}
          <section className="space-y-6 pt-8 border-t border-white/[0.03]">
            <CodeBlock label="Source Code" code={generatedHtmlSnippet} language="html" />
            <button 
              onClick={handleCopyFull} 
              className={`w-full font-black py-5 transition-all text-[10px] uppercase tracking-[0.5em] border ${
                copied 
                ? 'bg-emerald-900/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-white text-black hover:bg-zinc-200 border-white'
              }`}
            >
              {copied ? 'Copied ✓' : 'Copy Specs'}
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default DetailView;