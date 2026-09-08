"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ALL_TIME_RANGE,
  thisMonthRange,
  type DateRangePreset,
  type DateRangeSelection,
} from "@/components/dashboard/DateRangeDropdown";
import { performanceQuery } from "@/lib/people/api";

const PRESETS: DateRangePreset[] = [
  "all",
  "30d",
  "month",
  "quarter",
  "year",
  "custom",
];

function parsePreset(raw: string | null): DateRangePreset {
  if (raw && PRESETS.includes(raw as DateRangePreset)) {
    return raw as DateRangePreset;
  }
  return "custom";
}

export function usePerformanceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didDefaultRef = useRef(false);

  const listId = searchParams.get("listId");
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const rangeParam = searchParams.get("range");

  const replace = useCallback(
    (next: {
      listId: string | null;
      from: string;
      to: string;
      range: DateRangePreset | null;
    }) => {
      const q = performanceQuery(next);
      const s = q.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  // Default to this month when the URL has no period yet.
  // Explicit "all" is preserved via range=all.
  useEffect(() => {
    if (didDefaultRef.current) return;
    const hasDates = Boolean(fromParam && toParam);
    const isExplicitAll = rangeParam === "all";
    if (hasDates || isExplicitAll) {
      didDefaultRef.current = true;
      return;
    }
    didDefaultRef.current = true;
    const month = thisMonthRange();
    replace({
      listId,
      from: month.from,
      to: month.to,
      range: "month",
    });
  }, [fromParam, toParam, rangeParam, listId, replace]);

  const dateRange: DateRangeSelection = useMemo(() => {
    if (!fromParam && !toParam) {
      if (rangeParam === "all") return ALL_TIME_RANGE;
      return thisMonthRange();
    }
    const preset = rangeParam ? parsePreset(rangeParam) : "custom";
    return {
      preset: preset === "all" ? "custom" : preset,
      from: fromParam,
      to: toParam,
    };
  }, [fromParam, toParam, rangeParam]);

  // Effective dates always drive API fetches (never empty unless all-time).
  const from = dateRange.from;
  const to = dateRange.to;

  const query = useMemo(
    () =>
      performanceQuery({
        listId,
        from,
        to,
        range: dateRange.preset,
      }),
    [listId, from, to, dateRange.preset],
  );

  const setListId = useCallback(
    (id: string | null) =>
      replace({
        listId: id,
        from,
        to,
        range: dateRange.preset,
      }),
    [replace, from, to, dateRange.preset],
  );

  const setDateRange = useCallback(
    (sel: DateRangeSelection) =>
      replace({
        listId,
        from: sel.from,
        to: sel.to,
        range: sel.preset === "custom" ? null : sel.preset,
      }),
    [replace, listId],
  );

  return { listId, from, to, dateRange, query, setListId, setDateRange };
}
