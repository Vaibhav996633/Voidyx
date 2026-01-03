import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <header className="border-b border-white/[0.05]">
        <div className="px-4 sm:px-8 py-6 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
          <Link
            to="/voidyx-admin/dashboard"
            className="text-[10px] font-mono uppercase tracking-[0.6em] text-white/80 hover:text-white"
          >
            VOIDYX // ADMIN
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/voidyx-admin/dashboard"
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/voidyx-admin/animations"
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
            >
              Animations
            </Link>
          </nav>
          </div>

        <button
          onClick={() => void supabase.auth.signOut()}
          className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
        >
          Sign out
        </button>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
