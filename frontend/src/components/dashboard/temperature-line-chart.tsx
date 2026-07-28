"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatReadingTime } from "@/lib/timezone";
import type { TemperatureReading, Timezone } from "@/types/temperature";

import {
  TEMPERATURE_MAX_VALUE,
  TEMPERATURE_MIN_VALUE,
} from "@/constants/temperature-constant";

type TemperatureLineChartProps = {
  readings: TemperatureReading[];
  timezone: Timezone;
};

const chartConfig = {
  value: {
    label: "Temperature",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TemperatureLineChart({
  readings,
  timezone,
}: TemperatureLineChartProps) {
  const chartData = readings.map((reading) => ({
    time: formatReadingTime(reading.created_at, timezone),
    value: reading.value,
  }));

  return (
    <div className="flex h-full min-h-72 flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Line Chart</h2>
        <p className="text-sm text-muted-foreground">
          Time (5-second intervals) vs Temperature (°C)
        </p>
      </div>

      <ChartContainer config={chartConfig} className="min-h-60 w-full flex-1">
        <LineChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[TEMPERATURE_MIN_VALUE, TEMPERATURE_MAX_VALUE]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
