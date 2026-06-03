export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="section-title">Welcome Back, GM</p>
        <h1 className="font-heading text-4xl font-800 uppercase mt-1">
          Your <span className="text-orange">Franchise</span> Awaits
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="section-title">Season</p>
          <p className="font-heading text-3xl font-700 mt-1">2025–26</p>
        </div>
        <div className="stat-card">
          <p className="section-title">Record</p>
          <p className="font-heading text-3xl font-700 mt-1">—</p>
        </div>
        <div className="stat-card">
          <p className="section-title">Cap Space</p>
          <p className="font-heading text-3xl font-700 mt-1 text-gold">—</p>
        </div>
      </div>

      <div className="stat-card">
        <p className="section-title mb-3">Quick Actions</p>
        <div className="flex gap-3 flex-wrap">
          <button className="btn-primary">Sim Next Game</button>
          <button className="btn-secondary">View Roster</button>
          <button className="btn-secondary">Trade Center</button>
          <button className="btn-secondary">Draft Board</button>
        </div>
      </div>
    </div>
  );
}
