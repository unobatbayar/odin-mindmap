import type { TaskCreatePayload, TaskUpdatePayload } from "@/types/clickup";
import { clickupPathId } from "./ids";

const MAX_NAME = 1000;
const MAX_STATUS = 100;
const MAX_ASSIGNEE_BATCH = 50;

function positiveIntIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((n): n is number => Number.isInteger(n) && n > 0)
    .slice(0, MAX_ASSIGNEE_BATCH);
}

export function sanitizeTaskUpdate(
  body: unknown,
): { ok: true; payload: TaskUpdatePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;
  const payload: TaskUpdatePayload = {};

  if (b.name !== undefined) {
    if (typeof b.name !== "string") {
      return { ok: false, error: "Task name is invalid" };
    }
    const name = b.name.trim();
    if (!name || name.length > MAX_NAME) {
      return { ok: false, error: "Task name is required" };
    }
    payload.name = name;
  }

  if (b.status !== undefined) {
    if (typeof b.status !== "string" || !b.status.trim() || b.status.length > MAX_STATUS) {
      return { ok: false, error: "Status is invalid" };
    }
    payload.status = b.status.trim();
  }

  if (b.priority !== undefined) {
    if (b.priority !== null && !(Number.isInteger(b.priority) && (b.priority as number) >= 1 && (b.priority as number) <= 4)) {
      return { ok: false, error: "Priority is invalid" };
    }
    payload.priority = b.priority as number | null;
  }

  if (b.assignees !== undefined) {
    if (!b.assignees || typeof b.assignees !== "object") {
      return { ok: false, error: "Assignees are invalid" };
    }
    const raw = b.assignees as { add?: unknown; rem?: unknown };
    payload.assignees = {
      add: positiveIntIds(raw.add),
      rem: positiveIntIds(raw.rem),
    };
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false, error: "No valid fields to update" };
  }
  return { ok: true, payload };
}

export function sanitizeTaskCreate(
  body: unknown,
): { ok: true; payload: TaskCreatePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string") {
    return { ok: false, error: "Task name is required" };
  }
  const name = b.name.trim();
  if (!name || name.length > MAX_NAME) {
    return { ok: false, error: "Task name is required" };
  }

  const payload: TaskCreatePayload = { name };

  if (b.parent !== undefined) {
    if (typeof b.parent !== "string") {
      return { ok: false, error: "Parent task is invalid" };
    }
    try {
      payload.parent = clickupPathId(b.parent);
    } catch {
      return { ok: false, error: "Parent task is invalid" };
    }
  }

  if (b.assignees !== undefined) {
    payload.assignees = positiveIntIds(b.assignees);
  }

  return { ok: true, payload };
}
