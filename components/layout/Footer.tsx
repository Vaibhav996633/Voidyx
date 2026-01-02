
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.02] py-32 px-8 bg-[#050505] z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.6em]">© 2025 VOIDYX SYSTEMS INT.</p>
          <p className="text-[7px] font-mono text-zinc-800 uppercase tracking-[0.4em]">FORGED IN THE VOID // ALL RIGHTS RESERVED</p>
        </div>
        <div className="flex gap-12 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.6em]">
          <a href="#" className="hover:text-white transition-colors">Legal</a>
          <a href="#" className="hover:text-white transition-colors">Manifesto</a>
          <a href="#" className="hover:text-white transition-colors">Source</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
