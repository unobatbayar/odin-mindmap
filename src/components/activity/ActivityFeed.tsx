"use client";

import { List, ListEmpty, ListGroup } from "@/components/ui/list";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { ActivityEvent, ActivityStats } from "@/types/activity";

function EventRow({ event }: { event: ActivityEvent }) {
  const { t, formatRelativeTime } = useI18n();
  const kindLabel =
    event.kind === "completed" ? t("activity.completed") : t("activity.updated");

  return (
    <TaskListItem
      task={event.task}
      description={`${kindLabel} · ${event.task.listName ?? t("common.unknownList")} · ${formatRelativeTime(event.at)}`}
    />
  );
}

interface ActivityFeedProps {
  stats: ActivityStats;
}

export function ActivityFeed({ stats }: ActivityFeedProps) {
  const { t, formatDayHeading } = useI18n();
  const byDay = new Map<string, ActivityEvent[]>();
  for (const event of stats.events) {
    const heading = formatDayHeading(Number(event.at));
    const bucket = byDay.get(heading) ?? [];
    bucket.push(event);
    byDay.set(heading, bucket);
  }

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {t("activity.title")}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("activity.subtitle", { range: stats.range.replace("d", "") })}
        </p>
      </div>

      {stats.events.length === 0 ? (
        <List>
          <ListEmpty>{t("activity.empty")}</ListEmpty>
        </List>
      ) : (
        <div className="space-y-6">
          {[...byDay.entries()].map(([day, events]) => (
            <section key={day} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {day}
              </h3>
              <List>
                <ListGroup>
                  {events.map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </ListGroup>
              </List>
            </section>
          ))}
        </div>
      )}

      <section className="glass-inset rounded-2xl border border-dashed border-[var(--border-strong)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t("portfolio.phase2")}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">{t("activity.phase2Forms")}</p>
      </section>
    </div>
  );
}
