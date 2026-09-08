"use client";

import { List, ListGroup } from "@/components/ui/list";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type {
  DashboardMilestone,
  DashboardMilestoneForecast,
} from "@/types/dashboard";

const GROUP_KEYS: Record<DashboardMilestone["group"], MessageKey> = {
  upcoming: "dashboard.upcoming",
  in_progress: "common.inProgress",
  completed: "common.completed",
  overdue: "common.overdue",
};

const GROUP_ORDER: DashboardMilestone["group"][] = [
  "overdue",
  "in_progress",
  "upcoming",
  "completed",
];

const MILESTONE_STATUS_KEYS: Record<
  DashboardMilestoneForecast["status"],
  { key: MessageKey; className: string }
> = {
  on_track: {
    key: "dashboard.onTrack",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  at_risk: {
    key: "dashboard.atRisk",
    className: "text-amber-600 dark:text-amber-400",
  },
  unknown: {
    key: "dashboard.unknown",
    className: "text-[var(--muted)]",
  },
};

interface MilestoneSectionProps {
  milestones: DashboardMilestone[];
  nextMilestoneForecast?: DashboardMilestoneForecast | null;
}

export function MilestoneSection({
  milestones,
  nextMilestoneForecast,
}: MilestoneSectionProps) {
  const { t, formatDate } = useI18n();

  if (milestones.length === 0) {
    return (
      <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          {t("dashboard.milestones")}
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {t("dashboard.noMilestones")}
        </p>
      </section>
    );
  }

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: milestones.filter((m) => m.group === group),
  })).filter((g) => g.items.length > 0);

  const statusInfo = nextMilestoneForecast
    ? MILESTONE_STATUS_KEYS[nextMilestoneForecast.status]
    : null;

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
        {t("dashboard.milestones")}
      </h2>
      {nextMilestoneForecast && statusInfo && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          {t("dashboard.nextMilestone")}{" "}
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {nextMilestoneForecast.milestoneName}
          </span>
          {nextMilestoneForecast.dueDate && (
            <> · {t("dashboard.duePrefix")} {formatDate(nextMilestoneForecast.dueDate)}</>
          )}
          {" · "}
          <span className={`font-semibold ${statusInfo.className}`}>
            {t(statusInfo.key)}
          </span>
        </p>
      )}
      <div className="mt-4 space-y-5">
        {grouped.map(({ group, items }) => (
          <div key={group} className="space-y-2">
            <h3
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                group === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : "text-[var(--muted)]"
              }`}
            >
              {t(GROUP_KEYS[group])} ({items.length})
            </h3>
            <List>
              <ListGroup>
                {items.map((m) => (
                  <TaskListItem
                    key={m.id}
                    task={m}
                    meta={
                      m.dueDate ? formatDate(m.dueDate) : t("common.noDueDate")
                    }
                    danger={m.isOverdue}
                  />
                ))}
              </ListGroup>
            </List>
          </div>
        ))}
      </div>
    </section>
  );
}
