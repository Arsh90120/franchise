'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <aside className="w-56 bg-surface border-r border-border flex flex-col h-full shrink-0">
      <div className="px-5 py-6 border-b border-border">
        <p className="font-heading text-2xl font-800 uppercase tracking-widest">
          <span className="text-orange">Fran</span>chise
        </p>
        <p className="text-muted text-xs mt-0.5 font-body">GM Mode</p>
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

      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted font-body">v0.1.0 — Phase 1</p>
      </div>
    </aside>
  );
}
