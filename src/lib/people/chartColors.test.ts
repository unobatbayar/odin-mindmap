import { describe, expect, it } from "vitest";
import { buildDonutModel, resolveSliceColor } from "./chartColors";

describe("chartColors", () => {
  it("falls back to the palette for grey or empty colors", () => {
    expect(resolveSliceColor("#cccccc", 0)).toBe("var(--chart-1)");
    expect(resolveSliceColor("#fff", 2)).toBe("var(--chart-3)");
    expect(resolveSliceColor(null, 4)).toBe("var(--chart-5)");
  });

  it("keeps saturated status colors", () => {
    expect(resolveSliceColor("#30d158", 0)).toBe("#30d158");
    expect(resolveSliceColor("#ff375f", 1)).toBe("#ff375f");
  });

  it("groups overflow slices into Other", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      name: `List ${i + 1}`,
      count: 10 - i,
    }));
    const model = buildDonutModel(items, {
      valueLabel: "tasks",
      otherLabel: "Other",
      maxSlices: 8,
    });
    expect(model.slices).toHaveLength(8);
    expect(model.slices.at(-1)?.name).toBe("Other");
    expect(model.slices.at(-1)?.count).toBe(6);
    expect(model.total).toBe(55);
  });
});
