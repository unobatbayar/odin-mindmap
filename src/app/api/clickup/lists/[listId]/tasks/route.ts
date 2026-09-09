import { getTasksInList, createTask } from "@/lib/clickup/tasks";
import { getList } from "@/lib/clickup/lists";
import { tasksToNodes, taskToNode } from "@/lib/clickup/transform";
import { clickupErrorResponse } from "@/lib/clickup/client";
import { isAdminRequest } from "@/lib/admin";
import { sanitizeTaskCreate } from "@/lib/clickup/sanitize";
import { makeNodeId } from "@/types/mindmap";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ listId: string }> },
) {
  try {
    const { listId } = await params;
    const parentId = makeNodeId("list", listId);

    const [tasks, list] = await Promise.all([
      getTasksInList(listId),
      getList(listId).catch(() => null),
    ]);

    const statuses = list?.statuses?.map((s) => ({
      name: s.status,
      color: s.color,
    }));

    const nodes = tasksToNodes(tasks, parentId, statuses);
    return Response.json({ nodes, statuses });
  } catch (error) {
    return clickupErrorResponse(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ listId: string }> },
) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { listId } = await params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const sanitized = sanitizeTaskCreate(body);
    if (!sanitized.ok) {
      return Response.json({ error: sanitized.error }, { status: 400 });
    }

    const [task, list] = await Promise.all([
      createTask(listId, sanitized.payload),
      getList(listId).catch(() => null),
    ]);

    const statuses = list?.statuses?.map((s) => ({
      name: s.status,
      color: s.color,
    }));

    const parentId = sanitized.payload.parent
      ? makeNodeId("task", sanitized.payload.parent)
      : makeNodeId("list", listId);

    const node = taskToNode(task, parentId, statuses);
    return Response.json({ task, node });
  } catch (error) {
    return clickupErrorResponse(error);
  }
}
