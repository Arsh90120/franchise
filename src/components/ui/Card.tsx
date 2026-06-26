import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'orange' | 'gold' | 'none';
}

export default function Card({ children, className, accent = 'none' }: CardProps) {
  return (
    <div
      className={clsx(
        'relative bg-surface/60 backdrop-blur-md border p-5 transition-all duration-300 group',
        accent === 'orange' && 'border-orange/40 shadow-[inset_0_0_20px_rgba(255,77,0,0.05)]',
        accent === 'gold' && 'border-gold/40 shadow-[inset_0_0_20px_rgba(255,204,0,0.05)]',
        accent === 'none' && 'border-white/5',
        className
      )}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
      }}
    >
      {/* Decorative corner accent */}
      {accent !== 'none' && (
        <div className={clsx(
          'absolute bottom-0 right-0 w-3 h-3',
          accent === 'orange' ? 'bg-orange' : 'bg-gold'
        )} />
      )}

      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
