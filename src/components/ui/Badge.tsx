import { clsx } from 'clsx';

type BadgeVariant = 'orange' | 'gold' | 'muted' | 'green' | 'red';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  orange: 'bg-orange/10 text-orange border-orange/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  muted: 'bg-border text-muted border-border',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Badge({ label, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-body border',
        variants[variant]
      )}
    >
      {label}
    </span>
  );
}
