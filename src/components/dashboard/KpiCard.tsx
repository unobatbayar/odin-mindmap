interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
  active?: boolean;
  interactive?: boolean;
}

const accentClasses = {
  default: "text-zinc-900 dark:text-zinc-100",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

export function KpiCard({
  label,
  value,
  sublabel,
  accent = "default",
  onClick,
  active = false,
  interactive = false,
}: KpiCardProps) {
  const className = [
    "glass-strong rounded-2xl border border-[var(--border)] p-4 shadow-surface text-left w-full",
    interactive
      ? "cursor-pointer transition-all hover:border-[var(--border-strong)] hover:shadow-surface-lg"
      : "",
    active ? "ring-2 ring-indigo-500/40 border-indigo-300/50 dark:border-indigo-500/40" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${accentClasses[accent]}`}>
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-[var(--muted)]">{sublabel}</p>
      )}
      {interactive && (
        <p className="mt-1 text-[10px] font-medium text-[var(--muted)]">
          Click to view tasks
        </p>
      )}
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
