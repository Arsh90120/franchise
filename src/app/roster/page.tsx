export default function RosterPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">Front Office</p>
        <h1 className="font-heading text-4xl font-800 uppercase mt-1">
          Your <span className="text-orange">Roster</span>
        </h1>
      </div>
      <div className="stat-card">
        <p className="text-muted font-body text-sm">Select a team to load your roster.</p>
      </div>
    </div>
  );
}
