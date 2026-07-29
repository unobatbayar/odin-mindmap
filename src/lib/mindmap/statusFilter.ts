import type { TaskStatusFilter } from "./constants";
import { isFinishedStatus } from "@/lib/clickup/status";
import { isTaskType, type MindMapNodeData } from "@/types/mindmap";

export function matchesStatusFilter(
  data: MindMapNodeData,
  filter: TaskStatusFilter,
): boolean {
  if (filter === "all" || !isTaskType(data.type)) return true;
  const type = data.status?.type;
  if (!type) return false;
  // "Completed" maps to ClickUp finished types (closed + done).
  if (filter === "closed") return isFinishedStatus(type);
  return type === filter;
}
