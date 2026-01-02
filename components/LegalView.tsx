import React from 'react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
  const content = type === 'privacy' ? {
    title: 'Privacy Protocol',
    id: 'PRV-001',
    sections: [
      {
        label: 'Data Collection',
        text: 'Voidyx does not collect, store, or transmit personal user data. Our platform operates as a static client-side registry for motion primitives.'
      },
      {
        label: 'Local Storage',
        text: 'Temporary configuration parameters for animation previews are stored in the browser session. No identifying information is recorded.'
      },
      {
        label: 'Third Party',
        text: 'External CDN links (Three.js, etc.) are utilized for core logic. These providers may have independent logging protocols for asset requests.'
      }
    ]
  } : {
    title: 'System Terms',
    id: 'TOS-001',
    sections: [
      {
        label: 'Usage Rights',
        text: 'Motion units provided in the Voidyx registry are intended for developmental prototyping and production implementation under open creative licenses.'
      },
      {
        label: 'No Liability',
        text: 'Voidyx Systems is not responsible for GPU strain, performance degradation, or integration conflicts resulting from the use of intensive WebGL units.'
      },
      {
        label: 'Source Integrity',
        text: 'Users are permitted to modify, fork, and redeploy source snippets. The Voidyx brand and UI identity remain the property of the foundry.'
      }
    ]
  };

  return (
    <main className="flex-1 pt-48 pb-40 px-8 animate-fade-in relative z-10">
      <div className="max-w-4xl mx-auto space-y-16">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-4 text-zinc-600 hover:text-white transition-colors w-fit"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Back to Hub</span>
        </button>

        <header className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/[0.03] pb-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter">{content.title}</h1>
            <p className="text-zinc-meta text-xl font-light tracking-tight italic">Governance for the Void.</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">{content.id} // 2025_REV</div>
        </header>

        <div className="space-y-20">
          {content.sections.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-[0.4em]">0{idx + 1}</span>
                <h3 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.6em]">{section.label}</h3>
                <div className="h-px flex-1 bg-white/[0.03]"></div>
              </div>
              <p className="text-xl text-zinc-400 font-light leading-relaxed border-l border-white/10 pl-10 max-w-2xl">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        <div className="pt-20 border-t border-white/[0.03] text-center">
          <p className="text-[8px] font-mono text-zinc-800 uppercase tracking-[0.8em]">End of Protocol // Authorized 2025</p>
        </div>
      </div>
    </main>
  );
};

export default LegalView;