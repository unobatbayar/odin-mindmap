import { clickupErrorResponse } from "@/lib/clickup/client";
import { buildMemberPerformance } from "@/lib/people/buildMemberPerformance";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string; userId: string }> },
) {
  try {
    const { teamId, userId } = await params;
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId") || null;
    const from = searchParams.get("from") || null;
    const to = searchParams.get("to") || null;
    const stats = await buildMemberPerformance(teamId, userId, listId, from, to);
    return Response.json(stats);
  } catch (error) {
    return clickupErrorResponse(error);
  }
}
