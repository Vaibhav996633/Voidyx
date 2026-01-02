
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
    const scripts = (animation.cdnLinks || [])
      .map(link => `<script src="${link}"></script>`)
      .join('\n  ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voidyx Motion - ${animation.name}</title>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: #000; }
    ${animation.css.split('\n').map(l => '    ' + l).join('\n').trim()}
  </style>
  ${scripts}
</head>
<body>
  ${animation.html.split('\n').map(l => '  ' + l).join('\n').trim()}

  <script>
    /**
     * VOIDYX MOTION ENGINE - Generated Script
     * Primitive: ${animation.name}
     * Project: https://voidyx.motion
     */
    window.VANTA_CONFIG = ${JSON.stringify(config, null, 2)};
    
    (function() {
      ${cleanJs.split('\n').map(l => '      ' + l).join('\n').trim()}
    })();
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
    <div className="fixed inset-0 z-[60] bg-black flex overflow-hidden">
      {/* Background Interactive Preview */}
      <div className="flex-1 relative bg-[#050505]">
        <div className="absolute inset-0 animate-in fade-in duration-1000">
          <Sandbox animation={animation} currentConfig={config} />
        </div>
        
        {/* Top Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none select-none">
          <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-3 text-white/50 hover:text-white transition-all bg-black/60 hover:bg-black/80 backdrop-blur-2xl px-8 py-4 rounded-2xl border border-white/10 group shadow-2xl active:scale-95 animate-in slide-in-from-top-4 duration-500"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold text-sm tracking-tight uppercase">Gallery</span>
          </button>
          
          <div className="text-right pointer-events-none space-y-2 animate-in slide-in-from-top-4 duration-500 delay-75">
            <h1 className="text-4xl md:text-7xl font-heading font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,1)] tracking-tighter leading-none uppercase">{animation.name}</h1>
            <div className="flex gap-2 justify-end">
               <span className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full text-[10px] text-white/80 uppercase tracking-widest font-black">{animation.category} MOTION UNIT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Sidebar */}
      <aside 
        className={`w-[520px] bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/10 h-screen overflow-y-auto custom-scrollbar flex flex-col transition-all duration-700 cubic-bezier(0.2, 0, 0, 1) z-10 ${
          panelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/5 p-12">
           <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-heading font-black text-white tracking-tight uppercase">1. Parametrize</h2>
            <button onClick={onBack} className="text-zinc-600 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.4em] uppercase">Kernel config override</p>
        </div>

        <div className="flex-1 p-12 space-y-16">
          {/* Controls Section */}
          <section className="space-y-12">
            {animation.config?.map((param, idx) => (
              <div key={param.id} className="group animate-in fade-in slide-in-from-right-8 duration-700" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex justify-between items-center mb-5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] group-hover:text-zinc-200 transition-colors">
                    {param.label}
                  </label>
                  <span className="text-[10px] font-mono text-white/40 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                    {config[param.id]}
                  </span>
                </div>
                
                {param.type === 'color' && (
                  <div className="relative flex items-center gap-5">
                     <div 
                      className="w-16 h-16 rounded-3xl border border-white/10 shrink-0 cursor-pointer shadow-2xl relative overflow-hidden ring-offset-8 ring-offset-[#0a0a0a] hover:ring-2 ring-white/40 transition-all duration-500" 
                      style={{ backgroundColor: config[param.id] }} 
                     >
                       <input 
                          type="color" 
                          value={config[param.id]} 
                          onChange={(e) => handleConfigChange(param.id, e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer scale-[6]"
                        />
                     </div>
                     <div className="flex-1 relative">
                       <input 
                        type="text" 
                        value={config[param.id]} 
                        onChange={(e) => handleConfigChange(param.id, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-xs font-mono text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                       />
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 font-mono text-[9px] font-black">HEX</div>
                     </div>
                  </div>
                )}

                {param.type === 'number' && (
                  <div className="relative pt-2 group/slider">
                    <input 
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={config[param.id]}
                      onChange={(e) => handleConfigChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-zinc-400 transition-all"
                    />
                    <div className="flex justify-between mt-3 opacity-20 group-hover/slider:opacity-100 transition-opacity">
                      <span className="text-[9px] font-mono text-zinc-400">{param.min}</span>
                      <span className="text-[9px] font-mono text-zinc-400">{param.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!animation.config && (
              <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-16 text-center opacity-30">
                <p className="text-xs text-zinc-500 font-light italic tracking-widest">NO DYNAMIC PARAMS FOUND</p>
              </div>
            )}
          </section>

          {/* Bundle Section */}
          <section className="space-y-10 pt-12 border-t border-white/5">
            <div className="space-y-4">
               <h3 className="text-3xl font-heading font-black text-white tracking-tight uppercase">2. Deploy</h3>
               <p className="text-sm text-zinc-500 font-light leading-relaxed">
                 Instant integration bundle. Self-contained HTML format including kernel logic and dependency linking.
               </p>
            </div>
            
            <div className="relative group/code animate-in fade-in duration-1000">
              <CodeBlock 
                label="Self-Contained Voidyx Bundle" 
                code={generatedHtmlSnippet} 
                language="html"
              />
            </div>

            <button 
              onClick={handleCopyFull}
              className={`w-full relative overflow-hidden font-black py-7 rounded-[2.5rem] transition-all duration-700 text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-[0.96] ${
                copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <span className="relative z-10">{copied ? 'Transfer Complete ✓' : 'Copy Motion Bundle'}</span>
            </button>
          </section>
        </div>

        {/* Sidebar Footer Branding */}
        <div className="p-12 border-t border-white/5 bg-black/50">
           <div className="flex items-center gap-5">
             <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white/10 border border-white/20"></span>
             </div>
             <span className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase font-black italic">VOIDYX CORE VERIFIED</span>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default DetailView;
