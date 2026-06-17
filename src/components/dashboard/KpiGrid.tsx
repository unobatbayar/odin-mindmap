"use client";

import { useState } from "react";
import { KpiCard } from "./KpiCard";
import { KpiTaskPanel } from "./KpiTaskPanel";
import type { DashboardStats } from "@/types/dashboard";

type KpiPanel = "overdue" | "dueThisWeek";

interface KpiGridProps {
  totals: DashboardStats["totals"];
  dueTasks: DashboardStats["dueTasks"];
}

export function KpiGrid({ totals, dueTasks }: KpiGridProps) {
  const [expanded, setExpanded] = useState<KpiPanel | null>(null);

  function toggle(panel: KpiPanel, count: number) {
    if (count === 0) return;
    setExpanded((prev) => (prev === panel ? null : panel));
  }

  return (
    <div className="space-y-3">
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
          interactive={totals.overdue > 0}
          active={expanded === "overdue"}
          onClick={() => toggle("overdue", totals.overdue)}
        />
        <KpiCard
          label="Due this week"
          value={totals.dueThisWeek}
          accent={totals.dueThisWeek > 0 ? "warning" : "default"}
          interactive={totals.dueThisWeek > 0}
          active={expanded === "dueThisWeek"}
          onClick={() => toggle("dueThisWeek", totals.dueThisWeek)}
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

      {expanded === "overdue" && (
        <KpiTaskPanel
          title="Overdue tasks"
          tasks={dueTasks.overdue}
          variant="danger"
          onClose={() => setExpanded(null)}
        />
      )}
      {expanded === "dueThisWeek" && (
        <KpiTaskPanel
          title="Due this week"
          tasks={dueTasks.dueThisWeek}
          variant="warning"
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
