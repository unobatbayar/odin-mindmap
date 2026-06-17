import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type {
  DashboardMilestone,
  DashboardMilestoneForecast,
} from "@/types/dashboard";

const GROUP_LABELS: Record<DashboardMilestone["group"], string> = {
  upcoming: "Upcoming",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

const GROUP_ORDER: DashboardMilestone["group"][] = [
  "overdue",
  "in_progress",
  "upcoming",
  "completed",
];

function formatDueDate(ts?: string | null): string {
  const ms = Number(ts);
  if (!Number.isFinite(ms)) return "No due date";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MILESTONE_STATUS_LABELS: Record<
  DashboardMilestoneForecast["status"],
  { label: string; className: string }
> = {
  on_track: {
    label: "On track",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  at_risk: {
    label: "At risk",
    className: "text-amber-600 dark:text-amber-400",
  },
  unknown: {
    label: "Unknown",
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
  if (milestones.length === 0) {
    return (
      <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          Milestones
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No milestones found in this workspace.
        </p>
      </section>
    );
  }

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: milestones.filter((m) => m.group === group),
  })).filter((g) => g.items.length > 0);

  const statusInfo = nextMilestoneForecast
    ? MILESTONE_STATUS_LABELS[nextMilestoneForecast.status]
    : null;

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
        Milestones
      </h2>
      {nextMilestoneForecast && statusInfo && (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Next milestone:{" "}
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {nextMilestoneForecast.milestoneName}
          </span>
          {nextMilestoneForecast.dueDate && (
            <> · due {formatDueDate(nextMilestoneForecast.dueDate)}</>
          )}
          {" · "}
          <span className={`font-semibold ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </p>
      )}
      <div className="mt-4 space-y-5">
        {grouped.map(({ group, items }) => (
          <div key={group}>
            <h3
              className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${
                group === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : "text-[var(--muted)]"
              }`}
            >
              {GROUP_LABELS[group]} ({items.length})
            </h3>
            <ul className="space-y-1.5">
              {items.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--panel-solid)] ${
                      m.isOverdue ? "border-red-200/50 dark:border-red-900/30" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {m.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                        {m.listName ?? "Unknown list"} · {formatDueDate(m.dueDate)}
                      </p>
                    </div>
                    <Badge label={m.status.label} color={m.status.color} />
                    <div className="flex -space-x-1.5">
                      {m.assignees.slice(0, 3).map((a) => (
                        <Avatar
                          key={a.id}
                          name={a.name}
                          src={a.profilePicture}
                          size={22}
                        />
                      ))}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
