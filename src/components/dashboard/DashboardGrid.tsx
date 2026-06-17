"use client";

import { ActivitySection } from "./ActivitySection";
import { GoalsSection } from "./GoalsSection";
import { KpiGrid } from "./KpiGrid";
import { MilestoneSection } from "./MilestoneSection";
import type { DashboardStats } from "@/types/dashboard";

interface DashboardGridProps {
  stats: DashboardStats;
}

export function DashboardGrid({ stats }: DashboardGridProps) {
  const activeProject = stats.listId
    ? stats.projects.find((p) => p.id === stats.listId)
    : null;

  return (
    <div className="custom-scrollbar space-y-6 overflow-y-auto p-6">
      {activeProject && (
        <p className="text-xs font-medium text-[var(--muted)]">
          Showing{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {activeProject.name}
          </span>{" "}
          only
        </p>
      )}
      <KpiGrid totals={stats.totals} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MilestoneSection milestones={stats.milestones} />
        {stats.listId ? (
          <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Goals & KPIs
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Goals are workspace-wide. Select &ldquo;All projects&rdquo; to view them.
            </p>
          </section>
        ) : (
          <GoalsSection goals={stats.goals} />
        )}
      </div>
      <ActivitySection
        recentActivity={stats.recentActivity}
        weeklyCompleted={stats.weeklyCompleted}
        range={stats.range}
      />
    </div>
  );
}
