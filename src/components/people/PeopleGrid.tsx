"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  selectionLabel,
  type DateRangeSelection,
} from "@/components/dashboard/DateRangeDropdown";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { compareNeedsAttention } from "@/lib/people/metrics";
import type { PeopleRoster } from "@/types/people";
import { RosterCard } from "./RosterCard";

type SortKey = "attention" | "name" | "completed" | "completion";

interface PeopleGridProps {
  roster: PeopleRoster;
  query: URLSearchParams;
  dateRange: DateRangeSelection;
  teamId: string;
}

export function PeopleGrid({
  roster,
  query,
  dateRange,
}: PeopleGridProps) {
  const { t, formatRangeLabel } = useI18n();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("attention");

  const projectName = roster.listId
    ? roster.projects.find((p) => p.id === roster.listId)?.name
    : null;

  const period =
    roster.from && roster.to
      ? formatRangeLabel(roster.from, roster.to)
      : selectionLabel(dateRange, t, formatRangeLabel);

  const members = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? roster.members.filter((m) => m.name.toLowerCase().includes(q))
      : roster.members.slice();

    filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "completed") return b.completed - a.completed;
      if (sort === "completion") return b.completionPct - a.completionPct;
      return compareNeedsAttention(a, b);
    });
    return filtered;
  }, [roster.members, search, sort]);

  return (
    <div className="custom-scrollbar space-y-5 overflow-y-auto p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
            {t("performance.title")}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {t("performance.howDelivering")}{" "}
            <span className="font-semibold text-[var(--accent)]">{period}</span>
            {projectName ? (
              <>
                {" · "}
                <span className="font-semibold text-[var(--accent)]">
                  {projectName}
                </span>
              </>
            ) : null}
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common.searchPeople")}
            aria-label={t("common.searchPeople")}
            className="sm:w-56"
          />
          <Select value={sort} onValueChange={(next) => setSort(next as SortKey)}>
            <SelectTrigger className="sm:w-44" aria-label={t("performance.sort")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attention">{t("performance.needsAttention")}</SelectItem>
              <SelectItem value="name">{t("performance.sortName")}</SelectItem>
              <SelectItem value="completed">{t("performance.sortCompleted")}</SelectItem>
              <SelectItem value="completion">{t("performance.sortCompletion")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {members.length === 0 ? (
        <section className="glass-strong rounded-2xl border border-[var(--border)] p-5 shadow-surface">
          <p className="text-sm text-[var(--muted)]">
            {roster.members.length === 0
              ? t("performance.noAssigned")
              : t("performance.noMatch")}
          </p>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <RosterCard key={member.id} member={member} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
