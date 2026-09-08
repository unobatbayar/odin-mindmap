"use client";

import { List, ListEmpty, ListGroup, ListHeader } from "@/components/ui/list";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { DashboardTaskSummary } from "@/types/dashboard";

interface KpiTaskPanelProps {
  title: string;
  tasks: DashboardTaskSummary[];
  variant: "danger" | "warning" | "success" | "default";
  onClose: () => void;
}

const titleClasses = {
  danger: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
  default: "text-zinc-800 dark:text-zinc-100",
};

export function KpiTaskPanel({
  title,
  tasks,
  variant,
  onClose,
}: KpiTaskPanelProps) {
  const { t, formatDate } = useI18n();

  return (
    <List>
      <ListHeader className="flex items-center justify-between gap-3">
        <h3 className={`text-sm font-bold ${titleClasses[variant]}`}>
          {title} ({tasks.length})
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-black/[0.04] hover:text-zinc-700 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
        >
          {t("common.close")}
        </button>
      </ListHeader>
      {tasks.length === 0 ? (
        <ListEmpty>{t("dashboard.noTasksInGroup")}</ListEmpty>
      ) : (
        <ListGroup className="max-h-80 overflow-y-auto custom-scrollbar">
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              meta={
                task.dueDate
                  ? `${t("common.due")} ${formatDate(task.dueDate)}`
                  : t("common.noDueDate")
              }
              danger={variant === "danger"}
            />
          ))}
        </ListGroup>
      )}
    </List>
  );
}
