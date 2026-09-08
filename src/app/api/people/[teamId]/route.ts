import { clickupErrorResponse } from "@/lib/clickup/client";
import { buildPeopleRoster } from "@/lib/people/buildPeopleRoster";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const { teamId } = await params;
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId") || null;
    const from = searchParams.get("from") || null;
    const to = searchParams.get("to") || null;
    const roster = await buildPeopleRoster(teamId, listId, from, to);
    return Response.json(roster);
  } catch (error) {
    return clickupErrorResponse(error);
  }
}
