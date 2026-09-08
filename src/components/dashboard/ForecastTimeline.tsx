"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import type { TranslateFn } from "@/lib/i18n/format";
import type {
  DashboardForecast,
  DashboardMilestoneForecast,
} from "@/types/dashboard";

interface WeeklyPoint {
  weekStartMs: number;
  weekLabel: string;
  count: number;
}

interface ForecastTimelineProps {
  forecast: DashboardForecast;
  weeklyCompleted: WeeklyPoint[];
  milestoneForecast?: DashboardMilestoneForecast | null;
}

interface SeriesPoint {
  dateMs: number;
  remaining: number;
  label: string;
}

interface BurndownData {
  history: SeriesPoint[];
  today: SeriesPoint;
  goal: SeriesPoint | null;
}

const WEEK_MS = 7 * 86_400_000;

function startOfWeek(ts: number): number {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d.getTime();
}

function confidenceLabel(
  confidence: DashboardForecast["confidence"],
  t: TranslateFn,
): string | null {
  if (confidence === "low") return t("forecast.lowConfidence");
  if (confidence === "none") return t("forecast.insufficient");
  return null;
}

function describeForecast(
  forecast: DashboardForecast,
  formatDate: (isoOrMs: string | number) => string,
  t: TranslateFn,
  milestoneForecast?: DashboardMilestoneForecast | null,
): string {
  if (forecast.remaining <= 0) {
    return t("forecast.backlogClear");
  }
  if (!forecast.estimatedCompletion || !forecast.velocityPerWeek) {
    return t(forecast.remaining === 1 ? "forecast.notEnoughOne" : "forecast.notEnough", {
      count: forecast.remaining,
    });
  }

  const date = formatDate(forecast.estimatedCompletion);
  let text = t("forecast.pace", {
    velocity: forecast.velocityPerWeek,
    date,
  });
  if (forecast.weeksRemaining != null && forecast.weeksRemaining > 0) {
    text += ` ${t("forecast.weeksShort", { count: forecast.weeksRemaining })}`;
  }

  if (milestoneForecast?.status === "at_risk") {
    text += ` · ${t("forecast.milestoneAtRisk")}`;
  } else if (milestoneForecast?.status === "on_track") {
    text += ` · ${t("forecast.onTrackMilestone")}`;
  }

  return text;
}

function buildBurndownData(
  forecast: DashboardForecast,
  weeklyCompleted: WeeklyPoint[],
  formatWeekLabel: (ts: number) => string,
  formatDate: (isoOrMs: string | number) => string,
  t: TranslateFn,
): BurndownData {
  const now = Date.now();
  const remaining = forecast.remaining;
  const counts = weeklyCompleted.map((w) => w.count);

  const weekStarts: number[] = [];
  for (let i = weeklyCompleted.length - 1; i >= 0; i--) {
    weekStarts.push(
      weeklyCompleted[weeklyCompleted.length - 1 - i]?.weekStartMs ??
        startOfWeek(now - i * WEEK_MS),
    );
  }

  const history: SeriesPoint[] = [];
  let backfill = remaining;
  for (let i = weekStarts.length - 1; i >= 0; i--) {
    backfill += counts[i] ?? 0;
    const weekStart = weeklyCompleted[i]?.weekStartMs ?? weekStarts[i];
    history.unshift({
      dateMs: weekStarts[i],
      remaining: backfill,
      label: formatWeekLabel(weekStart),
    });
  }

  const today: SeriesPoint = { dateMs: now, remaining, label: t("common.now") };

  const goal: SeriesPoint | null =
    forecast.estimatedCompletion && remaining > 0
      ? {
          dateMs: new Date(forecast.estimatedCompletion).getTime(),
          remaining: 0,
          label: formatDate(forecast.estimatedCompletion),
        }
      : remaining <= 0
        ? { dateMs: now, remaining: 0, label: t("common.done") }
        : null;

  return { history, today, goal };
}

function RemainingBars({ data }: { data: BurndownData }) {
  const { t } = useI18n();
  const bars: { point: SeriesPoint; kind: "history" | "today" | "goal" }[] = [
    ...data.history.map((point) => ({ point, kind: "history" as const })),
    { point: data.today, kind: "today" },
    ...(data.goal ? [{ point: data.goal, kind: "goal" as const }] : []),
  ];

  const max = Math.max(...bars.map((b) => b.point.remaining), 1);

  if (bars.length < 2) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] px-3 py-4 text-center text-xs text-[var(--muted)]">
        {t("forecast.insufficient")}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--border-strong)] glass-inset p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t("forecast.overTime")}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-gradient-to-t from-[var(--accent)] to-[var(--accent-end)]" />
            {t("forecast.past")}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm ring-2 ring-[var(--accent)] bg-[var(--accent-end)]" />
            {t("common.now")}
          </span>
          {data.goal && (
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm border border-dashed border-sky-400 bg-sky-400/30" />
              {t("forecast.goal")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-end gap-1.5 sm:gap-2">
        {bars.map(({ point, kind }) => {
          const pct = Math.max((point.remaining / max) * 100, point.remaining > 0 ? 10 : 4);
          const isGoal = kind === "goal";
          const isToday = kind === "today";

          return (
            <div
              key={`${kind}-${point.dateMs}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                {point.remaining}
              </span>
              <div className="flex h-20 w-full items-end sm:h-24">
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isGoal
                      ? "border border-dashed border-sky-400 bg-sky-400/25"
                      : isToday
                        ? "bg-gradient-to-t from-[var(--accent)] to-[var(--accent-end)] ring-2 ring-[var(--accent)]/60 ring-offset-1 ring-offset-[var(--panel-solid)]"
                        : "bg-gradient-to-t from-[var(--accent)] to-[var(--accent-end)]"
                  }`}
                  style={{
                    height: `${pct}%`,
                    minHeight: point.remaining > 0 ? "0.5rem" : "4px",
                  }}
                  title={t("forecast.barTitle", {
                    label: point.label,
                    count: point.remaining,
                  })}
                />
              </div>
              <span
                className={`w-full truncate text-center text-[9px] font-medium sm:text-[10px] ${
                  isToday
                    ? "font-semibold text-[var(--accent-foreground)]"
                    : isGoal
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-[var(--muted)]"
                }`}
              >
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ForecastTimeline({
  forecast,
  weeklyCompleted,
  milestoneForecast,
}: ForecastTimelineProps) {
  const { t, formatDate, formatWeekLabel } = useI18n();
  const badge = confidenceLabel(forecast.confidence, t);
  const description = describeForecast(forecast, formatDate, t, milestoneForecast);
  const chartData = buildBurndownData(
    forecast,
    weeklyCompleted,
    formatWeekLabel,
    formatDate,
    t,
  );

  const finishLabel =
    forecast.estimatedCompletion && forecast.remaining > 0
      ? formatDate(forecast.estimatedCompletion)
      : forecast.remaining <= 0
        ? t("common.done")
        : t("common.emDash");

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            {t("forecast.title")}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{description}</p>
        </div>
        {badge && (
          <span className="shrink-0 rounded-md border border-[var(--border-strong)] bg-[var(--panel-solid)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MetricPill label={t("forecast.remaining")} value={String(forecast.remaining)} />
        <MetricPill
          label={t("forecast.velocity")}
          value={
            forecast.velocityPerWeek != null
              ? t("forecast.velocityValue", { value: forecast.velocityPerWeek })
              : t("common.emDash")
          }
        />
        <MetricPill
          label={t("forecast.weeksLeft")}
          value={
            forecast.weeksRemaining != null && forecast.weeksRemaining > 0
              ? `~${forecast.weeksRemaining}`
              : forecast.remaining <= 0
                ? "0"
                : t("common.emDash")
          }
        />
        <MetricPill label={t("forecast.estFinish")} value={finishLabel} />
      </div>

      <RemainingBars data={chartData} />
    </section>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-inset rounded-xl border border-[var(--border)] px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
