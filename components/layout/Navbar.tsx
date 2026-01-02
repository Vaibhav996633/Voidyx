
import React from 'react';

interface NavbarProps {
  currentView: 'home' | 'gallery' | 'detail';
  onNavigate: (view: 'home' | 'gallery') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-md border-b border-white/[0.02] px-8 py-6 transition-all duration-500">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        {/* Identity - Scaled Down */}
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/20 rotate-45 group-hover:rotate-90 transition-all duration-700"></div>
            <div className="w-1.5 h-1.5 bg-white scale-100 group-hover:scale-125 transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
          </div>
          <span className="font-heading font-black text-lg tracking-tighter text-white uppercase leading-none">VOIDYX</span>
        </div>
        
        {/* Navigation - Precise */}
        <div className="flex items-center gap-12 md:gap-20">
          <button 
            onClick={() => onNavigate('gallery')} 
            className={`text-[9px] font-black uppercase tracking-[0.6em] transition-all relative group py-2 ${currentView === 'gallery' ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
          >
            Vault
            <span className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ${currentView === 'gallery' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </button>
          
          <button 
            onClick={() => onNavigate('home')} 
            className={`text-[9px] font-black uppercase tracking-[0.6em] transition-all relative group py-2 ${currentView === 'home' ? 'text-white' : 'text-zinc-600 hover:text-white'}`}
          >
            Mission
            <span className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ${currentView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
