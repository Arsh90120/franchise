'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { clsx } from 'clsx';

const nav = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Roster', href: '/roster', icon: '👥' },
  { label: 'Trade Center', href: '/trades', icon: '🔄' },
  { label: 'Sim Engine', href: '/sim', icon: '▶️' },
  { label: 'Draft', href: '/draft', icon: '🎯' },
  { label: 'Analytics', href: '/analytics', icon: '📊' },
  { label: 'CourtFeed', href: '/courtfeed', icon: '📱' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedTeam, wins, losses, resetGame } = useGameState();

  return (
    <aside className="w-64 bg-surface/40 backdrop-blur-xl border-r border-white/5 flex flex-col h-full shrink-0 relative overflow-hidden">
      {/* Decorative slant */}
      <div className="absolute top-0 right-0 w-32 h-full bg-orange/5 -skew-x-12 translate-x-16 pointer-events-none" />

      <div className="px-6 py-8 border-b border-white/5 relative">
        <div className="skew-2k">
          <p className="font-heading text-3xl font-800 uppercase tracking-tighter leading-none italic">
            <span className="text-orange text-glow-orange">Fran</span>
            <span className="text-white">chise</span>
          </p>
        </div>
        {selectedTeam ? (
          <div className="mt-4 bg-background/50 border border-white/5 p-3 skew-2k">
            <div className="unskew-2k">
              <p className="text-orange font-heading font-800 text-lg leading-none uppercase italic">
                {selectedTeam.abbreviation}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-white font-heading font-bold text-sm tracking-widest">{wins}–{losses}</p>
                <p className="text-muted text-[10px] font-heading font-bold uppercase italic tracking-widest">
                  {selectedTeam.conference}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted text-xs mt-2 font-heading font-bold uppercase tracking-widest italic">GM Dashboard</p>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 relative">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group flex items-center gap-4 px-4 py-3 transition-all relative skew-2k',
                isActive
                  ? 'bg-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]'
                  : 'text-muted hover:text-white hover:bg-white/5'
              )}
            >
              <div className="unskew-2k flex items-center gap-4 w-full">
                <span className={clsx('text-lg transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-orange')}>{item.icon}</span>
                <span className="font-heading font-800 uppercase italic tracking-tighter text-sm">
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/5 space-y-4 relative bg-background/20">
        <button
          onClick={() => { resetGame(); router.push('/setup'); }}
          className="group flex items-center gap-2 text-[10px] text-muted hover:text-2k-red font-heading font-800 uppercase italic tracking-widest transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Terminate Franchise
        </button>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/20 font-heading font-bold uppercase italic tracking-tighter">v0.2.0 — Phase 2</p>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-orange/40 rounded-full" />
            <div className="w-1 h-1 bg-orange/40 rounded-full" />
            <div className="w-1 h-1 bg-orange/40 rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
