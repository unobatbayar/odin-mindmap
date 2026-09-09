import { clickup } from "./client";
import { clickupPathId } from "./ids";
import type { ClickUpSpacesResponse } from "@/types/clickup";

export async function getSpaces(teamId: string) {
  const data = await clickup<ClickUpSpacesResponse>(
    `/team/${clickupPathId(teamId)}/space?archived=false`,
  );
  return data.spaces;
}
