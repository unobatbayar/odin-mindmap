import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { DashboardTaskSummary } from "@/types/dashboard";

function formatDueDate(ts?: string | null): string {
  const ms = Number(ts);
  if (!Number.isFinite(ms)) return "No due date";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface KpiTaskPanelProps {
  title: string;
  tasks: DashboardTaskSummary[];
  variant: "danger" | "warning";
  onClose: () => void;
}

const titleClasses = {
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
};

export function KpiTaskPanel({
  title,
  tasks,
  variant,
  onClose,
}: KpiTaskPanelProps) {
  return (
    <div className="glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface">
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`text-sm font-bold ${titleClasses[variant]}`}
        >
          {title} ({tasks.length})
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--panel-solid)] hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          Close
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">No tasks in this group.</p>
      ) : (
        <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto custom-scrollbar">
          {tasks.map((task) => (
            <li key={task.id}>
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--panel-solid)] ${
                  variant === "danger"
                    ? "border-red-200/50 dark:border-red-900/30"
                    : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {task.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                    {task.listName ?? "Unknown list"} · Due{" "}
                    {formatDueDate(task.dueDate)}
                  </p>
                </div>
                <Badge label={task.status.label} color={task.status.color} />
                <div className="flex -space-x-1.5">
                  {task.assignees.slice(0, 3).map((a) => (
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
      )}
    </div>
  );
}
