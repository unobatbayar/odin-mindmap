"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import { MemberCapacityCard } from "./MemberCapacityCard";
import type { DashboardMemberWorkload } from "@/types/dashboard";

interface TeamWorkloadSectionProps {
  teamWorkload: DashboardMemberWorkload[];
}

export function TeamWorkloadSection({ teamWorkload }: TeamWorkloadSectionProps) {
  const { t } = useI18n();

  if (teamWorkload.length === 0) {
    return (
      <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          {t("dashboard.teamWorkload")}
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {t("dashboard.workloadEmpty")}
        </p>
      </section>
    );
  }

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            {t("dashboard.teamWorkload")}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {t("dashboard.workloadSublabel")}
          </p>
        </div>
        <p className="text-xs font-medium text-[var(--muted)]">
          {t(teamWorkload.length === 1 ? "common.membersOne" : "common.members", {
            count: teamWorkload.length,
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teamWorkload.map((member) => (
          <MemberCapacityCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
