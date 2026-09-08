"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { KpiCard } from "./KpiCard";
import { KpiTaskPanel } from "./KpiTaskPanel";
import type { DashboardStats } from "@/types/dashboard";

type KpiPanel = "overdue" | "dueThisWeek";

interface KpiGridProps {
  totals: DashboardStats["totals"];
  dueTasks: DashboardStats["dueTasks"];
}

export function KpiGrid({ totals, dueTasks }: KpiGridProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<KpiPanel | null>(null);

  function toggle(panel: KpiPanel, count: number) {
    if (count === 0) return;
    setExpanded((prev) => (prev === panel ? null : panel));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label={t("dashboard.totalTasks")}
          value={totals.total}
          sublabel={t("dashboard.kpiOpenMix", {
            open: totals.open,
            inProgress: totals.inProgress,
            closed: totals.closed,
          })}
        />
        <KpiCard
          label={t("dashboard.completionRate")}
          value={`${totals.completionRate}%`}
          accent="success"
        />
        <KpiCard
          label={t("dashboard.overdue")}
          value={totals.overdue}
          accent={totals.overdue > 0 ? "danger" : "default"}
          interactive={totals.overdue > 0}
          active={expanded === "overdue"}
          onClick={() => toggle("overdue", totals.overdue)}
        />
        <KpiCard
          label={t("dashboard.dueThisWeek")}
          value={totals.dueThisWeek}
          accent={totals.dueThisWeek > 0 ? "warning" : "default"}
          interactive={totals.dueThisWeek > 0}
          active={expanded === "dueThisWeek"}
          onClick={() => toggle("dueThisWeek", totals.dueThisWeek)}
        />
        <KpiCard
          label={t("dashboard.activeCollaborators")}
          value={totals.activeCollaborators}
          sublabel={t("dashboard.peopleWithOpen")}
        />
        <KpiCard
          label={t("dashboard.coAssigned")}
          value={totals.collabTasks}
          sublabel={t("dashboard.multiAssignee")}
        />
      </div>

      {expanded === "overdue" && (
        <KpiTaskPanel
          title={t("dashboard.overdueTasks")}
          tasks={dueTasks.overdue}
          variant="danger"
          onClose={() => setExpanded(null)}
        />
      )}
      {expanded === "dueThisWeek" && (
        <KpiTaskPanel
          title={t("kpi.dueThisWeek")}
          tasks={dueTasks.dueThisWeek}
          variant="warning"
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
