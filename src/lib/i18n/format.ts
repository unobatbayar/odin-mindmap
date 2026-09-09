import { APP_TIMEZONE } from "@/lib/datetime";
import { interpolate } from "./interpolate";
import { bcp47, type Locale } from "./locale";
import { messages, type MessageKey } from "./messages";

export type TranslateFn = (
  key: MessageKey,
  params?: Record<string, string | number>,
) => string;

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  return interpolate(messages[locale][key], params);
}

function parseDate(isoOrMs: string | number): Date | null {
  const ms = typeof isoOrMs === "number" ? isoOrMs : Number(isoOrMs);
  const d =
    Number.isFinite(ms) && (typeof isoOrMs === "number" || ms > 1e10)
      ? new Date(ms)
      : new Date(String(isoOrMs));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(isoOrMs: string | number, locale: Locale): string {
  const d = parseDate(isoOrMs);
  if (!d) return "-";
  return d.toLocaleDateString(bcp47(locale), {
    timeZone: APP_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatWeekLabel(ts: number, locale: Locale): string {
  return new Date(ts).toLocaleDateString(bcp47(locale), {
    timeZone: APP_TIMEZONE,
    month: "short",
    day: "numeric",
  });
}

export function formatDayHeading(ts: number, locale: Locale): string {
  return new Date(ts).toLocaleDateString(bcp47(locale), {
    timeZone: APP_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(
  isoOrMs: string,
  locale: Locale,
  t: TranslateFn,
): string {
  const ms = Number(isoOrMs);
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return t("date.justNow");
  if (mins < 60) return t("date.minutesAgo", { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("date.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  if (days < 14) return t("date.daysAgo", { count: days });
  const weeks = Math.floor(days / 7);
  return t("date.weeksAgo", { count: weeks });
}

function parseIsoDate(value: string): Date | null {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRangeLabel(
  from: string,
  to: string,
  locale: Locale,
  t: TranslateFn,
): string {
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);
  if (!fromDate || !toDate) return t("date.customRange");
  const sameYear = fromDate.getFullYear() === toDate.getFullYear();
  const loc = bcp47(locale);
  const fromLabel = fromDate.toLocaleDateString(loc, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const toLabel = toDate.toLocaleDateString(loc, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${fromLabel} – ${toLabel}`;
}
