
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
      <div className="flex-1 relative bg-[#050505]">
        <Sandbox animation={animation} currentConfig={config} />
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-none">
          <button onClick={onBack} className="pointer-events-auto flex items-center gap-3 text-white/50 hover:text-white transition-all bg-black/60 px-8 py-4 rounded-2xl border border-white/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-bold text-sm tracking-tight uppercase">Gallery</span>
          </button>
        </div>
      </div>

      <aside className={`w-[520px] bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/10 h-screen overflow-y-auto flex flex-col transition-transform duration-700 ${panelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 p-12 border-b border-white/5">
           <h2 className="text-3xl font-heading font-black text-white tracking-tight uppercase">Parametrize</h2>
        </div>

        <div className="flex-1 p-12 space-y-16">
          <section className="space-y-12">
            {animation.config?.map((param) => (
              <div key={param.id} className="space-y-5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{param.label}</label>
                {param.type === 'color' ? (
                  <input type="color" value={config[param.id]} onChange={(e) => handleConfigChange(param.id, e.target.value)} className="w-full h-12 bg-transparent border-none outline-none cursor-pointer" />
                ) : (
                  <input type="range" min={param.min} max={param.max} step={param.step} value={config[param.id]} onChange={(e) => handleConfigChange(param.id, parseFloat(e.target.value))} className="w-full" />
                )}
              </div>
            ))}
          </section>

          <section className="space-y-10 pt-12 border-t border-white/5">
            <CodeBlock label="Voidyx Bundle" code={generatedHtmlSnippet} language="html" />
            <button onClick={handleCopyFull} className={`w-full font-black py-7 rounded-[2.5rem] transition-all text-[11px] uppercase tracking-[0.4em] ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}>
              {copied ? 'Copied ✓' : 'Copy Motion Bundle'}
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default DetailView;
