import { clsx } from 'clsx';

type BadgeVariant = 'orange' | 'gold' | 'muted' | 'green' | 'red';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  orange: 'bg-orange text-white border-orange shadow-[0_0_10px_rgba(255,77,0,0.3)]',
  gold: 'bg-gold text-black border-gold font-800',
  muted: 'bg-white/5 text-muted border-white/10',
  green: 'bg-2k-blue/20 text-2k-blue border-2k-blue/30',
  red: 'bg-2k-red text-white border-2k-red shadow-[0_0_10px_rgba(255,0,60,0.3)]',
};

export default function Badge({ label, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-heading font-bold uppercase italic border skew-x-[-12deg]',
        variants[variant]
      )}
    >
      <span className="skew-x-[12deg]">{label}</span>
    </span>
  );
}
