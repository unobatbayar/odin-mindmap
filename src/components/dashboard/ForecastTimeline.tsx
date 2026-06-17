import { formatDate } from "@/lib/dashboard/api";
import type {
  DashboardForecast,
  DashboardMilestoneForecast,
} from "@/types/dashboard";

interface WeeklyPoint {
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
  past: SeriesPoint[];
  today: SeriesPoint;
  projected: SeriesPoint[];
  eta: SeriesPoint | null;
  milestoneMs: number | null;
  yMax: number;
  xMin: number;
  xMax: number;
}

const WEEK_MS = 7 * 86_400_000;
const CHART = { w: 560, h: 200, padL: 36, padR: 16, padT: 12, padB: 32 };

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
): string | null {
  if (confidence === "low") return "Low confidence";
  if (confidence === "none") return "Insufficient data";
  return null;
}

function describeForecast(
  forecast: DashboardForecast,
  milestoneForecast?: DashboardMilestoneForecast | null,
): string {
  if (forecast.remaining <= 0) {
    return "All open and in-progress tasks are complete — the backlog is clear.";
  }
  if (!forecast.estimatedCompletion || !forecast.velocityPerWeek) {
    const n = forecast.remaining;
    return `There ${n === 1 ? "is" : "are"} ${n} task${n === 1 ? "" : "s"} still open or in progress, but there hasn't been enough recent completion activity to project a finish date. Close a few more tasks over the coming weeks to unlock a timeline estimate.`;
  }

  const date = formatDate(forecast.estimatedCompletion);
  const weeks = forecast.weeksRemaining;
  let text = `At your current pace of ~${forecast.velocityPerWeek} tasks per week (averaged over the last ${forecast.velocityWindowWeeks} weeks), the ${forecast.remaining} remaining task${forecast.remaining === 1 ? "" : "s"} should be cleared by ${date}`;
  if (weeks != null && weeks > 0) {
    text += ` — about ${weeks} week${weeks === 1 ? "" : "s"} from today`;
  }
  text += ".";

  if (milestoneForecast?.status === "at_risk") {
    text += ` The next milestone (“${milestoneForecast.milestoneName}”) is due before this estimate, so the project may be at risk.`;
  } else if (milestoneForecast?.status === "on_track") {
    text += ` This pace keeps you on track for the next milestone (“${milestoneForecast.milestoneName}”).`;
  }

  return text;
}

function buildBurndownData(
  forecast: DashboardForecast,
  weeklyCompleted: WeeklyPoint[],
  milestoneForecast?: DashboardMilestoneForecast | null,
): BurndownData {
  const now = Date.now();
  const remaining = forecast.remaining;
  const counts = weeklyCompleted.map((w) => w.count);

  const weekStarts: number[] = [];
  for (let i = weeklyCompleted.length - 1; i >= 0; i--) {
    weekStarts.push(startOfWeek(now - i * WEEK_MS));
  }

  // Reconstruct past remaining by walking backward from today using weekly completions.
  const historical: SeriesPoint[] = [];
  let backfill = remaining;
  for (let i = weekStarts.length - 1; i >= 0; i--) {
    backfill += counts[i] ?? 0;
    historical.unshift({
      dateMs: weekStarts[i],
      remaining: backfill,
      label: weeklyCompleted[i]?.weekLabel ?? "",
    });
  }

  const today: SeriesPoint = { dateMs: now, remaining, label: "Today" };
  const past = [...historical, today];

  const projected: SeriesPoint[] = [today];
  const velocity = forecast.velocityPerWeek;

  if (velocity && velocity > 0 && remaining > 0) {
    let r = remaining;
    let t = now;
    const maxFutureWeeks = 16;
    for (let w = 0; w < maxFutureWeeks && r > 0; w++) {
      t += WEEK_MS;
      r = Math.max(r - velocity, 0);
      projected.push({
        dateMs: t,
        remaining: Math.round(r * 10) / 10,
        label: formatDate(new Date(t).toISOString()),
      });
      if (r <= 0) break;
    }
  }

  const etaMs = forecast.estimatedCompletion
    ? new Date(forecast.estimatedCompletion).getTime()
    : null;
  const eta: SeriesPoint | null =
    etaMs && remaining > 0
      ? { dateMs: etaMs, remaining: 0, label: formatDate(forecast.estimatedCompletion!) }
      : remaining <= 0
        ? { dateMs: now, remaining: 0, label: "Done" }
        : null;

  const milestoneMs = milestoneForecast?.dueDate
    ? Number(milestoneForecast.dueDate)
    : null;

  const allRemaining = [
    ...past.map((p) => p.remaining),
    ...projected.map((p) => p.remaining),
    eta?.remaining ?? 0,
  ];
  const yMax = Math.max(...allRemaining, 1) * 1.15;

  const xCandidates = [
    ...past.map((p) => p.dateMs),
    now,
    ...projected.map((p) => p.dateMs),
    etaMs ?? 0,
    milestoneMs ?? 0,
  ].filter((n) => n > 0);

  const xMin = Math.min(...xCandidates) - WEEK_MS * 0.3;
  const xMax = Math.max(...xCandidates) + WEEK_MS * 0.3;

  return {
    past,
    today,
    projected: projected.length > 1 ? projected : [today],
    eta,
    milestoneMs: milestoneMs && Number.isFinite(milestoneMs) ? milestoneMs : null,
    yMax,
    xMin,
    xMax,
  };
}

function toSvg(
  dateMs: number,
  remaining: number,
  data: BurndownData,
): { x: number; y: number } {
  const plotW = CHART.w - CHART.padL - CHART.padR;
  const plotH = CHART.h - CHART.padT - CHART.padB;
  const x =
    CHART.padL + ((dateMs - data.xMin) / (data.xMax - data.xMin)) * plotW;
  const y =
    CHART.padT + (1 - remaining / data.yMax) * plotH;
  return { x, y };
}

function polylinePoints(points: SeriesPoint[], data: BurndownData): string {
  return points.map((p) => {
    const { x, y } = toSvg(p.dateMs, p.remaining, data);
    return `${x},${y}`;
  }).join(" ");
}

function BurndownChart({
  data,
  forecast,
  milestoneForecast,
}: {
  data: BurndownData;
  forecast: DashboardForecast;
  milestoneForecast?: DashboardMilestoneForecast | null;
}) {
  const plotW = CHART.w - CHART.padL - CHART.padR;
  const plotH = CHART.h - CHART.padT - CHART.padB;
  const yBase = CHART.padT + plotH;

  const yTicks = Array.from(
    { length: Math.min(Math.ceil(data.yMax) + 1, 6) },
    (_, i) => i,
  ).filter((v) => v <= data.yMax);

  const xLabelPoints = [
    ...(data.past.length > 0 ? [data.past[0]] : []),
    data.today,
    ...(data.eta ? [data.eta] : []),
  ].filter(
    (p, i, arr) => arr.findIndex((q) => q.dateMs === p.dateMs) === i,
  );

  const pastLine = data.past;
  const hasProjection =
    forecast.velocityPerWeek != null &&
    forecast.velocityPerWeek > 0 &&
    data.projected.length > 1;

  const todaySvg = toSvg(data.today.dateMs, data.today.remaining, data);
  const milestoneX =
    data.milestoneMs != null
      ? toSvg(data.milestoneMs, 0, data).x
      : null;

  const idealLine =
    data.milestoneMs != null &&
    data.past.length > 0 &&
    milestoneForecast?.dueDate
      ? (() => {
          const start = data.past[0];
          const startPt = toSvg(start.dateMs, start.remaining, data);
          const endPt = toSvg(data.milestoneMs!, 0, data);
          return { x1: startPt.x, y1: startPt.y, x2: endPt.x, y2: endPt.y };
        })()
      : null;

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--panel-solid)]/40 p-3 sm:p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        Remaining tasks over time
      </p>
      <svg
        viewBox={`0 0 ${CHART.w} ${CHART.h}`}
        className="w-full"
        role="img"
        aria-label="Burndown chart showing remaining tasks over time with projected completion"
      >
        <defs>
          <linearGradient id="burndown-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {yTicks.map((tick) => {
          const y = CHART.padT + (1 - tick / data.yMax) * plotH;
          return (
            <g key={tick}>
              <line
                x1={CHART.padL}
                y1={y}
                x2={CHART.padL + plotW}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={CHART.padL - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-[var(--muted)] text-[9px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Ideal pace to milestone */}
        {idealLine && (
          <line
            x1={idealLine.x1}
            y1={idealLine.y1}
            x2={idealLine.x2}
            y2={idealLine.y2}
            stroke="#a1a1aa"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.7"
          />
        )}

        {/* Milestone deadline */}
        {milestoneX != null && (
          <>
            <line
              x1={milestoneX}
              y1={CHART.padT}
              x2={milestoneX}
              y2={yBase}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text
              x={milestoneX}
              y={CHART.padT - 2}
              textAnchor="middle"
              className="fill-amber-600 text-[8px] font-semibold dark:fill-amber-400"
            >
              Deadline
            </text>
          </>
        )}

        {/* Past area fill + line */}
        {pastLine.length > 1 && (
          <>
            <polygon
              points={`${polylinePoints(pastLine, data)} ${toSvg(data.today.dateMs, 0, data).x},${yBase} ${toSvg(pastLine[0].dateMs, 0, data).x},${yBase}`}
              fill="url(#burndown-fill)"
            />
            <polyline
              points={polylinePoints(pastLine, data)}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Projected line */}
        {hasProjection && (
          <polyline
            points={polylinePoints(data.projected, data)}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Today dot */}
        <circle
          cx={todaySvg.x}
          cy={todaySvg.y}
          r="4.5"
          fill="#6366f1"
          stroke="var(--panel-solid)"
          strokeWidth="2"
        />

        {/* ETA dot at y=0 */}
        {data.eta && (
          <>
            <circle
              cx={toSvg(data.eta.dateMs, 0, data).x}
              cy={toSvg(data.eta.dateMs, 0, data).y}
              r="4.5"
              fill="#a855f7"
              stroke="var(--panel-solid)"
              strokeWidth="2"
            />
            <text
              x={toSvg(data.eta.dateMs, 0, data).x}
              y={yBase + 14}
              textAnchor="middle"
              className="fill-violet-600 text-[8px] font-semibold dark:fill-violet-400"
            >
              Est. clear
            </text>
          </>
        )}

        {/* X-axis baseline */}
        <line
          x1={CHART.padL}
          y1={yBase}
          x2={CHART.padL + plotW}
          y2={yBase}
          stroke="var(--border-strong)"
          strokeWidth="1"
        />

        {/* X-axis date labels */}
        {xLabelPoints.map((p) => {
          const { x } = toSvg(p.dateMs, 0, data);
          return (
            <text
              key={p.dateMs}
              x={x}
              y={CHART.h - 8}
              textAnchor="middle"
              className="fill-[var(--muted)] text-[8px]"
            >
              {p.label === "Today" ? "Today" : p.label}
            </text>
          );
        })}

        {/* Y-axis label */}
        <text
          x={10}
          y={CHART.padT + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 10 ${CHART.padT + plotH / 2})`}
          className="fill-[var(--muted)] text-[9px] font-medium"
        >
          Tasks left
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-indigo-500" />
          Actual remaining
        </span>
        {hasProjection && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded border-t-2 border-dashed border-violet-500" />
            Projected
          </span>
        )}
        {idealLine && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded border-t border-dashed border-zinc-400" />
            Ideal pace to deadline
          </span>
        )}
        {data.milestoneMs != null && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-0.5 bg-amber-500" />
            Milestone deadline
          </span>
        )}
      </div>
    </div>
  );
}

export function ForecastTimeline({
  forecast,
  weeklyCompleted,
  milestoneForecast,
}: ForecastTimelineProps) {
  const badge = confidenceLabel(forecast.confidence);
  const description = describeForecast(forecast, milestoneForecast);
  const chartData = buildBurndownData(
    forecast,
    weeklyCompleted,
    milestoneForecast,
  );

  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            Backlog forecast
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        {badge && (
          <span className="shrink-0 rounded-lg border border-[var(--border-strong)] bg-[var(--panel-solid)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
            {badge}
          </span>
        )}
      </div>

      <BurndownChart
        data={chartData}
        forecast={forecast}
        milestoneForecast={milestoneForecast}
      />

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-4">
        <Stat label="Remaining" value={String(forecast.remaining)} />
        <Stat
          label="Velocity"
          value={
            forecast.velocityPerWeek != null
              ? `~${forecast.velocityPerWeek}/wk`
              : "—"
          }
        />
        <Stat
          label="Weeks left"
          value={
            forecast.weeksRemaining != null && forecast.weeksRemaining > 0
              ? `~${forecast.weeksRemaining}`
              : forecast.remaining <= 0
                ? "0"
                : "—"
          }
        />
        <Stat
          label="Est. finish"
          value={
            forecast.estimatedCompletion && forecast.remaining > 0
              ? formatDate(forecast.estimatedCompletion)
              : forecast.remaining <= 0
                ? "Done"
                : "—"
          }
        />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
