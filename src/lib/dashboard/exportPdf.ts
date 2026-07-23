import type { DashboardStats } from "@/types/dashboard";

export type ExportLocale = "en" | "mn";

function formatRangeLabel(from: string, to: string): string {
  const parse = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const fromDate = parse(from);
  const toDate = parse(to);
  if (!fromDate || !toDate) return `${from} – ${to}`;
  const sameYear = fromDate.getFullYear() === toDate.getFullYear();
  const fromLabel = fromDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const toLabel = toDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${fromLabel} – ${toLabel}`;
}

type Copy = {
  title: string;
  subtitle: string;
  period: string;
  allTime: string;
  project: string;
  allProjects: string;
  generated: string;
  overview: string;
  totalTasks: string;
  open: string;
  inProgress: string;
  closed: string;
  completionRate: string;
  overdue: string;
  dueThisWeek: string;
  collaborators: string;
  collabTasks: string;
  forecast: string;
  remaining: string;
  velocity: string;
  eta: string;
  confidence: string;
  perWeek: string;
  none: string;
  high: string;
  low: string;
  teamWorkload: string;
  member: string;
  done: string;
  notDone: string;
  milestones: string;
  status: string;
  due: string;
  goals: string;
  progress: string;
  recentCompleted: string;
  task: string;
  list: string;
  footer: string;
  printHint: string;
};

const COPY: Record<ExportLocale, Copy> = {
  en: {
    title: "Dashboard Report",
    subtitle: "Odin Mindmap",
    period: "Period",
    allTime: "All time",
    project: "Project",
    allProjects: "All projects",
    generated: "Generated",
    overview: "Overview",
    totalTasks: "Total tasks",
    open: "Open",
    inProgress: "In progress",
    closed: "Completed",
    completionRate: "Completion rate",
    overdue: "Overdue",
    dueThisWeek: "Due this week",
    collaborators: "Active collaborators",
    collabTasks: "Collaborative tasks",
    forecast: "Forecast",
    remaining: "Remaining",
    velocity: "Velocity",
    eta: "Estimated completion",
    confidence: "Confidence",
    perWeek: "/ week",
    none: "None",
    high: "High",
    low: "Low",
    teamWorkload: "Team workload",
    member: "Member",
    done: "Done",
    notDone: "Not done",
    milestones: "Milestones",
    status: "Status",
    due: "Due",
    goals: "Goals",
    progress: "Progress",
    recentCompleted: "Recently completed",
    task: "Task",
    list: "List",
    footer: "Confidential — generated from Odin Mindmap",
    printHint: "Use your browser’s print dialog and choose “Save as PDF”.",
  },
  mn: {
    title: "Хяналтын самбарын тайлан",
    subtitle: "Odin Mindmap",
    period: "Хугацаа",
    allTime: "Бүх хугацаа",
    project: "Төсөл",
    allProjects: "Бүх төсөл",
    generated: "Үүсгэсэн",
    overview: "Ерөнхий үзүүлэлт",
    totalTasks: "Нийт даалгавар",
    open: "Нээлттэй",
    inProgress: "Хийгдэж буй",
    closed: "Дууссан",
    completionRate: "Гүйцэтгэлийн хувь",
    overdue: "Хугацаа хэтэрсэн",
    dueThisWeek: "Энэ долоо хоногт",
    collaborators: "Идэвхтэй гишүүд",
    collabTasks: "Хамтарсан даалгавар",
    forecast: "Таамаглал",
    remaining: "Үлдсэн",
    velocity: "Хурд",
    eta: "Дуусах төлөвлөгөөт огноо",
    confidence: "Итгэлцүүр",
    perWeek: "/ долоо хоног",
    none: "Байхгүй",
    high: "Өндөр",
    low: "Бага",
    teamWorkload: "Багийн ачаалал",
    member: "Гишүүн",
    done: "Дууссан",
    notDone: "Үлдсэн",
    milestones: "Үе шатууд",
    status: "Төлөв",
    due: "Дуусах огноо",
    goals: "Зорилтууд",
    progress: "Явц",
    recentCompleted: "Саяхан дууссан",
    task: "Даалгавар",
    list: "Жагсаалт",
    footer: "Нууцлалтай — Odin Mindmap-аас үүсгэсэн",
    printHint: "Хэвлэх цонхноос “PDF болгон хадгалах”-ыг сонгоно уу.",
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(isoOrMs: string | null | undefined, locale: ExportLocale): string {
  if (!isoOrMs) return "—";
  const ms = Number(isoOrMs);
  const d =
    Number.isFinite(ms) && ms > 1e10
      ? new Date(ms)
      : new Date(isoOrMs.includes("T") ? isoOrMs : `${isoOrMs}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function confidenceLabel(
  confidence: DashboardStats["forecast"]["confidence"],
  t: Copy,
): string {
  if (confidence === "high") return t.high;
  if (confidence === "low") return t.low;
  return t.none;
}

function buildReportHtml(
  stats: DashboardStats,
  locale: ExportLocale,
  options?: { projectName?: string | null },
): string {
  const t = COPY[locale];
  const period =
    stats.from && stats.to ? formatRangeLabel(stats.from, stats.to) : t.allTime;
  const project = options?.projectName ?? t.allProjects;
  const { totals, forecast, teamWorkload, milestones, goals, recentActivity } =
    stats;

  const kpiRows = [
    [t.totalTasks, String(totals.total)],
    [t.open, String(totals.open)],
    [t.inProgress, String(totals.inProgress)],
    [t.closed, String(totals.closed)],
    [t.completionRate, `${totals.completionRate}%`],
    [t.overdue, String(totals.overdue)],
    [t.dueThisWeek, String(totals.dueThisWeek)],
    [t.collaborators, String(totals.activeCollaborators)],
    [t.collabTasks, String(totals.collabTasks)],
  ]
    .map(
      ([label, value]) =>
        `<div class="kpi"><div class="kpi-label">${escapeHtml(label)}</div><div class="kpi-value">${escapeHtml(value)}</div></div>`,
    )
    .join("");

  const workloadRows = teamWorkload
    .slice(0, 25)
    .map(
      (m) =>
        `<tr><td>${escapeHtml(m.name)}</td><td class="num">${m.done}</td><td class="num">${m.notDone}</td><td class="num">${m.completionPct}%</td></tr>`,
    )
    .join("");

  const milestoneRows = milestones
    .slice(0, 20)
    .map(
      (m) =>
        `<tr><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.status.label)}</td><td>${escapeHtml(formatDate(m.dueDate, locale))}</td></tr>`,
    )
    .join("");

  const goalRows = goals
    .slice(0, 15)
    .map(
      (g) =>
        `<tr><td>${escapeHtml(g.name)}</td><td class="num">${Math.round(g.percentComplete)}%</td></tr>`,
    )
    .join("");

  const completedRows = recentActivity.completed
    .slice(0, 15)
    .map(
      (task) =>
        `<tr><td>${escapeHtml(task.name)}</td><td>${escapeHtml(task.listName ?? "—")}</td></tr>`,
    )
    .join("");

  const eta =
    forecast.estimatedCompletion
      ? formatDate(forecast.estimatedCompletion, locale)
      : "—";
  const velocity =
    forecast.velocityPerWeek != null
      ? `${forecast.velocityPerWeek}${t.perWeek}`
      : "—";

  return `<!DOCTYPE html>
<html lang="${locale === "mn" ? "mn" : "en"}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(t.title)} — ${escapeHtml(period)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 36px 40px 48px;
      font-family: "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", "Noto Sans Mongolian", sans-serif;
      color: #18181b;
      background: #fff;
      font-size: 12px;
      line-height: 1.45;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      border-bottom: 2px solid #312e81;
      padding-bottom: 16px;
      margin-bottom: 22px;
    }
    .brand { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #6366f1; font-weight: 700; }
    h1 { margin: 4px 0 0; font-size: 22px; letter-spacing: -0.02em; }
    .meta { text-align: right; color: #52525b; font-size: 11px; }
    .meta strong { color: #18181b; font-weight: 600; }
    h2 {
      margin: 22px 0 10px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #4338ca;
      border-bottom: 1px solid #e4e4e7;
      padding-bottom: 6px;
    }
    .kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .kpi {
      border: 1px solid #e4e4e7;
      border-radius: 10px;
      padding: 10px 12px;
      background: #fafafa;
    }
    .kpi-label { color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-value { margin-top: 4px; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
    .forecast {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 7px 8px; border-bottom: 1px solid #eee; text-align: left; vertical-align: top; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: #71717a; font-weight: 600; }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
    .hint { margin-top: 8px; color: #a1a1aa; font-size: 10px; }
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #e4e4e7;
      color: #71717a;
      font-size: 10px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    @media print {
      body { padding: 18px 20px; }
      .hint { display: none; }
      .kpi, .header, table { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">${escapeHtml(t.subtitle)}</div>
      <h1>${escapeHtml(t.title)}</h1>
    </div>
    <div class="meta">
      <div><strong>${escapeHtml(t.period)}:</strong> ${escapeHtml(period)}</div>
      <div><strong>${escapeHtml(t.project)}:</strong> ${escapeHtml(project)}</div>
      <div><strong>${escapeHtml(t.generated)}:</strong> ${escapeHtml(formatDate(stats.generatedAt, locale))}</div>
    </div>
  </div>

  <p class="hint">${escapeHtml(t.printHint)}</p>

  <h2>${escapeHtml(t.overview)}</h2>
  <div class="kpis">${kpiRows}</div>

  <h2>${escapeHtml(t.forecast)}</h2>
  <div class="forecast">
    <div class="kpi"><div class="kpi-label">${escapeHtml(t.remaining)}</div><div class="kpi-value">${forecast.remaining}</div></div>
    <div class="kpi"><div class="kpi-label">${escapeHtml(t.velocity)}</div><div class="kpi-value">${escapeHtml(velocity)}</div></div>
    <div class="kpi"><div class="kpi-label">${escapeHtml(t.eta)}</div><div class="kpi-value" style="font-size:14px">${escapeHtml(eta)}</div></div>
    <div class="kpi"><div class="kpi-label">${escapeHtml(t.confidence)}</div><div class="kpi-value" style="font-size:14px">${escapeHtml(confidenceLabel(forecast.confidence, t))}</div></div>
  </div>

  ${
    teamWorkload.length > 0
      ? `<h2>${escapeHtml(t.teamWorkload)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(t.member)}</th><th class="num">${escapeHtml(t.done)}</th><th class="num">${escapeHtml(t.notDone)}</th><th class="num">${escapeHtml(t.progress)}</th></tr></thead>
    <tbody>${workloadRows}</tbody>
  </table>`
      : ""
  }

  ${
    milestones.length > 0
      ? `<h2>${escapeHtml(t.milestones)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(t.task)}</th><th>${escapeHtml(t.status)}</th><th>${escapeHtml(t.due)}</th></tr></thead>
    <tbody>${milestoneRows}</tbody>
  </table>`
      : ""
  }

  ${
    goals.length > 0
      ? `<h2>${escapeHtml(t.goals)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(t.task)}</th><th class="num">${escapeHtml(t.progress)}</th></tr></thead>
    <tbody>${goalRows}</tbody>
  </table>`
      : ""
  }

  ${
    recentActivity.completed.length > 0
      ? `<h2>${escapeHtml(t.recentCompleted)}</h2>
  <table>
    <thead><tr><th>${escapeHtml(t.task)}</th><th>${escapeHtml(t.list)}</th></tr></thead>
    <tbody>${completedRows}</tbody>
  </table>`
      : ""
  }

  <div class="footer">
    <span>${escapeHtml(t.footer)}</span>
    <span>${escapeHtml(period)}</span>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.focus(); window.print(); }, 250);
    });
  </script>
</body>
</html>`;
}

/** Opens a print-ready report window so the user can Save as PDF (Unicode-safe for MN). */
export function exportDashboardPdf(
  stats: DashboardStats,
  locale: ExportLocale,
  options?: { projectName?: string | null },
): void {
  const html = buildReportHtml(stats, locale, options);
  const popup = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
  if (!popup) {
    throw new Error(
      locale === "mn"
        ? "Попап хаагдсан байна. PDF экспортлохын тулд попапыг зөвшөөрнө үү."
        : "Popup blocked. Allow popups to export the PDF.",
    );
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}
