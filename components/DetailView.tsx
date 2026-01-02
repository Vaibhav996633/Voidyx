
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
    <div className="fixed inset-0 z-[60] bg-black flex overflow-hidden">
      <div className="flex-1 relative bg-black">
        <Sandbox animation={animation} currentConfig={config} />
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none">
          <button onClick={onBack} className="pointer-events-auto flex items-center gap-3 text-white/40 hover:text-white transition-all bg-black/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/[0.05]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-bold text-[9px] tracking-[0.2em] uppercase">Return to Gallery</span>
          </button>
        </div>
      </div>

      <aside className={`w-[480px] bg-[#0a0a0a] border-l border-white/[0.03] h-screen overflow-y-auto flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${panelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl p-10 border-b border-white/[0.03] flex justify-between items-center">
           <div>
             <h2 className="text-xl font-heading font-black text-white tracking-tight uppercase">Parameter Stack</h2>
             <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Modulating {animation.id}</p>
           </div>
           <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
        </div>

        <div className="flex-1 p-10 space-y-12">
          {/* Tech Specs Section */}
          <section className="bg-white/[0.02] p-6 border border-white/[0.05] space-y-4">
             <h3 className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">Technical Specifications</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[8px] font-mono text-zinc-700 uppercase">Complexity</p>
                   <p className="text-[10px] font-mono text-white">{animation.complexity}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-mono text-zinc-700 uppercase">Category</p>
                   <p className="text-[10px] font-mono text-white">/{animation.category}/</p>
                </div>
                <div className="col-span-2 space-y-1 border-t border-white/[0.03] pt-4">
                   <p className="text-[8px] font-mono text-zinc-700 uppercase">Telemetry Note</p>
                   <p className="text-[10px] font-mono text-zinc-400 italic">"{animation.performanceNote || 'Standard performance footprint.'}"</p>
                </div>
             </div>
          </section>

          <section className="space-y-10">
            {animation.config?.map((param) => (
              <div key={param.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{param.label}</label>
                  <span className="text-[8px] font-mono text-zinc-700">{config[param.id]}</span>
                </div>
                {param.type === 'color' ? (
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={config[param.id]} 
                      onChange={(e) => handleConfigChange(param.id, e.target.value)} 
                      className="w-full h-8 bg-transparent border-none outline-none cursor-pointer rounded-none" 
                    />
                    <div className="text-[10px] font-mono text-zinc-600 uppercase">{config[param.id]}</div>
                  </div>
                ) : (
                  <input 
                    type="range" 
                    min={param.min} 
                    max={param.max} 
                    step={param.step} 
                    value={config[param.id]} 
                    onChange={(e) => handleConfigChange(param.id, parseFloat(e.target.value))} 
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </section>

          <section className="space-y-8 pt-10 border-t border-white/[0.03]">
            <CodeBlock label="Production Bundle" code={generatedHtmlSnippet} language="html" />
            <button 
              onClick={handleCopyFull} 
              className={`w-full font-black py-6 rounded-full transition-all text-[10px] uppercase tracking-[0.4em] ${copied ? 'bg-zinc-800 text-white' : 'bg-white text-black hover:bg-zinc-100 shadow-[0_10px_30px_rgba(255,255,255,0.05)]'}`}
            >
              {copied ? 'Copied to Buffer' : 'Export Movement'}
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default DetailView;
