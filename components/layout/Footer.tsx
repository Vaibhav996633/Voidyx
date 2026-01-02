
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-32 px-10 bg-black z-20 relative overflow-hidden">
      {/* Decorative Background Symbol */}
      <div className="absolute -bottom-20 -right-20 display-mega text-white/[0.02] select-none pointer-events-none uppercase italic">
        VOID
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-5 space-y-10">
          <div className="space-y-4">
             <div className="font-heading font-black text-4xl text-white uppercase tracking-tighter">VOIDYX</div>
             <p className="text-zinc-600 font-light text-sm leading-relaxed max-w-sm">
                Premium web motion foundry built for developers who demand cinematic high-fidelity primitives without the overhead.
             </p>
          </div>
          <div className="flex gap-8 items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
             <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Status // Optimal
             </span>
             <span className="text-zinc-800">/</span>
             <span>Region // Global</span>
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
           <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em]">Protocol</h4>
           <div className="flex flex-col gap-4 text-[11px] font-mono text-zinc-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Registry Specs</a>
              <a href="#" className="hover:text-white transition-colors">Manifesto v2.0</a>
              <a href="#" className="hover:text-white transition-colors">Security Node</a>
           </div>
        </div>

        <div className="md:col-span-4 space-y-8">
           <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em]">Signal</h4>
           <div className="flex flex-col gap-6">
              <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Subscribe for deployment updates</p>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="ENDPOINT@MAIL.IO" 
                   className="flex-1 bg-white/[0.02] border border-white/5 px-6 py-4 text-[10px] font-mono text-white placeholder-zinc-800 outline-none focus:border-white/20 transition-all"
                 />
                 <button className="bg-white text-black px-6 font-black text-[10px] uppercase hover:bg-zinc-200 transition-all">OK</button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-1">
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.6em]">© 2025 VOIDYX SYSTEMS INT.</p>
          <p className="text-[7px] font-mono text-zinc-800 uppercase tracking-[0.4em]">FORGED IN THE VOID // MOTION_TYPE_PRIMARY</p>
        </div>
        <div className="flex gap-12 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.6em] items-center">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <div className="w-2 h-2 bg-white/20 rotate-45"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
