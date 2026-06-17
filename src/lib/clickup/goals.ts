import { clickup } from "./client";
import { mapWithConcurrency } from "@/lib/utils/concurrency";
import type {
  ClickUpGoal,
  ClickUpGoalResponse,
  ClickUpGoalsResponse,
} from "@/types/clickup";

function flattenGoals(data: ClickUpGoalsResponse): ClickUpGoal[] {
  const goals = [...(data.goals ?? [])];
  for (const folder of data.folders ?? []) {
    goals.push(...(folder.goals ?? []));
  }
  return goals.filter((g) => !g.archived);
}

export async function getGoals(teamId: string): Promise<ClickUpGoal[]> {
  const data = await clickup<ClickUpGoalsResponse>(`/team/${teamId}/goal`);
  const goals = flattenGoals(data);

  const withKeyResults = goals.filter(
    (g) => (g.key_result_count ?? g.key_results?.length ?? 0) > 0,
  );

  if (withKeyResults.length === 0) return goals;

  const details = await mapWithConcurrency(withKeyResults, 6, async (goal) => {
    const res = await clickup<ClickUpGoalResponse>(`/goal/${goal.id}`);
    return res.goal;
  });

  const detailById = new Map(details.map((g) => [g.id, g]));
  return goals.map((g) => detailById.get(g.id) ?? g);
}
