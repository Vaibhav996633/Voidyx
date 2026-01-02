
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-40 px-8 bg-black z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">© 2025 VOIDYX SYSTEMS INT.</p>
        <div className="flex gap-16 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.6em]">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">License</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
