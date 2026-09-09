"use client";

import { useEffect, useState } from "react";
import {
  List,
  ListEmpty,
  ListGroup,
  ListItem,
  ListItemActions,
  ListItemContent,
  ListItemTitle,
} from "@/components/ui/list";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { DashboardTaskSummary } from "@/types/dashboard";

export interface CollapsibleTaskGroup {
  label: string;
  color: string;
  count: number;
  tasks: DashboardTaskSummary[];
}

export function CollapsibleTaskGroups({
  groups,
  emptyLabel,
}: {
  groups: CollapsibleTaskGroup[];
  emptyLabel: string;
}) {
  const { formatRelativeTime } = useI18n();
  const [openLabel, setOpenLabel] = useState<string | null>(
    groups[0]?.label ?? null,
  );

  // Keep the open section valid when filter/data changes.
  // null means intentionally collapsed — do not auto-reopen.
  useEffect(() => {
    if (groups.length === 0) {
      setOpenLabel(null);
      return;
    }
    if (openLabel !== null && !groups.some((g) => g.label === openLabel)) {
      setOpenLabel(groups[0].label);
    }
  }, [groups, openLabel]);

  if (groups.length === 0) {
    return (
      <List>
        <ListEmpty>{emptyLabel}</ListEmpty>
      </List>
    );
  }

  return (
    <List>
      <ListGroup>
        {groups.map((group) => {
          const isOpen = openLabel === group.label;
          return (
            <li key={group.label} className="list-none">
              <ListItem asChild active={isOpen}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenLabel((prev) =>
                      prev === group.label ? null : group.label,
                    )
                  }
                  aria-expanded={isOpen}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: group.color }}
                  />
                  <ListItemContent>
                    <ListItemTitle className="text-xs">
                      {group.label}
                    </ListItemTitle>
                  </ListItemContent>
                  <ListItemActions>
                    <span className="text-xs tabular-nums text-[var(--muted)]">
                      ({group.count})
                    </span>
                  </ListItemActions>
                </button>
              </ListItem>
              {isOpen ? (
                <ListGroup className="max-h-96 overflow-y-auto border-t border-[var(--border)] bg-black/[0.015] custom-scrollbar dark:bg-white/[0.02]">
                  {group.tasks.map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      meta={
                        task.updatedAt
                          ? formatRelativeTime(task.updatedAt)
                          : null
                      }
                      showAssignees={false}
                    />
                  ))}
                </ListGroup>
              ) : null}
            </li>
          );
        })}
      </ListGroup>
    </List>
  );
}
