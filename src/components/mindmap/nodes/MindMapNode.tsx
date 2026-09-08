"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  NODE_WIDTH,
  NODE_WIDTH_COMPACT,
  TYPE_COLORS,
} from "@/lib/mindmap/constants";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { bcp47 } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { MindMapNodeData, NodeType } from "@/types/mindmap";

function formatDueDate(ms: string | null | undefined, locale: "en" | "mn"): string | null {
  if (!ms) return null;
  const date = new Date(parseInt(ms, 10));
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(bcp47(locale), {
    month: "short",
    day: "numeric",
  });
}

function nodeTypeKey(type: NodeType): MessageKey {
  return `nodeType.${type}` as MessageKey;
}

function ChevronIcon({ expanded }: { expanded?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      className="transition-transform duration-200"
      style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M3 1.5L7.5 5L3 8.5" />
    </svg>
  );
}

function TeamworkIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-95"
    >
      <circle cx="5.5" cy="4.5" r="2.25" />
      <circle cx="10.5" cy="4.5" r="2.25" />
      <path d="M1.5 13.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
      <path d="M6.5 13.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
    </svg>
  );
}

function CollaborationBadge({ assigneeCount }: { assigneeCount: number }) {
  const { t } = useI18n();
  return (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-black/[0.03] text-[var(--muted)] dark:bg-white/[0.06]"
      title={t("mindmap.collabTitle", { count: assigneeCount })}
    >
      <TeamworkIcon />
    </span>
  );
}

function MindMapNodeComponent({ data }: NodeProps) {
  const { t, locale } = useI18n();
  const node = data as MindMapNodeData;
  const isTask = node.type === "task" || node.type === "subtask";
  const isMember = node.type === "member";
  const isLoadMore = node.type === "loadmore";
  const accent = isLoadMore ? "#0071e3" : (TYPE_COLORS[node.type] ?? "#0071e3");
  const due = formatDueDate(node.dueDate, locale);
  const count = node.remainingCount ?? 0;
  const displayLabel =
    node.type === "people"
      ? t("common.people")
      : node.type === "loadmore"
        ? t(count === 1 ? "mindmap.showMoreTasksOne" : "mindmap.showMoreTasks", { count })
        : node.label;
  const widthPx = node.compact ? NODE_WIDTH_COMPACT : NODE_WIDTH;
  const assigneeCount = node.assignees?.length ?? 0;
  const isCollab = isTask && assigneeCount > 1;
  const canAddInline = Boolean(node.addTaskListId);
  const showAvatars = !node.compact && Boolean(node.assignees?.length);
  const showMetaRow =
    !node.compact || isCollab || canAddInline || showAvatars;

  const handleClass = "!w-1.5 !h-1.5 !border-0 !bg-[var(--muted)] !opacity-0";

  if (isLoadMore) {
    return (
      <>
        <Handle type="target" position={Position.Left} className={handleClass} />
        <button
          type="button"
          data-load-more
          className="group rounded-xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent-soft)]/80 px-3 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:shadow-md dark:border-[var(--accent)]/40 dark:bg-[var(--accent-soft)] dark:text-[var(--accent-foreground)] dark:hover:border-[var(--accent)]/60"
          style={{ width: widthPx }}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
              <path d="M8 3v10M3 8h10" />
            </svg>
            {displayLabel}
          </span>
        </button>
        <Handle type="source" position={Position.Right} className="!bg-transparent !w-0 !h-0 !border-0" />
      </>
    );
  }

  return (
    <>
      <Handle type="target" position={Position.Left} className={handleClass} />
      <div
        className={`
          group/node glass-strong rounded-xl border shadow-surface
          transition-all duration-200 cursor-pointer
          hover:shadow-surface-lg hover:-translate-y-px
          ${node.isSelected ? "ring-2 ring-[var(--accent)]/50 shadow-surface-lg" : ""}
          ${node.isOnPath && !node.isSelected ? "border-[var(--accent)]/30" : "border-[var(--border)]"}
        `}
        style={{
          width: widthPx,
          borderLeftWidth: 3,
          borderLeftColor: accent,
          ...(node.isSelected ? { boxShadow: `var(--surface-shadow-lg), 0 0 20px var(--accent-glow)` } : {}),
        }}
      >
        <div className={node.compact ? "px-2.5 py-2" : "px-3 py-2.5"}>
          <div className="flex items-start gap-2">
            {node.hasChildren && (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors group-hover/node:text-[var(--accent)] dark:group-hover/node:text-[var(--accent-foreground)]">
                {node.isLoading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-200 border-t-[var(--accent)]" />
                ) : (
                  <ChevronIcon expanded={node.isExpanded} />
                )}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`line-clamp-2 font-semibold leading-tight text-zinc-900 dark:text-zinc-50 ${node.compact ? "text-xs" : "text-sm"}`}
                title={displayLabel}
              >
                {displayLabel}
              </p>
              {showMetaRow && (
                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  {!node.compact && (
                    <>
                      <span
                        className="inline-flex shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {t(nodeTypeKey(node.type))}
                      </span>
                      {node.childCount != null && node.childCount > 0 && !node.isExpanded && (
                        <span className="shrink-0 text-[10px] font-medium text-[var(--muted)]">
                          {t(
                            node.childCount === 1
                              ? "mindmap.itemCountOne"
                              : "mindmap.itemCount",
                            { count: node.childCount },
                          )}
                        </span>
                      )}
                    </>
                  )}
                  {isCollab && (
                    <span className="min-w-0 shrink">
                      <CollaborationBadge assigneeCount={assigneeCount} />
                    </span>
                  )}
                  {(canAddInline || showAvatars) && (
                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                      {canAddInline && (
                        <button
                          type="button"
                          data-add-inline
                          title={node.addTaskParentTaskId ? t("mindmap.addSubtask") : t("mindmap.addTask")}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-50/70 text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100/70 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M8 3v10M3 8h10" />
                          </svg>
                        </button>
                      )}
                      {showAvatars && node.assignees && (
                        <div className={`flex ${isMember ? "" : "-space-x-1.5"}`}>
                          {node.assignees.slice(0, isMember ? 1 : 2).map((a) => (
                            <Avatar
                              key={a.username}
                              name={a.username}
                              src={a.profilePicture}
                              size={isMember ? 28 : 20}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isTask && !node.compact && (node.status || node.priority || due) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {node.status && (
                <Badge label={node.status.name} color={node.status.color} />
              )}
              {node.priority && (
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: node.priority.color }}
                  title={node.priority.label}
                />
              )}
              {due && (
                <span className="text-[10px] font-medium text-[var(--muted)]">{due}</span>
              )}
            </div>
          )}

          {isTask && node.compact && node.status && (
            <div className="mt-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: node.status.color }}
                title={node.status.name}
              />
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className={handleClass} />
    </>
  );
}

export const MindMapNode = memo(MindMapNodeComponent);
