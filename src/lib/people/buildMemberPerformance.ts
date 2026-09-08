import { ClickUpError } from "@/lib/clickup/client";
import { compareNeedsAttention } from "@/lib/people/metrics";
import type { MemberPerformance } from "@/types/people";
import { loadFilteredPeopleContext } from "./context";
import { buildDetailPayload, summarizeRosterMember } from "./summarize";

export async function buildMemberPerformance(
  teamId: string,
  userId: string,
  listId: string | null,
  from: string | null,
  to: string | null,
): Promise<MemberPerformance> {
  const ctx = await loadFilteredPeopleContext(teamId, listId, from, to);
  const memberIndex = ctx.members.findIndex(
    (m) => String(m.user.id) === userId,
  );
  if (memberIndex < 0) {
    throw new ClickUpError("Member not found", 404);
  }

  const member = ctx.members[memberIndex];
  const roster = ctx.members
    .map((m, index) =>
      summarizeRosterMember(
        m,
        ctx.kpiTasksByMember[index] ?? [],
        ctx.weekStarts,
        ctx.range,
        ctx.now,
      ),
    )
    .filter((m) => m.completed + m.open + m.inProgress > 0)
    .sort(compareNeedsAttention);

  const detail = buildDetailPayload(
    member,
    ctx.kpiTasksByMember[memberIndex] ?? [],
    roster,
    ctx.weekStarts,
    ctx.range,
    ctx.now,
  );

  const rosterMember = roster.find((m) => m.id === member.user.id);

  return {
    generatedAt: new Date().toISOString(),
    from: ctx.from,
    to: ctx.to,
    listId: ctx.listId,
    projects: ctx.projects,
    ...detail,
    // Prefer the roster grade so list ↔ detail never diverge for one person.
    grade: rosterMember?.grade ?? detail.grade,
  };
}
