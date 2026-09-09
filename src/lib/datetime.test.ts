import { describe, expect, it } from "vitest";
import {
  calendarDayKey,
  endOfIsoDate,
  startOfIsoDate,
  startOfWeek,
} from "./datetime";

describe("calendarDayKey", () => {
  it("uses Asia/Ulaanbaatar, not UTC", () => {
    expect(calendarDayKey(Date.parse("2026-09-02T16:00:00.000Z"))).toBe(
      "2026-09-03",
    );
    expect(calendarDayKey(Date.parse("2026-09-02T15:59:59.000Z"))).toBe(
      "2026-09-02",
    );
  });
});

describe("iso date bounds", () => {
  it("starts and ends the UB calendar day", () => {
    expect(startOfIsoDate("2026-09-03")).toBe(
      Date.parse("2026-09-02T16:00:00.000Z"),
    );
    expect(endOfIsoDate("2026-09-03")).toBe(
      Date.parse("2026-09-03T15:59:59.999Z"),
    );
  });
});

describe("startOfWeek", () => {
  it("returns Monday 00:00 in Ulaanbaatar", () => {
    // Thursday 2026-09-03 12:00 UB
    const thursday = Date.parse("2026-09-03T04:00:00.000Z");
    expect(startOfWeek(thursday)).toBe(Date.parse("2026-08-30T16:00:00.000Z"));
  });
});
