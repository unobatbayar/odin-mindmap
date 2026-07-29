import { describe, expect, it } from "vitest";
import { isFinishedStatus } from "./status";

describe("isFinishedStatus", () => {
  it("treats closed and done as finished", () => {
    expect(isFinishedStatus("closed")).toBe(true);
    expect(isFinishedStatus("done")).toBe(true);
    expect(isFinishedStatus("open")).toBe(false);
    expect(isFinishedStatus("custom")).toBe(false);
  });
});
