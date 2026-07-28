import { Gauge, Thermometer, TrendingDown, TrendingUp } from "lucide-react";

import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DashboardToolbar } from "./dashboard-toolbar";
import { ReadingsTable } from "@/components/dashboard/readings-table";
import { TemperatureLineChart } from "@/components/dashboard/temperature-line-chart";
import { TemperatureBarChart } from "@/components/dashboard/temperature-bar-chart";

import type { TemperatureReading } from "@/types/temperature";
import { DEFAULT_TIMEZONE } from "@/constants/temperature-constant";

const PREVIEW_READINGS: TemperatureReading[] = [
  {
    created_at: "2026-07-27T10:00:00.000Z",
    value: 24.7,
  },
  {
    created_at: "2026-07-27T10:00:05.000Z",
    value: 25.1,
  },
  {
    created_at: "2026-07-27T10:00:10.000Z",
    value: 24.9,
  },
];

export function DashboardPreview() {
  return (
    <DashboardTemplate
      toolbar={
        <>
          <div>
            <h2 className="text-lg font-semibold">Dashboard Overview</h2>
            <p className="text-sm text-muted-foreground">
              Timezone and realtime status controls will appear here.
            </p>
          </div>

          <DashboardToolbar />
        </>
      }
      metrics={
        <>
          <MetricCard
            title="Latest"
            value="-- °C"
            description="Most recent reading"
            icon={Thermometer}
          />
          <MetricCard
            title="Average"
            value="-- °C"
            description="Across visible readings"
            icon={Gauge}
          />
          <MetricCard
            title="Minimum"
            value="-- °C"
            description="Lowest visible reading"
            icon={TrendingDown}
          />
          <MetricCard
            title="Maximum"
            value="-- °C"
            description="Highest visible reading"
            icon={TrendingUp}
          />
        </>
      }
      lineChart={
        <TemperatureLineChart
          readings={PREVIEW_READINGS}
          timezone={DEFAULT_TIMEZONE}
        />
      }
      barChart={
        <TemperatureBarChart
          readings={PREVIEW_READINGS}
          timezone={DEFAULT_TIMEZONE}
        />
      }
      readings={
        <ReadingsTable
          readings={PREVIEW_READINGS}
          timezone={DEFAULT_TIMEZONE}
        />
      }
    />
  );
}
