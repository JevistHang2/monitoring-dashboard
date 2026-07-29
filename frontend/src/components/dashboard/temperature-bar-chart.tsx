"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  TEMPERATURE_MAX_VALUE,
  TEMPERATURE_MIN_VALUE,
} from "@/constants/temperature-constant";
import { formatReadingTime } from "@/lib/timezone";
import type { TemperatureReading, Timezone } from "@/types/temperature";

type TemperatureBarChartProps = {
  readings: TemperatureReading[];
  timezone: Timezone;
};

const chartConfig = {
  value: {
    label: "Temperature",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TemperatureBarChart({
  readings,
  timezone,
}: TemperatureBarChartProps) {
  const chartData = readings.map((reading) => ({
    time: formatReadingTime(reading.created_at, timezone),
    value: reading.value,
  }));

  return (
    <div className="flex h-full min-h-72 flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Bar Chart</h2>
        <p className="text-sm text-muted-foreground">
          Time (5-second intervals) vs Temperature (°C)
        </p>
      </div>

      <ChartContainer config={chartConfig} className="min-h-60 w-full flex-1">
        <BarChart data={chartData} accessibilityLayer>
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
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
