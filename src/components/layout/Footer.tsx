import React from 'react';

interface FooterProps {
  onNavigate?: (view: 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/[0.03] py-20 px-8 bg-[#050505] z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        {/* Brand & Slogan */}
        <div className="space-y-2">
          <div className="font-heading font-black text-2xl text-white uppercase tracking-tighter">VOIDYX</div>
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-[0.4em]">Motion Registry // v2.5.0</p>
        </div>

        {/* System Status - Aesthetic & Functional */}
        <div className="flex gap-10 items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">System Status</span>
            <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              Operational
            </span>
          </div>
          <div className="h-8 w-px bg-white/5 hidden md:block"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Registry Units</span>
            <span className="text-[10px] font-mono text-white uppercase tracking-widest">56 Active</span>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="text-right">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.4em]">© 2025 VOIDYX SYSTEMS</p>
          <div className="flex gap-6 mt-2 justify-start md:justify-end text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
            <button 
              onClick={() => onNavigate?.('privacy')} 
              className="hover:text-white transition-colors uppercase"
            >
              Privacy
            </button>
            <button 
              onClick={() => onNavigate?.('terms')} 
              className="hover:text-white transition-colors uppercase"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;