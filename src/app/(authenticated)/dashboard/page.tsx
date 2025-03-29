import { RefreshCcw } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard (WIP)</h1>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <p className="text-muted-foreground">No stats available yet.</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
            <p className="text-muted-foreground">No upcoming tasks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}