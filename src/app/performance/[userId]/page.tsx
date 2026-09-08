"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PerformanceShell } from "@/components/people/PerformanceShell";
import { PersonPerformance } from "@/components/people/PersonPerformance";
import { TabSkeleton } from "@/components/layout/TabSkeleton";
import { usePerformanceFilters } from "@/hooks/usePerformanceFilters";
import { usePersistedWorkspace } from "@/hooks/usePersistedWorkspace";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { fetchMemberPerformance } from "@/lib/people/api";
import type { DashboardProject } from "@/types/dashboard";
import type { MemberPerformance } from "@/types/people";

function PersonContent({
  teamId,
  userId,
  listId,
  from,
  to,
  query,
  onProjectsLoaded,
}: {
  teamId: string;
  userId: string;
  listId: string | null;
  from: string;
  to: string;
  query: URLSearchParams;
  onProjectsLoaded: (projects: DashboardProject[]) => void;
}) {
  const { t } = useI18n();
  const [stats, setStats] = useState<MemberPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMemberPerformance(teamId, userId, listId, from || null, to || null)
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          onProjectsLoaded(data.projects);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t("error.loadPerformance"),
          );
          setStats(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, userId, listId, from, to, onProjectsLoaded, t]);

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
  if (!stats) return null;
  return <PersonPerformance stats={stats} query={query} />;
}

function PerformancePersonInner() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
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
      {activeTeamId && userId ? (
        <PersonContent
          teamId={activeTeamId}
          userId={userId}
          listId={listId}
          from={from}
          to={to}
          query={query}
          onProjectsLoaded={onProjectsLoaded}
        />
      ) : null}
    </PerformanceShell>
  );
}

export default function PerformancePersonPage() {
  return (
    <Suspense fallback={<TabSkeleton />}>
      <PerformancePersonInner />
    </Suspense>
  );
}
