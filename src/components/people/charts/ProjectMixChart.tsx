"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { buildDonutModel } from "@/lib/people/chartColors";
import type { PeopleProjectMix } from "@/types/people";
import { ChartCard } from "./ChartCard";
import { MixDonutChart } from "./MixDonutChart";

export function ProjectMixChart({ data }: { data: PeopleProjectMix[] }) {
  const { t } = useI18n();
  const { slices, config, total } = useMemo(
    () =>
      buildDonutModel(
        data.map((d) => ({ name: d.name, count: d.count })),
        { valueLabel: t("charts.unitTasks"), otherLabel: t("charts.other") },
      ),
    [data, t],
  );

  return (
    <ChartCard
      title={t("charts.projectMix")}
      sublabel={t("charts.projectMixSub")}
      empty={total === 0}
      tall
    >
      <MixDonutChart
        slices={slices}
        config={config}
        total={total}
        centerLabel={t("charts.unitTasks")}
      />
    </ChartCard>
  );
}
