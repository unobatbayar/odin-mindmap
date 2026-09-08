export const CHART_COLOR_COUNT = 10;

export function chartColorAt(index: number): string {
  return `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`;
}

export function toChartKey(label: string, index: number): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return `${slug || "slice"}-${index}`;
}

const UNUSABLE_COLORS = new Set([
  "",
  "none",
  "transparent",
  "#fff",
  "#ffffff",
  "#000",
  "#000000",
  "white",
  "black",
]);

function hexRgb(color: string): { r: number; g: number; b: number } | null {
  const hex = color.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((ch) => `${ch}${ch}`)
          .join("")
      : hex;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function isUsableSliceColor(color: string): boolean {
  const normalized = color.trim().toLowerCase();
  if (UNUSABLE_COLORS.has(normalized)) return false;
  const rgb = hexRgb(normalized);
  if (!rgb) return true;
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = max / 255;
  if (saturation < 0.15) return false;
  if (brightness < 0.18) return false;
  return true;
}

export function resolveSliceColor(
  color: string | null | undefined,
  index: number,
): string {
  if (!color || !isUsableSliceColor(color)) return chartColorAt(index);
  return color;
}

export interface DonutSlice {
  key: string;
  name: string;
  count: number;
  fill: string;
  color: string;
}

export function sliceColors(
  items: { name: string; count: number; color?: string | null }[],
  options?: { maxSlices?: number; otherLabel?: string },
): { slices: DonutSlice[]; colors: string[] } {
  const maxSlices = options?.maxSlices ?? 8;
  const otherLabel = options?.otherLabel ?? "Other";
  const usable = items.filter((item) => item.count > 0);

  const source =
    usable.length > maxSlices
      ? [
          ...usable.slice(0, maxSlices - 1),
          {
            name: otherLabel,
            count: usable
              .slice(maxSlices - 1)
              .reduce((sum, item) => sum + item.count, 0),
            color: undefined,
          },
        ]
      : usable;

  const colors = source.map((item, index) =>
    resolveSliceColor(item.color, index),
  );
  const slices = source.map((item, index) => {
    const key = toChartKey(item.name, index);
    return {
      key,
      name: item.name,
      count: item.count,
      fill: `var(--color-${key})`,
      color: colors[index],
    };
  });

  return { slices, colors };
}

export function buildDonutModel(
  items: { name: string; count: number; color?: string | null }[],
  options: { valueLabel: string; otherLabel?: string; maxSlices?: number },
) {
  const built = sliceColors(items, options);
  const config = {
    count: { label: options.valueLabel },
    ...Object.fromEntries(
      built.slices.map((slice, index) => [
        slice.key,
        { label: slice.name, color: built.colors[index] },
      ]),
    ),
  };
  return {
    slices: built.slices,
    config,
    total: built.slices.reduce((sum, slice) => sum + slice.count, 0),
  };
}

