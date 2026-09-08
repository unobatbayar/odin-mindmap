"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import {
  List,
  ListGroup,
  ListItem,
  ListItemContent,
  ListItemTitle,
} from "@/components/ui/list";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type {
  DashboardMemberWorkload,
  DashboardTaskSummary,
} from "@/types/dashboard";

function ProgressRing({ pct }: { pct: number }) {
  const size = 52;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#22c55e"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
        {pct}%
      </span>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      className={`shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="M3 1.5L7.5 5L3 8.5" />
    </svg>
  );
}

function TaskList({ tasks }: { tasks: DashboardTaskSummary[] }) {
  return (
    <List className="mb-2 ml-4">
      <ListGroup>
        {tasks.map((task) => (
          <li key={task.id} className="list-none">
            <ListItem asChild>
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="!py-2"
              >
                <ListItemContent>
                  <ListItemTitle className="text-xs font-medium text-[var(--muted)] hover:text-zinc-800 dark:hover:text-zinc-100">
                    {task.name}
                  </ListItemTitle>
                </ListItemContent>
              </a>
            </ListItem>
          </li>
        ))}
      </ListGroup>
    </List>
  );
}

interface MemberCapacityCardProps {
  member: DashboardMemberWorkload;
}

export function MemberCapacityCard({ member }: MemberCapacityCardProps) {
  const { t } = useI18n();
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [doneOpen, setDoneOpen] = useState(false);

  const toggleStatus = (label: string) => {
    setExpandedStatus((prev) => (prev === label ? null : label));
  };

  return (
    <article className="glass-inset rounded-xl border border-[var(--border)] p-4 shadow-surface">
      <div className="flex items-start gap-3">
        <Link
          href={`/performance/${member.id}`}
          className="shrink-0 rounded-full"
          title={t("dashboard.viewPerformance", { name: member.name })}
        >
          <Avatar
            name={member.name}
            src={member.profilePicture}
            size={36}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/performance/${member.id}`}
            className="block truncate text-sm font-bold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
          >
            {member.name}
          </Link>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                {member.notDone}
              </p>
              <p className="text-[10px] font-medium text-[var(--muted)]">
                {t("common.notDone")}
              </p>
            </div>
            <div>
              {member.done > 0 ? (
                <button
                  type="button"
                  onClick={() => setDoneOpen((v) => !v)}
                  className="group text-left"
                  aria-expanded={doneOpen}
                >
                  <p className="text-lg font-bold tabular-nums text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {member.done}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] font-medium text-[var(--muted)] group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {t("common.done")}
                    <Chevron open={doneOpen} />
                  </p>
                </button>
              ) : (
                <>
                  <p className="text-lg font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                    {member.done}
                  </p>
                  <p className="text-[10px] font-medium text-[var(--muted)]">
                    {t("common.done")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <ProgressRing pct={member.completionPct} />
      </div>

      {doneOpen && member.doneTasks.length > 0 && (
        <div className="mt-3 border-t border-[var(--border)] pt-2">
          <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("dashboard.doneTasks")}
          </p>
          <TaskList tasks={member.doneTasks} />
        </div>
      )}

      {member.notDone > 0 && member.byStatus.length > 0 && (
        <>
          <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
            {member.byStatus.map((status) => (
              <div
                key={status.label}
                className="h-full min-w-[2px] transition-all"
                style={{
                  width: `${(status.count / member.notDone) * 100}%`,
                  backgroundColor: status.color,
                }}
                title={`${status.label}: ${status.count}`}
              />
            ))}
          </div>

          <ul className="mt-3 divide-y divide-[var(--border)]">
            {member.byStatus.map((status) => {
              const isOpen = expandedStatus === status.label;
              return (
                <li key={status.label}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(status.label)}
                    className="flex w-full items-center gap-2 py-2 text-left transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <Chevron open={isOpen} />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {status.label}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-[var(--muted)]">
                      ({status.count})
                    </span>
                  </button>
                  {isOpen && <TaskList tasks={status.tasks} />}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </article>
  );
}
