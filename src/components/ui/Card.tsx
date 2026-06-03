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
        'bg-surface border rounded-xl p-4',
        accent === 'orange' && 'border-orange/30',
        accent === 'gold' && 'border-gold/30',
        accent === 'none' && 'border-border',
        className
      )}
    >
      {children}
    </div>
  );
}
