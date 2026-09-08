"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DonutSlice } from "@/lib/people/chartColors";

interface MixDonutChartProps {
  slices: DonutSlice[];
  config: ChartConfig;
  total: number;
  centerLabel: string;
}

export function MixDonutChart({
  slices,
  config,
  total,
  centerLabel,
}: MixDonutChartProps) {
  return (
    <div className="flex h-full flex-col">
      <ChartContainer
        config={config}
        className="mx-auto h-[210px] w-full max-w-[210px] aspect-auto"
      >
        <PieChart accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="key" />}
          />
          <Pie
            data={slices}
            dataKey="count"
            nameKey="key"
            innerRadius="55%"
            stroke="var(--panel-solid)"
            strokeWidth={5}
            paddingAngle={2}
            animationDuration={400}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 22}
                        className="fill-muted-foreground text-[11px]"
                      >
                        {centerLabel}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
        {slices.map((slice) => (
          <li
            key={slice.key}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: slice.color }}
            />
            <span className="max-w-[9.5rem] truncate">{slice.name}</span>
            <span className="tabular-nums text-foreground/70">{slice.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
