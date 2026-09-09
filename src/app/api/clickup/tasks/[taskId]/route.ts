import { updateTask, deleteTask } from "@/lib/clickup/tasks";
import { clickupErrorResponse } from "@/lib/clickup/client";
import { sanitizeTaskUpdate } from "@/lib/clickup/sanitize";
import { isAdminRequest } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { taskId } = await params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const sanitized = sanitizeTaskUpdate(body);
    if (!sanitized.ok) {
      return Response.json({ error: sanitized.error }, { status: 400 });
    }

    const task = await updateTask(taskId, sanitized.payload);
    return Response.json({ task });
  } catch (error) {
    return clickupErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { taskId } = await params;
    await deleteTask(taskId);
    return Response.json({ ok: true });
  } catch (error) {
    return clickupErrorResponse(error);
  }
}
