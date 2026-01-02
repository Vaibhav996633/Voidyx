
import React from 'react';

interface NavbarProps {
  currentView: 'home' | 'gallery' | 'detail';
  onNavigate: (view: 'home' | 'gallery') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-3xl bg-black/60 px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <div className="w-6 h-6 bg-black rounded-lg transform rotate-45 scale-90 group-hover:scale-100 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-3xl tracking-tighter leading-none text-white uppercase">VOIDYX</span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.5em] mt-1">Motion Engine</span>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <button 
            onClick={() => onNavigate('gallery')} 
            className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${currentView === 'gallery' ? 'text-white underline decoration-2 underline-offset-8' : 'text-zinc-500 hover:text-white'}`}
          >
            Library
          </button>
          <button 
            onClick={() => onNavigate('home')} 
            className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${currentView === 'home' ? 'text-white underline decoration-2 underline-offset-8' : 'text-zinc-500 hover:text-white'}`}
          >
            Manifesto
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
