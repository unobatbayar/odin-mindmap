"use client";

import { useCallback, useEffect, useState } from "react";
import { TimelineCanvas } from "@/components/timeline/TimelineCanvas";
import { TabPageShell } from "@/components/layout/TabPageShell";
import { TabSkeleton } from "@/components/layout/TabSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { usePersistedWorkspace } from "@/hooks/usePersistedWorkspace";
import { fetchTimelineStats } from "@/lib/timeline/api";
import type { DashboardProject } from "@/types/dashboard";
import type { TimelineGroupBy, TimelineStats } from "@/types/timeline";

function TimelineContent({
  teamId,
  listId,
  assigneeId,
  groupBy,
  onProjectsLoaded,
}: {
  teamId: string;
  listId: string | null;
  assigneeId: number | null;
  groupBy: TimelineGroupBy;
  onProjectsLoaded: (projects: DashboardProject[]) => void;
}) {
  const { t } = useI18n();
  const [stats, setStats] = useState<TimelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTimelineStats(teamId, { listId, assigneeId, groupBy })
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          onProjectsLoaded(
            data.projects.map((p) => ({ id: p.id, name: p.name, taskCount: 0 })),
          );
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.loadTimeline"));
          setStats(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, listId, assigneeId, groupBy, onProjectsLoaded, t]);

  if (loading) return <TabSkeleton />;
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  if (!stats) return null;
  return <TimelineCanvas stats={stats} />;
}

export default function TimelinePage() {
  const { t } = useI18n();
  const { workspaces, loading: wsLoading, activeTeamId, setTeamId } = usePersistedWorkspace();
  const [listId, setListId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);
  const [groupBy, setGroupBy] = useState<TimelineGroupBy>("list");
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [assignees, setAssignees] = useState<{ id: number; name: string }[]>([]);

  const onProjectsLoaded = useCallback((loaded: DashboardProject[]) => {
    setProjects(loaded);
  }, []);

  useEffect(() => {
    if (!activeTeamId) return;
    fetchTimelineStats(activeTeamId, { listId: null, groupBy: "list" })
      .then((data) => setAssignees(data.assignees))
      .catch(() => setAssignees([]));
  }, [activeTeamId]);

  const handleTeamChange = (id: string) => {
    setTeamId(id);
    setListId(null);
    setAssigneeId(null);
    setProjects([]);
  };

  return (
    <TabPageShell
      activeTeamId={activeTeamId}
      workspaces={workspaces}
      wsLoading={wsLoading}
      onTeamChange={handleTeamChange}
      showProjectFilter
      projects={projects}
      listId={listId}
      onListIdChange={setListId}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-4 py-2">
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            {t("common.groupBy")}
            <Select
              value={groupBy}
              onValueChange={(next) => setGroupBy(next as TimelineGroupBy)}
            >
              <SelectTrigger size="compact" className="w-[7.5rem]" aria-label={t("common.groupBy")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">{t("common.list")}</SelectItem>
                <SelectItem value="folder">{t("common.folder")}</SelectItem>
                <SelectItem value="space">{t("common.space")}</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
            {t("common.assignee")}
            <Select
              value={assigneeId != null ? String(assigneeId) : "all"}
              onValueChange={(next) =>
                setAssigneeId(next === "all" ? null : Number(next))
              }
            >
              <SelectTrigger size="compact" className="w-[10rem]" aria-label={t("common.assignee")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="min-h-0 flex-1">
          {activeTeamId && (
            <TimelineContent
              teamId={activeTeamId}
              listId={listId}
              assigneeId={assigneeId}
              groupBy={groupBy}
              onProjectsLoaded={onProjectsLoaded}
            />
          )}
        </div>
      </div>
    </TabPageShell>
  );
}
