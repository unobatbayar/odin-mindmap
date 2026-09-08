"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  sublabel?: string;
  empty?: boolean;
  tall?: boolean;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  sublabel,
  empty,
  tall,
  children,
}: ChartCardProps) {
  const { t } = useI18n();
  return (
    <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
      <h2 className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      {sublabel ? (
        <p className="mt-0.5 text-[12px] text-[var(--muted)]">{sublabel}</p>
      ) : null}
      <div className={cn("mt-4 w-full", tall ? "h-[280px]" : "h-[220px]")}>
        {empty ? (
          <p className="text-sm text-[var(--muted)]">{t("charts.notEnough")}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
