/**
 * ClickUp status.type values for finished tasks.
 * Both appear in the wild; UI labels are often "complete" / "done" / "closed".
 */
export function isFinishedStatus(type: string): boolean {
  return type === "closed" || type === "done";
}
