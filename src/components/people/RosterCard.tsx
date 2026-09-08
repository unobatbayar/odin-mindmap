"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { personHref } from "@/lib/people/api";
import type { PeopleRosterMember } from "@/types/people";
import { ActivitySparkline } from "./charts/ActivitySparkline";
import { PerformanceGradeBadge } from "./PerformanceGradeBadge";

interface RosterCardProps {
  member: PeopleRosterMember;
  query: URLSearchParams;
}

export function RosterCard({ member, query }: RosterCardProps) {
  const { t, formatRelativeTime } = useI18n();
  const lastActive = member.lastActiveAt
    ? formatRelativeTime(member.lastActiveAt)
    : t("common.emDash");
  const openTotal = member.open + member.inProgress;
  const statusTotal = member.byStatus.reduce((s, g) => s + g.count, 0);

  return (
    <Link
      href={personHref(member.id, query)}
      className="glass-inset block rounded-2xl border border-[var(--border)] p-4 shadow-surface transition-colors hover:border-[var(--border-strong)] hover:shadow-surface-lg"
    >
      <div className="flex items-start gap-3">
        <Avatar name={member.name} src={member.profilePicture} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]">
              {member.name}
            </p>
            <PerformanceGradeBadge grade={member.grade} compact />
          </div>
          <p className="mt-0.5 text-[10px] font-medium text-[var(--muted)]">
            {t("performance.lastActive", { time: lastActive })}
          </p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <dt className="text-[10px] font-medium text-[var(--muted)]">
            {t("common.completed")}
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {member.completed}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium text-[var(--muted)]">
            {t("common.open")}
          </dt>
          <dd className="text-lg font-semibold tabular-nums text-[var(--foreground)]">
            {openTotal}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium text-[var(--muted)]">
            {t("common.overdue")}
          </dt>
          <dd
            className={`text-lg font-semibold tabular-nums ${
              member.overdue > 0
                ? "text-red-600 dark:text-red-400"
                : "text-[var(--foreground)]"
            }`}
          >
            {member.overdue}
          </dd>
        </div>
      </dl>

      <div className="mt-3">
        <ActivitySparkline data={member.weeklyCompleted} />
      </div>

      {statusTotal > 0 ? (
        <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          {member.byStatus.map((status) => (
            <div
              key={status.label}
              className="h-full min-w-[2px]"
              style={{
                width: `${(status.count / statusTotal) * 100}%`,
                backgroundColor: status.color,
              }}
              title={`${status.label}: ${status.count}`}
            />
          ))}
        </div>
      ) : null}
    </Link>
  );
}
