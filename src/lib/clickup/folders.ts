import { clickup } from "./client";
import { clickupPathId } from "./ids";
import type { ClickUpFoldersResponse } from "@/types/clickup";

export async function getFolders(spaceId: string) {
  const data = await clickup<ClickUpFoldersResponse>(
    `/space/${clickupPathId(spaceId)}/folder?archived=false`,
  );
  return data.folders;
}
