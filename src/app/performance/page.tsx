"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { PeopleGrid } from "@/components/people/PeopleGrid";
import { PerformanceShell } from "@/components/people/PerformanceShell";
import { TabSkeleton } from "@/components/layout/TabSkeleton";
import { usePerformanceFilters } from "@/hooks/usePerformanceFilters";
import { usePersistedWorkspace } from "@/hooks/usePersistedWorkspace";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { fetchPeopleRoster } from "@/lib/people/api";
import type { DashboardProject } from "@/types/dashboard";
import type { PeopleRoster } from "@/types/people";

function RosterContent({
  teamId,
  listId,
  from,
  to,
  query,
  dateRange,
  onProjectsLoaded,
}: {
  teamId: string;
  listId: string | null;
  from: string;
  to: string;
  query: URLSearchParams;
  dateRange: ReturnType<typeof usePerformanceFilters>["dateRange"];
  onProjectsLoaded: (projects: DashboardProject[]) => void;
}) {
  const { t } = useI18n();
  const [roster, setRoster] = useState<PeopleRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPeopleRoster(teamId, listId, from || null, to || null)
      .then((data) => {
        if (!cancelled) {
          setRoster(data);
          onProjectsLoaded(data.projects);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.loadPeople"));
          setRoster(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, listId, from, to, onProjectsLoaded, t]);

  if (loading) return <TabSkeleton />;
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }
  if (!roster) return null;
  return (
    <PeopleGrid
      roster={roster}
      query={query}
      dateRange={dateRange}
      teamId={teamId}
    />
  );
}

function PerformanceRosterInner() {
  const { workspaces, loading: wsLoading, activeTeamId, setTeamId } =
    usePersistedWorkspace();
  const { listId, from, to, dateRange, query, setListId, setDateRange } =
    usePerformanceFilters();
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const onProjectsLoaded = useCallback((loaded: DashboardProject[]) => {
    setProjects(loaded);
  }, []);

  const handleTeamChange = (id: string) => {
    setTeamId(id);
    setListId(null);
    setProjects([]);
  };

  return (
    <PerformanceShell
      activeTeamId={activeTeamId}
      workspaces={workspaces}
      wsLoading={wsLoading}
      onTeamChange={handleTeamChange}
      projects={projects}
      listId={listId}
      onListIdChange={setListId}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    >
      {activeTeamId ? (
        <RosterContent
          teamId={activeTeamId}
          listId={listId}
          from={from}
          to={to}
          query={query}
          dateRange={dateRange}
          onProjectsLoaded={onProjectsLoaded}
        />
      ) : null}
    </PerformanceShell>
  );
}

export default function PerformancePage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <PerformanceRosterInner />
    </Suspense>
  );
}
