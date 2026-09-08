import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { enUS, mn } from "date-fns/locale";
import type { LodTier } from "@/types/timelineViewport";
import type { Locale } from "@/lib/i18n/locale";

export interface HeaderMajorTick {
  label: string;
  startMs: number;
  endMs: number;
}

export interface HeaderMinorTick {
  label: string;
  ms: number;
}

export interface HeaderTicks {
  major: HeaderMajorTick[];
  minor: HeaderMinorTick[];
}

const WEEK_OPTS = { weekStartsOn: 1 as const };

function dfnsLocale(locale: Locale) {
  return locale === "mn" ? mn : enUS;
}
// Safety backstop against pathological ranges; normal pxPerDay bounds never
// come close to this many iterations.
const MAX_TICKS = 2000;

function walk(rangeStartMs: number, rangeEndMs: number, alignStart: (d: Date) => Date, step: (d: Date) => Date): Date[] {
  const out: Date[] = [];
  let cursor = alignStart(new Date(rangeStartMs));
  let guard = 0;
  while (cursor.getTime() < rangeEndMs && guard < MAX_TICKS) {
    out.push(cursor);
    cursor = step(cursor);
    guard++;
  }
  return out;
}

function minorTicksFor(
  tier: LodTier,
  rangeStartMs: number,
  rangeEndMs: number,
  locale: Locale,
): HeaderMinorTick[] {
  const loc = { locale: dfnsLocale(locale) };
  switch (tier) {
    case "day":
      return walk(rangeStartMs, rangeEndMs, startOfDay, (d) => addDays(d, 1)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "d") === "1" ? format(d, "MMM d", loc) : format(d, "d"),
      }));
    case "week":
      return walk(rangeStartMs, rangeEndMs, (d) => startOfWeek(d, WEEK_OPTS), (d) => addWeeks(d, 1)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "MMM d", loc),
      }));
    case "biweek":
      return walk(rangeStartMs, rangeEndMs, (d) => startOfWeek(d, WEEK_OPTS), (d) => addWeeks(d, 2)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "MMM d", loc),
      }));
    case "month":
      return walk(rangeStartMs, rangeEndMs, startOfMonth, (d) => addMonths(d, 1)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "MMM", loc),
      }));
    case "quarter":
      return walk(rangeStartMs, rangeEndMs, startOfQuarter, (d) => addQuarters(d, 1)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "QQQ", loc),
      }));
    case "year":
      return walk(rangeStartMs, rangeEndMs, startOfYear, (d) => addYears(d, 1)).map((d) => ({
        ms: d.getTime(),
        label: format(d, "yyyy"),
      }));
  }
}

function majorTicksFor(
  tier: LodTier,
  rangeStartMs: number,
  rangeEndMs: number,
  locale: Locale,
): HeaderMajorTick[] {
  // At the year tier, minor ticks already show the year - a major band
  // would just duplicate the same label, so skip it.
  if (tier === "year") return [];

  const loc = { locale: dfnsLocale(locale) };
  const useYearBands = tier === "month" || tier === "quarter";
  const alignStart = useYearBands ? startOfYear : startOfMonth;
  const step = useYearBands ? (d: Date) => addYears(d, 1) : (d: Date) => addMonths(d, 1);
  const labelFormat = useYearBands ? "yyyy" : "MMMM yyyy";

  const starts = walk(rangeStartMs, rangeEndMs, alignStart, step);
  return starts.map((d, i) => ({
    label: format(d, labelFormat, loc),
    startMs: d.getTime(),
    endMs: (starts[i + 1] ?? step(d)).getTime(),
  }));
}

/**
 * Generates sticky-header tick data for the given LOD tier, over the
 * visible range plus a 50%-of-span overscan on each side so ticks are
 * already in place when the user pans.
 */
export function getHeaderTicks(
  viewStartMs: number,
  viewEndMs: number,
  tier: LodTier,
  locale: Locale = "en",
): HeaderTicks {
  const span = viewEndMs - viewStartMs;
  const overscan = span * 0.5;
  const rangeStartMs = viewStartMs - overscan;
  const rangeEndMs = viewEndMs + overscan;

  return {
    major: majorTicksFor(tier, rangeStartMs, rangeEndMs, locale),
    minor: minorTicksFor(tier, rangeStartMs, rangeEndMs, locale),
  };
}

/**
 * A single human-readable label describing the currently visible window,
 * shaped to the LOD tier (e.g. "Mar 3 – 9, 2026" while zoomed to days,
 * "March 2026" at month zoom, "2024 – 2026" at year zoom) - this is the
 * primary "what period am I viewing" indicator shown in the toolbar.
 */
export function formatPeriodLabel(
  viewStartMs: number,
  viewEndMs: number,
  tier: LodTier,
  locale: Locale = "en",
): string {
  const start = new Date(viewStartMs);
  const end = new Date(viewEndMs);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const loc = { locale: dfnsLocale(locale) };

  switch (tier) {
    case "day":
    case "week":
    case "biweek": {
      if (sameMonth) return `${format(start, "MMM d", loc)} – ${format(end, "d, yyyy", loc)}`;
      if (sameYear) return `${format(start, "MMM d", loc)} – ${format(end, "MMM d, yyyy", loc)}`;
      return `${format(start, "MMM d, yyyy", loc)} – ${format(end, "MMM d, yyyy", loc)}`;
    }
    case "month": {
      if (sameMonth) return format(start, "MMMM yyyy", loc);
      if (sameYear) return `${format(start, "MMM", loc)} – ${format(end, "MMM yyyy", loc)}`;
      return `${format(start, "MMM yyyy", loc)} – ${format(end, "MMM yyyy", loc)}`;
    }
    case "quarter":
      return sameYear ? format(start, "yyyy") : `${format(start, "yyyy")} – ${format(end, "yyyy")}`;
    case "year":
      return `${format(start, "yyyy")} – ${format(end, "yyyy")}`;
  }
}
