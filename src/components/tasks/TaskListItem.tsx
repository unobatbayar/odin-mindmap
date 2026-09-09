"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  ListItem,
  ListItemActions,
  ListItemContent,
  ListItemDescription,
  ListItemTitle,
} from "@/components/ui/list";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import type { DashboardAssignee } from "@/types/dashboard";

export interface TaskListItemTask {
  id: string;
  name: string;
  url: string;
  status: { label: string; color: string };
  listName?: string;
  assignees?: DashboardAssignee[];
}

interface TaskListItemProps {
  task: TaskListItemTask;
  /** Extra meta after list name (e.g. relative time, due date). */
  meta?: string | null;
  /** Full subtitle override (skips list · meta). */
  description?: string | null;
  showAssignees?: boolean;
  danger?: boolean;
  className?: string;
}

function safeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
  } catch {
    // ignore
  }
  return null;
}

export function TaskListItem({
  task,
  meta,
  description,
  showAssignees = true,
  danger = false,
  className,
}: TaskListItemProps) {
  const { t } = useI18n();
  const assignees = task.assignees ?? [];
  const subtitle =
    description ??
    [task.listName ?? t("common.unknownList"), meta].filter(Boolean).join(" · ");
  const href = safeHttpUrl(task.url);

  return (
    <li className={cn("list-none", className)}>
      <ListItem asChild danger={danger}>
        <a
          href={href ?? undefined}
          target={href ? "_blank" : undefined}
          rel={href ? "noopener noreferrer" : undefined}
          onClick={href ? undefined : (e) => e.preventDefault()}
        >
          <ListItemContent>
            <ListItemTitle>{task.name}</ListItemTitle>
            <ListItemDescription>{subtitle}</ListItemDescription>
          </ListItemContent>
          <ListItemActions>
            <Badge label={task.status.label} color={task.status.color} />
            {showAssignees && assignees.length > 0 ? (
              <div className="flex -space-x-1.5">
                {assignees.slice(0, 3).map((a) => (
                  <Avatar
                    key={a.id}
                    name={a.name}
                    src={a.profilePicture}
                    size={22}
                  />
                ))}
              </div>
            ) : null}
          </ListItemActions>
        </a>
      </ListItem>
    </li>
  );
}
