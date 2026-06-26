import Card from '@/components/ui/Card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="relative">
        <div className="absolute -left-6 top-0 w-1 h-16 bg-orange" />
        <p className="section-title italic tracking-[0.3em]">Data Center // Performance Metrics</p>
        <h1 className="font-heading text-5xl font-800 uppercase italic tracking-tighter leading-none">
          Analytics <span className="text-orange text-glow-orange">Hub</span>
        </h1>
      </div>
      <Card>
        <div className="py-12 text-center">
          <p className="font-heading text-xl font-bold uppercase italic tracking-widest text-white/40">
            Advanced Metrics Hub // Phase 7 Deployment Pending
          </p>
          <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-[0.4em] mt-4 italic">
            Statistical Modeling & Shot Chart visualization in Development
          </p>
        </div>
      </Card>
    </div>
  );
}
