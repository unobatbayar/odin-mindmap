"use client";

import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { TimelineZoomPreset } from "@/types/timelineViewport";

const PRESETS: { value: TimelineZoomPreset; labelKey: MessageKey }[] = [
  { value: "day", labelKey: "date.day" },
  { value: "week", labelKey: "date.week" },
  { value: "month", labelKey: "date.month" },
  { value: "quarter", labelKey: "date.quarter" },
  { value: "year", labelKey: "date.year" },
];

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 3L5 7l3.5 4" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 3L9 7l-3.5 4" />
    </svg>
  );
}

function IconZoomIn() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4.25" />
      <path d="M9.2 9.2L12 12M6 4v4M4 6h4" />
    </svg>
  );
}

function IconZoomOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4.25" />
      <path d="M9.2 9.2L12 12M4 6h4" />
    </svg>
  );
}

interface TimelineToolbarProps {
  periodLabel: string;
  subtitle?: string;
  activePreset: TimelineZoomPreset | null;
  onPreset: (preset: TimelineZoomPreset) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function TimelineToolbar({
  periodLabel,
  subtitle,
  activePreset,
  onPreset,
  onZoomIn,
  onZoomOut,
  onPrev,
  onNext,
  onToday,
}: TimelineToolbarProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{periodLabel}</h2>
        {subtitle && <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="glass-solid flex rounded-xl border border-[var(--border-strong)] p-0.5" role="group" aria-label={t("timeline.zoomPreset")}>
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onPreset(preset.value)}
              aria-pressed={activePreset === preset.value}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePreset === preset.value
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  : "text-[var(--muted)] hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {t(preset.labelKey)}
            </button>
          ))}
        </div>

        <div className="glass-solid flex items-center rounded-xl border border-[var(--border-strong)] p-0.5">
          <Button variant="ghost" size="icon" onClick={onZoomOut} title={t("mindmap.zoomOut")}>
            <IconZoomOut />
          </Button>
          <Button variant="ghost" size="icon" onClick={onZoomIn} title={t("mindmap.zoomIn")}>
            <IconZoomIn />
          </Button>
        </div>

        <div className="glass-solid flex items-center rounded-xl border border-[var(--border-strong)] p-0.5">
          <Button variant="ghost" size="icon" onClick={onPrev} title={t("timeline.prevPeriod")}>
            <IconChevronLeft />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToday}>
            {t("common.today")}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext} title={t("timeline.nextPeriod")}>
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
