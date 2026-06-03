interface StatRowProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatRow({ label, value, sub }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-muted text-sm font-body">{label}</span>
      <div className="text-right">
        <span className="font-heading font-700 text-text">{value}</span>
        {sub && <span className="text-xs text-muted ml-1 font-body">{sub}</span>}
      </div>
    </div>
  );
}
