"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { NetworkEdge, NetworkNode } from "@/types/network";

interface NetworkDetailPanelProps {
  node: NetworkNode;
  edges: NetworkEdge[];
  nodes: NetworkNode[];
  onClose: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
      {children}
    </p>
  );
}

export function NetworkDetailPanel({
  node,
  edges,
  nodes,
  onClose,
}: NetworkDetailPanelProps) {
  const { t } = useI18n();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const incident = edges.filter((e) => e.source === node.id || e.target === node.id);

  if (node.type === "person") {
    const membershipEdges = incident.filter((e) => e.kind === "membership");
    const collabEdges = incident.filter((e) => e.kind === "collab");

    const topProjects = membershipEdges
      .map((e) => ({
        project: nodeMap.get(e.target === node.id ? e.source : e.target),
        weight: e.weight,
      }))
      .filter((x) => x.project?.type === "project")
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    const collaborators = collabEdges
      .map((e) => {
        const otherId = e.source === node.id ? e.target : e.source;
        return { person: nodeMap.get(otherId), weight: e.weight };
      })
      .filter((x) => x.person?.type === "person")
      .sort((a, b) => b.weight - a.weight);

    const sharedTaskCount = collabEdges.reduce((sum, e) => sum + e.weight, 0);

    return (
      <aside className="glass-strong relative z-10 flex w-full flex-col border-[var(--border)] shadow-surface-lg md:w-80 md:border-l">
        <div className="h-0.5 bg-[var(--accent)]" />
        <PanelHeader label={node.label} onClose={onClose} />
        <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-5">
          <div className="flex items-center gap-3">
            <Avatar
              name={node.label}
              src={node.meta?.profilePicture}
              size={40}
            />
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{node.label}</p>
              <p className="text-xs text-[var(--muted)]">{t("common.person")}</p>
              {node.id.startsWith("person:") ? (
                <Link
                  href={`/performance/${node.id.slice("person:".length)}`}
                  className="mt-1 inline-block text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  {t("network.viewPerformance")}
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            <FieldLabel>{t("network.tasksAssigned")}</FieldLabel>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {node.meta?.taskCount ?? 0}
            </p>
          </div>

          <div>
            <FieldLabel>{t("network.sharedTasks")}</FieldLabel>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {sharedTaskCount}
            </p>
          </div>

          {topProjects.length > 0 && (
            <div>
              <FieldLabel>{t("network.topProjects")}</FieldLabel>
              <div className="space-y-2">
                {topProjects.map(({ project, weight }) => (
                  <div
                    key={project!.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] px-2.5 py-2"
                  >
                    <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {project!.label}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold text-[var(--muted)]">
                      {weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {collaborators.length > 0 && (
            <div>
              <FieldLabel>{t("network.directCollaborators")}</FieldLabel>
              <div className="space-y-2">
                {collaborators.map(({ person, weight }) => (
                  <div key={person!.id} className="flex items-center gap-2.5">
                    <Avatar
                      name={person!.label}
                      src={person!.meta?.profilePicture}
                      size={24}
                    />
                    <span className="flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {person!.label}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--muted)]">
                      {t("common.shared", { count: weight })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  const membershipEdges = incident.filter((e) => e.kind === "membership");
  const collaborators = membershipEdges
    .map((e) => {
      const personId = e.source === node.id ? e.target : e.source;
      return { person: nodeMap.get(personId), weight: e.weight };
    })
    .filter((x) => x.person?.type === "person")
    .sort((a, b) => b.weight - a.weight);

  return (
    <aside className="glass-strong relative z-10 flex w-full flex-col border-[var(--border)] shadow-surface-lg md:w-80 md:border-l">
      <div className="h-0.5 bg-[var(--accent)]" />
      <PanelHeader label={node.label} onClose={onClose} />
      <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-5">
        <div>
          <FieldLabel>{t("common.type")}</FieldLabel>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("network.projectList")}</p>
        </div>

        <div>
          <FieldLabel>{t("network.taskCount")}</FieldLabel>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {node.meta?.taskCount ?? 0}
          </p>
        </div>

        {collaborators.length > 0 && (
          <div>
            <FieldLabel>{t("network.activeCollaborators")}</FieldLabel>
            <div className="space-y-2">
              {collaborators.map(({ person, weight }) => (
                <div key={person!.id} className="flex items-center gap-2.5">
                  <Avatar
                    name={person!.label}
                    src={person!.meta?.profilePicture}
                    size={24}
                  />
                  <span className="flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {person!.label}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--muted)]">
                    {t(weight === 1 ? "common.tasksOne" : "common.tasks", { count: weight })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function PanelHeader({ label, onClose }: { label: string; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <h2 className="max-w-[180px] truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">
        {label}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-black/5 hover:text-zinc-700 dark:hover:bg-white/8 dark:hover:text-zinc-200"
        aria-label={t("dashboard.closePanel")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </button>
    </div>
  );
}
