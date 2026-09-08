import { compareNeedsAttention } from "@/lib/people/metrics";
import { loadFilteredPeopleContext } from "./context";
import { summarizeRosterMember } from "./summarize";
import type { PeopleRoster } from "@/types/people";

export async function buildPeopleRoster(
  teamId: string,
  listId: string | null,
  from: string | null,
  to: string | null,
): Promise<PeopleRoster> {
  const ctx = await loadFilteredPeopleContext(teamId, listId, from, to);

  const members = ctx.members
    .map((member, index) =>
      summarizeRosterMember(
        member,
        ctx.kpiTasksByMember[index] ?? [],
        ctx.weekStarts,
        ctx.range,
        ctx.now,
      ),
    )
    .filter((m) => m.completed + m.open + m.inProgress > 0)
    .sort(compareNeedsAttention);

  return {
    generatedAt: new Date().toISOString(),
    from: ctx.from,
    to: ctx.to,
    listId: ctx.listId,
    projects: ctx.projects,
    members,
  };
}
