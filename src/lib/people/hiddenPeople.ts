/**
 * Static denylist of ClickUp users who left / should not appear in Odin.
 * Filtered in getMembers so dashboard, network, performance, and mindmap all exclude them.
 */
export const HIDDEN_CLICKUP_USER_IDS: ReadonlySet<number> = new Set([
  101619954, // Mirgalim Aspirant
  312786202, // Tsegts Temuujin
]);

export function isHiddenClickUpUser(userId: number): boolean {
  return HIDDEN_CLICKUP_USER_IDS.has(userId);
}
