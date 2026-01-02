
import React from 'react';

interface NavbarProps {
  currentView: 'home' | 'gallery' | 'detail';
  onNavigate: (view: 'home' | 'gallery') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.02] backdrop-blur-3xl bg-black/20 px-10 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-5 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <div className="w-5 h-5 bg-black rounded-md transform rotate-45 scale-90 group-hover:scale-100 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-2xl tracking-tighter leading-none text-white uppercase group-hover:tracking-normal transition-all duration-500">VOIDYX</span>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.6em] mt-1.5 opacity-60">Foundry V1.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-14">
          <button 
            onClick={() => onNavigate('gallery')} 
            className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative group ${currentView === 'gallery' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Vault
            <span className={`absolute -bottom-2 left-0 h-[1px] bg-white transition-all duration-500 ${currentView === 'gallery' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </button>
          <button 
            onClick={() => onNavigate('home')} 
            className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all relative group ${currentView === 'home' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Manifesto
            <span className={`absolute -bottom-2 left-0 h-[1px] bg-white transition-all duration-500 ${currentView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
