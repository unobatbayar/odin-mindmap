"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatDate as formatDateLocale,
  formatDayHeading as formatDayHeadingLocale,
  formatRangeLabel as formatRangeLabelLocale,
  formatRelativeTime as formatRelativeTimeLocale,
  formatWeekLabel as formatWeekLabelLocale,
  translate,
  type TranslateFn,
} from "@/lib/i18n/format";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  formatDate: (isoOrMs: string | number) => string;
  formatRelativeTime: (isoOrMs: string) => string;
  formatRangeLabel: (from: string, to: string) => string;
  formatWeekLabel: (ts: number) => string;
  formatDayHeading: (ts: number) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "mn" ? "mn" : "en";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, params) => translate(locale, key, params),
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      formatDate: (isoOrMs) => formatDateLocale(isoOrMs, locale),
      formatRelativeTime: (isoOrMs) =>
        formatRelativeTimeLocale(isoOrMs, locale, t),
      formatRangeLabel: (from, to) => formatRangeLabelLocale(from, to, locale, t),
      formatWeekLabel: (ts) => formatWeekLabelLocale(ts, locale),
      formatDayHeading: (ts) => formatDayHeadingLocale(ts, locale),
    }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}

export function priorityMessageKey(
  value: number,
): Extract<
  MessageKey,
  "priority.urgent" | "priority.high" | "priority.normal" | "priority.low"
> | null {
  if (value === 1) return "priority.urgent";
  if (value === 2) return "priority.high";
  if (value === 3) return "priority.normal";
  if (value === 4) return "priority.low";
  return null;
}

export function statusFilterMessageKey(
  value: "all" | "open" | "custom" | "closed",
): Extract<MessageKey, "status.all" | "status.open" | "status.custom" | "status.closed"> {
  if (value === "open") return "status.open";
  if (value === "custom") return "status.custom";
  if (value === "closed") return "status.closed";
  return "status.all";
}
