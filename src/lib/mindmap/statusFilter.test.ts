import { describe, expect, it } from "vitest";
import { matchesStatusFilter } from "./statusFilter";
import type { MindMapNodeData } from "@/types/mindmap";

function task(statusType?: string): MindMapNodeData {
  return {
    type: "task",
    clickupId: "1",
    parentId: "list:1",
    label: "Task",
    hasChildren: false,
    childrenLoaded: true,
    status: statusType
      ? { name: "complete", color: "#0f0", type: statusType }
      : undefined,
  };
}

describe("matchesStatusFilter", () => {
  it("shows all tasks when filter is all", () => {
    expect(matchesStatusFilter(task("done"), "all")).toBe(true);
    expect(matchesStatusFilter(task("open"), "all")).toBe(true);
  });

  it("treats both closed and done as Completed", () => {
    expect(matchesStatusFilter(task("closed"), "closed")).toBe(true);
    expect(matchesStatusFilter(task("done"), "closed")).toBe(true);
    expect(matchesStatusFilter(task("open"), "closed")).toBe(false);
    expect(matchesStatusFilter(task("custom"), "closed")).toBe(false);
  });

  it("matches open and custom by status.type", () => {
    expect(matchesStatusFilter(task("open"), "open")).toBe(true);
    expect(matchesStatusFilter(task("custom"), "custom")).toBe(true);
    expect(matchesStatusFilter(task("done"), "open")).toBe(false);
  });

  it("hides tasks with missing status type for non-all filters", () => {
    expect(matchesStatusFilter(task(), "closed")).toBe(false);
  });
});
