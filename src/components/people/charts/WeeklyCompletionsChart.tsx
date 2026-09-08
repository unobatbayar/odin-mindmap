"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

export function WeeklyCompletionsChart({ data }: { data: PeopleWeeklyPoint[] }) {
  const { t, formatWeekLabel } = useI18n();
  const empty = !seriesHasChartData(data);
  const chartData = data.map((d) => ({
    ...d,
    weekLabel: formatWeekLabel(d.weekStartMs),
  }));
  const chartConfig = {
    count: {
      label: t("charts.unitTasks"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ChartCard
      title={t("charts.throughput")}
      sublabel={t("charts.throughputSub")}
      empty={empty}
    >
      <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[6, 6, 0, 0]}
            animationDuration={400}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
