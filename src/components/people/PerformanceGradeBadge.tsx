"use client";

import { TrendingUp } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { IMPROVEMENT_SHORT_KEYS } from "@/lib/people/metrics";
import type { MessageKey } from "@/lib/i18n/messages";
import type {
  GradeImprovement,
  PerformanceGrade,
  PerformanceGradeLevel,
  PerformanceGradeReasonId,
} from "@/types/people";

const LEVEL_KEY: Record<PerformanceGradeLevel, MessageKey> = {
  good: "performance.grade.good",
  average: "performance.grade.average",
  bad: "performance.grade.bad",
  insufficient: "performance.grade.insufficient",
};

const REASON_KEY: Record<PerformanceGradeReasonId, MessageKey> = {
  noData: "performance.grade.reason.noData",
  inactive: "performance.grade.reason.inactive",
  overdueHeavy: "performance.grade.reason.overdueHeavy",
  overdueOpen: "performance.grade.reason.overdueOpen",
  staleWork: "performance.grade.reason.staleWork",
  coldActivity: "performance.grade.reason.coldActivity",
  lateDelivery: "performance.grade.reason.lateDelivery",
  onTrack: "performance.grade.reason.onTrack",
  steady: "performance.grade.reason.steady",
  mixed: "performance.grade.reason.mixed",
};

const LEVEL_STYLES: Record<
  PerformanceGradeLevel,
  { shell: string; icon: string; label: string }
> = {
  good: {
    shell:
      "border-emerald-200/80 bg-emerald-50/90 dark:border-emerald-900/50 dark:bg-emerald-950/40",
    icon: "bg-emerald-500 text-white",
    label: "text-emerald-800 dark:text-emerald-200",
  },
  average: {
    shell:
      "border-amber-200/80 bg-amber-50/90 dark:border-amber-900/50 dark:bg-amber-950/40",
    icon: "bg-amber-500 text-white",
    label: "text-amber-900 dark:text-amber-200",
  },
  bad: {
    shell:
      "border-rose-200/80 bg-rose-50/90 dark:border-rose-900/50 dark:bg-rose-950/40",
    icon: "bg-rose-500 text-white",
    label: "text-rose-800 dark:text-rose-200",
  },
  insufficient: {
    shell: "border-[var(--border-strong)] bg-[var(--panel-solid)]/80",
    icon: "bg-zinc-400 text-white dark:bg-zinc-600",
    label: "text-zinc-700 dark:text-zinc-200",
  },
};

function GradeIcon({
  level,
  size = 18,
}: {
  level: PerformanceGradeLevel;
  size?: number;
}) {
  if (level === "good") return <IconGood size={size} />;
  if (level === "average") return <IconAverage size={size} />;
  if (level === "bad") return <IconBad size={size} />;
  return <IconEmpty size={size} />;
}

function IconGood({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 9.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAverage({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 9h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconBad({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 5.5v4.2M9 12.2h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEmpty({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="2.5 2.5"
      />
    </svg>
  );
}

interface PerformanceGradeBadgeProps {
  grade: PerformanceGrade;
  improvements?: GradeImprovement[];
  /** compact = icon + label only (roster cards) */
  compact?: boolean;
}

export function PerformanceGradeBadge({
  grade,
  improvements = [],
  compact = false,
}: PerformanceGradeBadgeProps) {
  const { t } = useI18n();
  const styles = LEVEL_STYLES[grade.level];
  const label =
    grade.reasonId === "inactive"
      ? t("performance.grade.inactive")
      : t(LEVEL_KEY[grade.level]);
  const reason = t(REASON_KEY[grade.reasonId]);
  const tips = improvements.slice(0, 2);
  const showImprove =
    !compact &&
    tips.length > 0 &&
    grade.level !== "insufficient" &&
    grade.level !== "good";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${styles.shell}`}
        title={reason}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${styles.icon}`}
        >
          <GradeIcon level={grade.level} size={12} />
        </span>
        <span className={`text-[11px] font-bold ${styles.label}`}>{label}</span>
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-5 rounded-2xl border p-4 shadow-surface ${styles.shell}`}
      role="status"
      aria-label={`${t("performance.grade")}: ${label}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <GradeIcon level={grade.level} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t("performance.grade")}
          </p>
          <p className={`mt-0.5 text-lg font-bold ${styles.label}`}>{label}</p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{reason}</p>
          {grade.level !== "insufficient" ? (
            <p className="mt-1 text-[11px] font-medium tabular-nums text-[var(--muted)]">
              {t("performance.grade.score", { score: grade.score })}
            </p>
          ) : null}
        </div>
      </div>

      {showImprove ? (
        <div className="flex min-w-0 max-w-sm items-start gap-3 border-l border-black/10 pl-5 dark:border-white/10">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[var(--accent-foreground)] shadow-sm dark:bg-white/10">
            <TrendingUp className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {t("performance.improve")}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {tips.map((tip) => (
                <li
                  key={tip.id}
                  className="text-sm font-medium leading-snug text-zinc-700 dark:text-zinc-300"
                >
                  {t(IMPROVEMENT_SHORT_KEYS[tip.id], tip.params)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
