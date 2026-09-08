"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { PeopleWeeklyPoint } from "@/types/people";
import { ChartCard } from "./ChartCard";
import { seriesHasChartData } from "@/lib/people/metrics";

export function ActivitySignalChart({ data }: { data: PeopleWeeklyPoint[] }) {
  const { t, formatWeekLabel } = useI18n();
  const fillId = useId().replace(/:/g, "");
  const empty = !seriesHasChartData(data);
  const chartData = data.map((d) => ({
    ...d,
    weekLabel: formatWeekLabel(d.weekStartMs),
  }));
  const chartConfig = {
    count: {
      label: t("charts.unitDays"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <ChartCard
      title={t("charts.activitySignal")}
      sublabel={t("charts.activitySignalSub")}
      empty={empty}
    >
      <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="weekLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={28}
            fontSize={11}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--color-count)"
            fill={`url(#${fillId})`}
            strokeWidth={2}
            animationDuration={400}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
