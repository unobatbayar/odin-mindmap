"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { fetchDashboardStats } from "@/lib/dashboard/api";
import type { DashboardDateRange, DashboardProject, DashboardStats } from "@/types/dashboard";

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 9.5a5.5 5.5 0 01-7-7 5.5 5.5 0 107 7z" />
    </svg>
  );
}

const RANGE_OPTIONS: { value: DashboardDateRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];

function DashboardContent({
  teamId,
  range,
  listId,
  onProjectsLoaded,
}: {
  teamId: string;
  range: DashboardDateRange;
  listId: string | null;
  onProjectsLoaded: (projects: DashboardProject[]) => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDashboardStats(teamId, range, listId)
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          onProjectsLoaded(data.projects);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
          setStats(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, range, listId, onProjectsLoaded]);

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
            Dismiss
          </button>
        </div>
        <div className="canvas-bg flex flex-1 items-center justify-center">
          <p className="text-sm text-[var(--muted)]">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return <DashboardGrid stats={stats} />;
}

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const { workspaces, loading: wsLoading } = useWorkspaces();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [range, setRange] = useState<DashboardDateRange>("30d");
  const [listId, setListId] = useState<string | null>(null);
  const [projects, setProjects] = useState<DashboardProject[]>([]);

  const activeTeamId = teamId ?? workspaces[0]?.id ?? null;

  const handleTeamChange = (id: string) => {
    setTeamId(id);
    setListId(null);
    setProjects([]);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="glass relative z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] px-5">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="3" fill="white" />
                <circle cx="8" cy="10" r="2" fill="white" fillOpacity="0.85" />
                <circle cx="24" cy="10" r="2" fill="white" fillOpacity="0.85" />
                <circle cx="8" cy="22" r="2" fill="white" fillOpacity="0.85" />
                <circle cx="24" cy="22" r="2" fill="white" fillOpacity="0.85" />
                <path d="M13 14L9 11M19 14L23 11M13 18L9 21M19 18L23 21" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="shrink-0 text-sm font-bold tracking-tight text-gradient">
              Odin Mindmap
            </h1>
          </div>

          <div className="hidden h-4 w-px bg-[var(--border-strong)] sm:block" />
          <AppNav />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-[var(--muted)] sm:inline">
              Workspace
            </span>
            <select
              value={activeTeamId ?? ""}
              onChange={(e) => handleTeamChange(e.target.value)}
              disabled={wsLoading || workspaces.length === 0}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:text-zinc-200"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-[var(--muted)] sm:inline">
              Project
            </span>
            <select
              value={listId ?? ""}
              onChange={(e) => setListId(e.target.value || null)}
              disabled={!activeTeamId || projects.length === 0}
              className="max-w-[10rem] rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] px-2.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:text-zinc-200 sm:max-w-[14rem]"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.taskCount})
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-xl border border-[var(--border-strong)] bg-[var(--panel-solid)] p-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRange(opt.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  range === opt.value
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    : "text-[var(--muted)] hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </Button>
        </div>
      </header>

      <div className="canvas-bg min-h-0 flex-1">
        {activeTeamId ? (
          <DashboardContent
            teamId={activeTeamId}
            range={range}
            listId={listId}
            onProjectsLoaded={setProjects}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              {wsLoading ? "Loading workspaces…" : "No workspace available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
