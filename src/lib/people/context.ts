import { getMembers } from "@/lib/clickup/members";
import { getTasksForAssignee } from "@/lib/clickup/tasks";
import {
  extractProjects,
  parseAbsoluteDateRange,
  type AbsoluteDateRange,
} from "@/lib/dashboard/taskMetrics";
import { filterMemberTasks, weekStartsForRange } from "@/lib/people/metrics";
import { mapWithConcurrency } from "@/lib/utils/concurrency";
import type { ClickUpMember, ClickUpTask } from "@/types/clickup";
import type { DashboardProject } from "@/types/dashboard";

const CONCURRENCY = 6;

export interface PeopleContext {
  members: ClickUpMember[];
  memberTasks: ClickUpTask[][];
  kpiTasksByMember: ClickUpTask[][];
  projects: DashboardProject[];
  listId: string | null;
  from: string | null;
  to: string | null;
  range: AbsoluteDateRange | null;
  weekStarts: number[];
  now: number;
}

export async function loadFilteredPeopleContext(
  teamId: string,
  listId: string | null,
  from: string | null,
  to: string | null,
): Promise<PeopleContext> {
  const members = await getMembers(teamId);
  const settled = await mapWithConcurrency(members, CONCURRENCY, (member) =>
    getTasksForAssignee(teamId, String(member.user.id)).then(
      (tasks) => ({ ok: true as const, member, tasks }),
      () => ({ ok: false as const, member, tasks: [] as ClickUpTask[] }),
    ),
  );

  // Drop members whose task fetch failed entirely so one ClickUp blip
  // doesn't 500 the whole performance roster.
  const loaded = settled.filter((row) => row.ok);
  const activeMembers = loaded.map((row) => row.member);
  const memberTasks = loaded.map((row) => row.tasks);

  const allTasks = memberTasks.flat();
  const projects = extractProjects(allTasks);
  const range = parseAbsoluteDateRange(from, to);
  const now = Date.now();
  const weekStarts = weekStartsForRange(
    range?.fromMs ?? null,
    range?.toMs ?? null,
    now,
  );

  const kpiTasksByMember = memberTasks.map((tasks) =>
    filterMemberTasks(tasks, listId, range),
  );

  return {
    members: activeMembers,
    memberTasks,
    kpiTasksByMember,
    projects,
    listId,
    from: range?.from ?? null,
    to: range?.to ?? null,
    range,
    weekStarts,
    now,
  };
}

export function memberDisplayName(member: ClickUpMember): string {
  const name = member.user.username?.trim();
  return name || `User ${member.user.id}`;
}
