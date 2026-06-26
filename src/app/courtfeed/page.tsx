import Card from '@/components/ui/Card';

export default function CourtFeedPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="relative">
        <div className="absolute -left-6 top-0 w-1 h-16 bg-orange" />
        <p className="section-title italic tracking-[0.3em]">Social Media // Pulse of the League</p>
        <h1 className="font-heading text-5xl font-800 uppercase italic tracking-tighter leading-none">
          Court<span className="text-orange text-glow-orange">Feed</span>
        </h1>
      </div>
      <Card accent="orange">
        <div className="py-12 text-center">
          <p className="font-heading text-xl font-bold uppercase italic tracking-widest text-white/40">
            Network Syncing // Phase 5 Deployment Pending
          </p>
          <p className="text-muted text-[10px] font-heading font-bold uppercase tracking-[0.4em] mt-4 italic">
            AI-Driven Narrative Events & Social Interaction Module in Development
          </p>
        </div>
      </Card>
    </div>
  );
}
