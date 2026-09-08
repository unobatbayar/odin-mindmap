"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  List,
  ListGroup,
  ListItem,
  ListItemContent,
  ListItemTitle,
} from "@/components/ui/list";
import type { DashboardGoal } from "@/types/dashboard";

function formatProgress(kr: DashboardGoal["keyResults"][number]): string {
  const p = kr.progress;
  if (!p) return kr.type;
  if (p.current != null && p.target != null) {
    const unit = p.unit ? ` ${p.unit}` : "";
    return `${p.current} / ${p.target}${unit}`;
  }
  if (p.current != null) return `${p.current}%`;
  return kr.type;
}

interface GoalsSectionProps {
  goals: DashboardGoal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const { t } = useI18n();

  if (goals.length === 0) {
    return (
      <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          {t("dashboard.goalsKpis")}
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {t("dashboard.noGoals")}
        </p>
      </section>
    );
  }

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
        {t("dashboard.goalsKpis")}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {goal.name}
                </p>
                <span className="shrink-0 text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                  {goal.percentComplete}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.min(goal.percentComplete, 100)}%` }}
                />
              </div>
              {goal.keyResults.length > 0 && (
                <List className="mt-3">
                  <ListGroup>
                    {goal.keyResults.map((kr, i) => (
                      <li key={`${goal.id}-kr-${i}`} className="list-none">
                        <ListItem className="!px-3 !py-2">
                          <ListItemContent>
                            <ListItemTitle className="text-xs font-medium">
                              {kr.name}
                            </ListItemTitle>
                          </ListItemContent>
                          <span className="shrink-0 text-xs font-medium tabular-nums text-[var(--muted)]">
                            {formatProgress(kr)}
                          </span>
                        </ListItem>
                      </li>
                    ))}
                  </ListGroup>
                </List>
              )}
            </>
          );

          if (goal.url) {
            return (
              <a
                key={goal.id}
                href={goal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-[var(--border)] bg-[var(--panel-solid)]/50 p-4 transition-colors hover:border-blue-300/50 dark:hover:border-blue-700/50"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={goal.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--panel-solid)]/50 p-4"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
