"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";

export type PeopleKpiTone =
  | "emerald"
  | "indigo"
  | "teal"
  | "violet"
  | "sky"
  | "rose"
  | "amber"
  | "cyan"
  | "fuchsia"
  | "blue"
  | "orange";

export type PeopleKpiAccent = "default" | "success" | "warning" | "danger";

interface PeopleKpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  tone: PeopleKpiTone;
  icon: ReactNode;
  accent?: PeopleKpiAccent;
  onClick?: () => void;
  active?: boolean;
  interactive?: boolean;
}

const toneStyles: Record<
  PeopleKpiTone,
  { well: string; icon: string; bar: string }
> = {
  emerald: {
    well: "bg-emerald-50 dark:bg-emerald-950/35",
    icon: "text-emerald-600 dark:text-emerald-500",
    bar: "bg-emerald-500",
  },
  indigo: {
    well: "bg-[var(--accent-soft)]",
    icon: "text-[var(--accent-foreground)]",
    bar: "bg-[var(--accent)]",
  },
  teal: {
    well: "bg-teal-50 dark:bg-teal-950/35",
    icon: "text-teal-600 dark:text-teal-500",
    bar: "bg-teal-500",
  },
  violet: {
    well: "bg-sky-50 dark:bg-sky-950/35",
    icon: "text-sky-600 dark:text-sky-500",
    bar: "bg-sky-500",
  },
  sky: {
    well: "bg-sky-50 dark:bg-sky-950/35",
    icon: "text-sky-600 dark:text-sky-500",
    bar: "bg-sky-500",
  },
  rose: {
    well: "bg-rose-50 dark:bg-rose-950/35",
    icon: "text-rose-600 dark:text-rose-400/90",
    bar: "bg-rose-500",
  },
  amber: {
    well: "bg-amber-50 dark:bg-amber-950/35",
    icon: "text-amber-600 dark:text-amber-500",
    bar: "bg-amber-500",
  },
  cyan: {
    well: "bg-cyan-50 dark:bg-cyan-950/35",
    icon: "text-cyan-600 dark:text-cyan-500",
    bar: "bg-cyan-500",
  },
  fuchsia: {
    well: "bg-cyan-50 dark:bg-cyan-950/35",
    icon: "text-cyan-600 dark:text-cyan-500",
    bar: "bg-cyan-500",
  },
  blue: {
    well: "bg-blue-50 dark:bg-blue-950/35",
    icon: "text-blue-600 dark:text-blue-500",
    bar: "bg-blue-500",
  },
  orange: {
    well: "bg-orange-50 dark:bg-orange-950/35",
    icon: "text-orange-600 dark:text-orange-500",
    bar: "bg-orange-500",
  },
};

const accentClasses: Record<PeopleKpiAccent, string> = {
  default: "text-zinc-900 dark:text-zinc-100",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-400/90",
};

export function IconCheckCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M5.5 8.2l1.8 1.8 3.4-3.6" />
    </svg>
  );
}

export function IconLayers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 10.5L8 13.5l5.5-3" />
      <path d="M2.5 8L8 11l5.5-3" />
      <path d="M2.5 5.5L8 8.5l5.5-3L8 2.5 2.5 5.5z" />
    </svg>
  );
}

export function IconGauge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.2 12.2a6 6 0 119.6 0" />
      <path d="M8 9.5V6.5" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBars() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M4 12V7.5" />
      <path d="M8 12V4.5" />
      <path d="M12 12V9" />
    </svg>
  );
}

export function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5v3.2l2.2 1.3" />
    </svg>
  );
}

export function IconAlarm() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="8.5" r="4.5" />
      <path d="M8 6.5v2l1.4.8" />
      <path d="M3 4.2L5.2 2.8M13 4.2L10.8 2.8" />
    </svg>
  );
}

export function IconHourglass() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 2.5h7M4.5 13.5h7" />
      <path d="M5 2.5c0 3 3 3.5 3 5.5S5 10.5 5 13.5M11 2.5c0 3-3 3.5-3 5.5s3 3 3 5.5" />
    </svg>
  );
}

export function IconCycle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12.5 6.5A4.5 4.5 0 107.2 12" />
      <path d="M12.5 3.8v2.7h-2.7" />
    </svg>
  );
}

export function IconPulse() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1.5 8h3l1.5-3.5 3 7L11 8h3.5" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" />
      <path d="M6 10h.01M8 10h.01M10 10h.01" />
    </svg>
  );
}

export function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="6" cy="5.5" r="2" />
      <path d="M2.5 13c.4-2 1.7-3.2 3.5-3.2S9.1 11 9.5 13" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M10.4 9.9c1.4.2 2.4 1.2 2.7 2.6" />
    </svg>
  );
}

export function PeopleKpiCard({
  label,
  value,
  sublabel,
  tone,
  icon,
  accent = "default",
  onClick,
  active = false,
  interactive = false,
}: PeopleKpiCardProps) {
  const { t } = useI18n();
  const colors = toneStyles[tone];
  const className = [
    "relative overflow-hidden glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface text-left w-full",
    interactive
      ? "cursor-pointer transition-all hover:border-[var(--border-strong)] hover:shadow-surface-lg"
      : "",
    active ? "ring-2 ring-[var(--accent)]/25 border-[var(--accent)]/30" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className={`absolute inset-x-0 top-0 h-0.5 ${colors.bar}`} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
          {label}
        </p>
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${colors.well} ${colors.icon}`}
        >
          {icon}
        </span>
      </div>
      <p
        className={`mt-2 text-[28px] font-semibold tabular-nums tracking-tight ${accentClasses[accent]}`}
      >
        {value}
      </p>
      {sublabel ? (
        <p className="mt-1 text-xs text-[var(--muted)]">{sublabel}</p>
      ) : null}
      {interactive ? (
        <p className="mt-1.5 text-[10px] font-semibold text-[var(--accent)]">
          {t("kpi.viewTasks")} →
        </p>
      ) : null}
    </>
  );

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
