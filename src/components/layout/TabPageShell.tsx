"use client";

import {
  AppHeader,
  HeaderContextGroup,
  HeaderControl,
} from "@/components/layout/AppHeader";
import { HeaderSelect } from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { DashboardDateRange, DashboardProject } from "@/types/dashboard";

const RANGE_OPTIONS: { value: DashboardDateRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];

interface TabPageShellProps {
  children: React.ReactNode;
  activeTeamId: string | null;
  workspaces: { id: string; label: string }[];
  wsLoading: boolean;
  onTeamChange: (id: string) => void;
  showProjectFilter?: boolean;
  projects?: DashboardProject[];
  listId?: string | null;
  onListIdChange?: (id: string | null) => void;
  showRangeFilter?: boolean;
  range?: DashboardDateRange;
  onRangeChange?: (range: DashboardDateRange) => void;
}

export function TabPageShell({
  children,
  activeTeamId,
  workspaces,
  wsLoading,
  onTeamChange,
  showProjectFilter = false,
  projects = [],
  listId = null,
  onListIdChange,
  showRangeFilter = false,
  range = "30d",
  onRangeChange,
}: TabPageShellProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader
        filters={
          <>
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

              {showProjectFilter && onListIdChange && (
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
              )}
            </HeaderContextGroup>

            {showRangeFilter && onRangeChange && (
              <div className="glass-solid flex rounded-xl border border-[var(--border-strong)] p-0.5">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onRangeChange(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      range === opt.value
                        ? "bg-[var(--accent-soft)] text-[var(--accent-foreground)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </>
        }
      />

      <div className="canvas-bg safe-bottom min-h-0 flex-1">
        {activeTeamId ? (
          children
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
