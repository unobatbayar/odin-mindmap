"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { PeopleWeeklyPoint } from "@/types/people";
import { seriesHasChartData } from "@/lib/people/metrics";

export function ActivitySparkline({ data }: { data: PeopleWeeklyPoint[] }) {
  if (!seriesHasChartData(data)) return null;

  return (
    <div className="h-10 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--chart-2)"
            strokeWidth={1.5}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
