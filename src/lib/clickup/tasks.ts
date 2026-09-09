import { clickup } from "./client";
import { clickupPathId } from "./ids";
import type {
  ClickUpTask,
  ClickUpTasksResponse,
  TaskCreatePayload,
  TaskUpdatePayload,
} from "@/types/clickup";

const TASK_QUERY =
  "subtasks=true&include_closed=true&include_markdown_description=false";
const MAX_PAGES = 50;

async function paginateTasks(path: string): Promise<ClickUpTask[]> {
  const tasks: ClickUpTask[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await clickup<ClickUpTasksResponse>(`${path}&page=${page}`);
    tasks.push(...(data.tasks ?? []));
    if (data.last_page) break;
  }
  return tasks;
}

export async function getTasksInList(listId: string): Promise<ClickUpTask[]> {
  const id = clickupPathId(listId);
  return paginateTasks(`/list/${id}/task?${TASK_QUERY}`);
}

export async function getTasksForAssignee(
  teamId: string,
  userId: string,
): Promise<ClickUpTask[]> {
  const team = clickupPathId(teamId);
  const user = clickupPathId(userId);
  return paginateTasks(
    `/team/${team}/task?${TASK_QUERY}&assignees[]=${user}`,
  );
}

export async function getMilestoneTasks(
  teamId: string,
): Promise<ClickUpTask[]> {
  const team = clickupPathId(teamId);
  return paginateTasks(`/team/${team}/task?${TASK_QUERY}&custom_items[]=1`);
}

export async function updateTask(taskId: string, payload: TaskUpdatePayload) {
  return clickup<ClickUpTask>(`/task/${clickupPathId(taskId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function createTask(listId: string, payload: TaskCreatePayload) {
  return clickup<ClickUpTask>(`/list/${clickupPathId(listId)}/task`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(taskId: string) {
  await clickup<void>(`/task/${clickupPathId(taskId)}`, { method: "DELETE" });
}
