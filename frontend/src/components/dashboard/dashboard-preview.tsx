import { Gauge, Thermometer, TrendingDown, TrendingUp } from "lucide-react";

import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { MetricCard } from "@/components/dashboard/metric-card";

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

          <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
            Toolbar controls
          </div>
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
      lineChart={<div>Line chart</div>}
      barChart={<div>Bar chart</div>}
      readings={<div className="p-4">Recent readings</div>}
    />
  );
}
