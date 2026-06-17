import { KpiCard } from "./KpiCard";
import type { DashboardStats } from "@/types/dashboard";

interface KpiGridProps {
  totals: DashboardStats["totals"];
}

export function KpiGrid({ totals }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <KpiCard
        label="Total tasks"
        value={totals.total}
        sublabel={`${totals.open} open · ${totals.inProgress} in progress · ${totals.closed} done`}
      />
      <KpiCard
        label="Completion rate"
        value={`${totals.completionRate}%`}
        accent="success"
      />
      <KpiCard
        label="Overdue"
        value={totals.overdue}
        accent={totals.overdue > 0 ? "danger" : "default"}
      />
      <KpiCard
        label="Due this week"
        value={totals.dueThisWeek}
        accent={totals.dueThisWeek > 0 ? "warning" : "default"}
      />
      <KpiCard
        label="Active collaborators"
        value={totals.activeCollaborators}
        sublabel="People with open tasks"
      />
      <KpiCard
        label="Co-assigned tasks"
        value={totals.collabTasks}
        sublabel="Multi-assignee work"
      />
    </div>
  );
}
