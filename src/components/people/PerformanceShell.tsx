"use client";

import {
  AppHeader,
  HeaderContextGroup,
  HeaderControl,
} from "@/components/layout/AppHeader";
import {
  DateRangeDropdown,
  type DateRangeSelection,
} from "@/components/dashboard/DateRangeDropdown";
import { HeaderSelect } from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { DashboardProject } from "@/types/dashboard";

interface PerformanceShellProps {
  children: React.ReactNode;
  activeTeamId: string | null;
  workspaces: { id: string; label: string }[];
  wsLoading: boolean;
  onTeamChange: (id: string) => void;
  projects: DashboardProject[];
  listId: string | null;
  onListIdChange: (id: string | null) => void;
  dateRange: DateRangeSelection;
  onDateRangeChange: (range: DateRangeSelection) => void;
}

export function PerformanceShell({
  children,
  activeTeamId,
  workspaces,
  wsLoading,
  onTeamChange,
  projects,
  listId,
  onListIdChange,
  dateRange,
  onDateRangeChange,
}: PerformanceShellProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader
        filters={
          <HeaderContextGroup>
            <HeaderControl label={t("common.workspace")} grouped>
              <HeaderSelect
                value={activeTeamId ?? ""}
                onValueChange={onTeamChange}
                disabled={wsLoading || workspaces.length === 0}
                aria-label={t("common.workspace")}
                options={workspaces.map((w) => ({ value: w.id, label: w.label }))}
              />
            </HeaderControl>

            <HeaderControl label={t("common.project")} grouped>
              <HeaderSelect
                value={listId ?? ""}
                onValueChange={(id) => onListIdChange(id || null)}
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
              <DateRangeDropdown value={dateRange} onChange={onDateRangeChange} />
            </HeaderControl>
          </HeaderContextGroup>
        }
      />

      <div className="canvas-bg safe-bottom flex min-h-0 flex-1 flex-col">
        {activeTeamId ? (
          children
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              {wsLoading ? t("common.loadingWorkspaces") : t("common.noWorkspace")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
