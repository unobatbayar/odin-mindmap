"use client";

import { useEffect, useState } from "react";
import {
  AppHeader,
  HeaderContextGroup,
  HeaderControl,
} from "@/components/layout/AppHeader";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
  ALL_TIME_RANGE,
  DateRangeDropdown,
  type DateRangeSelection,
} from "@/components/dashboard/DateRangeDropdown";
import { ExportPdfButton } from "@/components/dashboard/ExportPdfButton";
import { HeaderSelect } from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { usePersistedWorkspace } from "@/hooks/usePersistedWorkspace";
import { fetchDashboardStats } from "@/lib/dashboard/api";
import type { DashboardProject, DashboardStats } from "@/types/dashboard";

function DashboardContent({
  teamId,
  listId,
  from,
  to,
  onProjectsLoaded,
  onStatsLoaded,
}: {
  teamId: string;
  listId: string | null;
  from: string;
  to: string;
  onProjectsLoaded: (projects: DashboardProject[]) => void;
  onStatsLoaded: (stats: DashboardStats | null) => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    onStatsLoaded(null);

    const rangeFrom = from && to ? from : null;
    const rangeTo = from && to ? to : null;

    fetchDashboardStats(teamId, "30d", listId, rangeFrom, rangeTo)
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          onProjectsLoaded(data.projects);
          onStatsLoaded(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.loadDashboard"));
          setStats(null);
          onStatsLoaded(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, listId, from, to, onProjectsLoaded, onStatsLoaded, t]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-red-200/60 bg-red-50/80 px-5 py-2.5 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300">
          <span className="font-medium">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            {t("common.dismiss")}
          </button>
        </div>
        <div className="canvas-bg flex flex-1 items-center justify-center">
          <p className="text-sm text-[var(--muted)]">{t("error.unableDashboard")}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return <DashboardGrid stats={stats} />;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { workspaces, loading: wsLoading, activeTeamId, setTeamId } = usePersistedWorkspace();
  const [listId, setListId] = useState<string | null>(null);
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeSelection>(ALL_TIME_RANGE);
  const [exportStats, setExportStats] = useState<DashboardStats | null>(null);

  const handleTeamChange = (id: string) => {
    setTeamId(id);
    setListId(null);
    setProjects([]);
    setExportStats(null);
  };

  const projectName = listId
    ? projects.find((p) => p.id === listId)?.name ?? null
    : null;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader
        filters={
          <HeaderContextGroup>
            <HeaderControl label={t("common.workspace")} grouped>
              <HeaderSelect
                value={activeTeamId ?? ""}
                onValueChange={handleTeamChange}
                disabled={wsLoading || workspaces.length === 0}
                aria-label={t("common.workspace")}
                options={workspaces.map((w) => ({ value: w.id, label: w.label }))}
              />
            </HeaderControl>

            <HeaderControl label={t("common.project")} grouped>
              <HeaderSelect
                value={listId ?? ""}
                onValueChange={(id) => setListId(id || null)}
                disabled={!activeTeamId || projects.length === 0}
                aria-label={t("common.project")}
                allowEmpty
                emptyLabel={t("common.allProjects")}
                options={projects.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.taskCount})`,
                }))}
              />
            </HeaderControl>

            <HeaderControl label={t("common.period")} grouped>
              <DateRangeDropdown value={dateRange} onChange={setDateRange} />
            </HeaderControl>
          </HeaderContextGroup>
        }
        actions={
          <ExportPdfButton
            stats={exportStats}
            projectName={projectName}
            disabled={!exportStats}
          />
        }
      />

      <div className="canvas-bg safe-bottom min-h-0 flex-1">
        {activeTeamId ? (
          <DashboardContent
            teamId={activeTeamId}
            listId={listId}
            from={dateRange.from}
            to={dateRange.to}
            onProjectsLoaded={setProjects}
            onStatsLoaded={setExportStats}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              {wsLoading ? t("common.loadingWorkspaces") : t("common.noWorkspace")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
