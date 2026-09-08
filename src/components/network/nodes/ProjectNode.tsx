"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useNetworkInteraction } from "../NetworkInteractionContext";

export interface ProjectNodeData {
  label: string;
  taskCount?: number;
}

function ProjectNodeComponent({ id, data }: NodeProps) {
  const node = data as unknown as ProjectNodeData;
  const { activeId, neighborIds, focusedId } = useNetworkInteraction();

  const inHighlight = neighborIds?.has(id) ?? false;
  const dimmed = neighborIds != null && !inHighlight;
  const focused = focusedId === id;
  const highlighted =
    activeId === id || (neighborIds != null && inHighlight && activeId != null);

  return (
    <div
      className="transition-opacity duration-150"
      style={{ opacity: dimmed ? 0.25 : 1 }}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <div
        className={`rounded-xl border px-2.5 py-1.5 shadow-surface transition-all duration-150 ${
          highlighted || focused
            ? "border-blue-400/60 bg-blue-50/90 ring-2 ring-blue-500/40 dark:border-blue-500/40 dark:bg-blue-950/50"
            : "glass-solid border-[var(--border-strong)]"
        }`}
      >
        <p
          className={`max-w-[100px] truncate text-[10px] font-semibold ${
            highlighted || focused
              ? "text-blue-700 dark:text-blue-200"
              : "text-zinc-700 dark:text-zinc-200"
          }`}
        >
          {node.label}
        </p>
        {node.taskCount != null && node.taskCount > 0 && (
          <p className="mt-0.5 text-[9px] font-medium text-[var(--muted)]">
            {node.taskCount} task{node.taskCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
    </div>
  );
}

export const ProjectNode = memo(ProjectNodeComponent);
