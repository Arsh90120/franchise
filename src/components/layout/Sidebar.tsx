'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGameState } from '@/lib/game-state';
import { clsx } from 'clsx';

const nav = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Roster', href: '/roster', icon: '👥' },
  { label: 'Trade Center', href: '/trades', icon: '🔄' },
  { label: 'Free Agency', href: '/free-agency', icon: '✍️' },
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
    <aside className="w-56 bg-surface border-r border-border flex flex-col h-full shrink-0">
      <div className="px-5 py-6 border-b border-border">
        <p className="font-heading text-2xl font-800 uppercase tracking-widest">
          <span className="text-orange">Fran</span>chise
        </p>
        {selectedTeam ? (
          <div className="mt-1">
            <p className="text-text text-xs font-body font-600">{selectedTeam.abbreviation} · {wins}–{losses}</p>
            <p className="text-muted text-xs font-body">{selectedTeam.conference}ern</p>
          </div>
        ) : (
          <p className="text-muted text-xs mt-0.5 font-body">GM Mode</p>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors',
              pathname === item.href
                ? 'bg-orange/10 text-orange border border-orange/20'
                : 'text-muted hover:text-text hover:bg-border'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-2">
        <button
          onClick={() => { resetGame(); router.push('/setup'); }}
          className="w-full text-xs text-muted hover:text-red-400 font-body transition-colors text-left px-1"
        >
          ↩ New Franchise
        </button>
        <p className="text-xs text-muted/50 font-body px-1">v0.2.0 — Phase 4</p>
      </div>
    </aside>
  );
}
