"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
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
import type { PortfolioPersonOverdue, PortfolioProject, PortfolioStats } from "@/types/portfolio";

function ProjectCard({ project }: { project: PortfolioProject }) {
  const { t } = useI18n();
  const pct = project.completionRate;

  return (
    <div className="glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface">
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {project.name}
        </h3>
        <span className="shrink-0 text-xs font-bold tabular-nums text-blue-600 dark:text-blue-400">
          {pct}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[var(--muted)]">{t("common.open")}</span>
          <p className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">{project.open}</p>
        </div>
        <div>
          <span className="text-[var(--muted)]">{t("common.inProgress")}</span>
          <p className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">{project.inProgress}</p>
        </div>
        <div>
          <span className="text-[var(--muted)]">{t("common.done")}</span>
          <p className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">{project.closed}</p>
        </div>
        <div>
          <span className="text-[var(--muted)]">{t("common.overdue")}</span>
          <p className={`font-semibold tabular-nums ${project.overdue > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-800 dark:text-zinc-100"}`}>
            {project.overdue}
          </p>
        </div>
      </div>
      {project.velocityPerWeek != null && (
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          {t("portfolio.velocity", { value: project.velocityPerWeek })}
        </p>
      )}
    </div>
  );
}

function OverduePersonRow({ person }: { person: PortfolioPersonOverdue }) {
  return (
    <li className="list-none">
      <ListItem asChild>
        <Link href={`/performance/${person.id}`}>
          <Avatar name={person.name} src={person.profilePicture} size={28} />
          <ListItemContent>
            <ListItemTitle>{person.name}</ListItemTitle>
          </ListItemContent>
          <ListItemActions>
            <span className="rounded-lg bg-red-50 px-2 py-0.5 text-xs font-bold tabular-nums text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {person.overdueCount}
            </span>
          </ListItemActions>
        </Link>
      </ListItem>
    </li>
  );
}

interface PortfolioGridProps {
  stats: PortfolioStats;
}

export function PortfolioGrid({ stats }: PortfolioGridProps) {
  const { t, formatRelativeTime } = useI18n();

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t("portfolio.title")}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {t("portfolio.subtitle")}
        </p>
      </div>

      {stats.projects.length === 0 ? (
        <div className="glass-strong flex h-48 items-center justify-center rounded-2xl border border-[var(--border)]">
          <p className="text-sm text-[var(--muted)]">{t("portfolio.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {t("portfolio.topOverdue")}
          </h3>
          <List>
            {stats.topOverduePeople.length === 0 ? (
              <ListEmpty>{t("portfolio.noOverdueAssignees")}</ListEmpty>
            ) : (
              <ListGroup>
                {stats.topOverduePeople.map((p) => (
                  <OverduePersonRow key={p.id} person={p} />
                ))}
              </ListGroup>
            )}
          </List>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {t("portfolio.staleTasks")}
          </h3>
          <List>
            {stats.staleTasks.length === 0 ? (
              <ListEmpty>{t("portfolio.allUpdated")}</ListEmpty>
            ) : (
              <ListGroup>
                {stats.staleTasks.map((task) => (
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
            )}
          </List>
        </section>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("portfolio.atRiskMilestones")}
        </h3>
        <List>
          {stats.atRiskMilestones.length === 0 ? (
            <ListEmpty>{t("portfolio.noMilestonesDue")}</ListEmpty>
          ) : (
            <ListGroup>
              {stats.atRiskMilestones.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  meta={
                    task.updatedAt ? formatRelativeTime(task.updatedAt) : null
                  }
                  showAssignees={false}
                />
              ))}
            </ListGroup>
          )}
        </List>
      </section>

      <section className="glass-inset rounded-2xl border border-dashed border-[var(--border-strong)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t("portfolio.phase2")}
        </p>
        <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
          <li>{t("portfolio.phase2CustomFields")}</li>
          <li>{t("portfolio.phase2Forms")}</li>
          <li>{t("portfolio.phase2Attachments")}</li>
        </ul>
      </section>
    </div>
  );
}
