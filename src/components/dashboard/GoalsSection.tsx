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
  if (goals.length === 0) {
    return (
      <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          Goals & KPIs
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No goals configured in this workspace.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
        Goals & KPIs
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {goals.map((goal) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {goal.name}
                </p>
                <span className="shrink-0 text-lg font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                  {goal.percentComplete}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: `${Math.min(goal.percentComplete, 100)}%` }}
                />
              </div>
              {goal.keyResults.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {goal.keyResults.map((kr, i) => (
                    <li
                      key={`${goal.id}-kr-${i}`}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="truncate text-zinc-700 dark:text-zinc-300">
                        {kr.name}
                      </span>
                      <span className="shrink-0 font-medium tabular-nums text-[var(--muted)]">
                        {formatProgress(kr)}
                      </span>
                    </li>
                  ))}
                </ul>
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
                className="block rounded-xl border border-[var(--border)] bg-[var(--panel-solid)]/50 p-4 transition-colors hover:border-indigo-300/50 dark:hover:border-indigo-700/50"
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
