"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { buildDonutModel } from "@/lib/people/chartColors";
import type { PeopleStatusCount } from "@/types/people";
import { ChartCard } from "./ChartCard";
import { MixDonutChart } from "./MixDonutChart";

export function StatusMixChart({ data }: { data: PeopleStatusCount[] }) {
  const { t } = useI18n();
  const { slices, config, total } = useMemo(
    () =>
      buildDonutModel(
        data.map((d) => ({ name: d.label, count: d.count, color: d.color })),
        { valueLabel: t("charts.unitTasks"), otherLabel: t("charts.other") },
      ),
    [data, t],
  );

  return (
    <ChartCard
      title={t("charts.statusMix")}
      sublabel={t("charts.statusMixSub")}
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
