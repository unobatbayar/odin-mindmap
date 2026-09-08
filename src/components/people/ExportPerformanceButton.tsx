"use client";

import { useEffect, useRef, useState } from "react";
import { headerDropdownTriggerClass } from "@/components/layout/AppHeader";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  exportPerformancePdf,
  type ExportLocale,
} from "@/lib/people/exportPdf";
import type { MemberPerformance } from "@/types/people";

interface ExportPerformanceButtonProps {
  stats: MemberPerformance;
  projectName?: string | null;
}

export function ExportPerformanceButton({
  stats,
  projectName,
}: ExportPerformanceButtonProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const runExport = async (exportLocale: ExportLocale) => {
    if (exporting) return;
    setError(null);
    setExporting(true);
    try {
      await exportPerformancePdf(stats, exportLocale, { projectName });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.exportFailed"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={exporting}
        onClick={() => setOpen((v) => !v)}
        className={`${headerDropdownTriggerClass} disabled:opacity-50`}
        aria-haspopup="true"
        aria-expanded={open}
        title={t("export.performanceTitle")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-[var(--muted)]"
          aria-hidden
        >
          <path d="M3.5 9.5v2h7v-2M7 1.5v7M4.5 6.5L7 9l2.5-2.5" />
        </svg>
        <span>{exporting ? t("common.exporting") : t("common.export")}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`shrink-0 text-[var(--muted)] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-[180px] overflow-hidden rounded-xl border border-[var(--border-strong)] glass-solid p-1 shadow-surface-lg">
          <p className="px-2.5 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--muted)]">
            {t("export.pdfLanguage")}
          </p>
          {(
            [
              { locale: "en" as const, label: t("export.english") },
              { locale: "mn" as const, label: t("export.mongolian") },
            ] as const
          ).map((opt) => (
            <button
              key={opt.locale}
              type="button"
              disabled={exporting}
              onClick={() => runExport(opt.locale)}
              className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:!bg-black/[0.04] disabled:opacity-50 dark:hover:!bg-white/[0.06] ${
                opt.locale === locale
                  ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
                  : "text-zinc-700 dark:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {error && (
            <p className="px-2.5 pb-2 pt-1 text-[0.6875rem] leading-snug text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
