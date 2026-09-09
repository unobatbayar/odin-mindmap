import { ClickUpError } from "./client";

const CLICKUP_ID = /^[a-zA-Z0-9_-]{1,128}$/;

/** Reject path-injection / junk before interpolating into ClickUp URLs. */
export function clickupPathId(id: string): string {
  if (!CLICKUP_ID.test(id)) {
    throw new ClickUpError("Invalid ClickUp id", 400);
  }
  return id;
}
