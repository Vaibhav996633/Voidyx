import React from 'react';
import Hero from '../../components/features/Hero';
import { useGallery } from '../../hooks/useGallery';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { free, loading } = useGallery();

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[400px] bg-gradient-radial from-white/[0.03] to-transparent blur-[120px] animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>
        <div className="relative z-10 text-center space-y-6 animate-fade-in">
          <p className="text-white/80 font-heading font-black uppercase tracking-tighter text-5xl">VOIDYX</p>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.8em]">Initializing Vault // Syncing Units</p>
          <div className="w-64 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <Hero
      featuredAnimations={free.slice(0, 6)}
      onSelect={(id) => navigate(`/animations/${id}`)}
      onEnterGallery={() => navigate('/gallery')}
    />
  );
}
