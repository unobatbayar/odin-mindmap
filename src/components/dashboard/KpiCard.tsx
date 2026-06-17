interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "default" | "success" | "warning" | "danger";
}

const accentClasses = {
  default: "text-zinc-900 dark:text-zinc-100",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

export function KpiCard({ label, value, sublabel, accent = "default" }: KpiCardProps) {
  return (
    <div className="glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${accentClasses[accent]}`}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-[var(--muted)]">{sublabel}</p>
      )}
    </div>
  );
}
