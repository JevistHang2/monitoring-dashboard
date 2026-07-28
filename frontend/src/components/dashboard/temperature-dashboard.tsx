"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Thermometer, TrendingDown, TrendingUp } from "lucide-react";

import { ConnectionStatus } from "@/components/dashboard/connection-status";
import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ReadingsTable } from "@/components/dashboard/readings-table";
import { TemperatureBarChart } from "@/components/dashboard/temperature-bar-chart";
import { TemperatureLineChart } from "@/components/dashboard/temperature-line-chart";
import { TimezoneSelect } from "@/components/dashboard/timezone-select";

import {
  DEFAULT_TIMEZONE,
  MAX_READINGS,
} from "@/constants/temperature-constant";
import { formatTemperature } from "@/lib/temperature-format";
import type {
  SocketConnectionStatus,
  TemperatureReading,
  Timezone,
} from "@/types/temperature";
import { ErrorState } from "../feedback/error-state";
import { formatReadingTime } from "@/lib/timezone";
import { createSocket } from "@/lib/socket";

type TemperatureDashboardProps = {
  initialReadings: TemperatureReading[];
  initialErrorMessage?: string;
};

export function TemperatureDashboard({
  initialReadings,
  initialErrorMessage,
}: TemperatureDashboardProps) {
  const [timezone, setTimezone] = useState<Timezone>(DEFAULT_TIMEZONE);
  const [connectionStatus, setConnectionStatus] =
    useState<SocketConnectionStatus>("disconnected");
  const [readings, setReadings] = useState<TemperatureReading[]>(
    initialReadings.slice(-MAX_READINGS),
  );

  useEffect(() => {
    const socket = createSocket();

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionStatus("reconnecting");
    });

    socket.on("new-data", (reading) => {
      setReadings((currentReadings) =>
        [...currentReadings, reading].slice(-MAX_READINGS),
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-data");
      socket.io.off("reconnect_attempt");
      socket.disconnect();
    };
  }, []);

  const metrics = useMemo(() => {
    if (readings.length === 0) {
      return {
        latest: null,
        lastUpdatedAt: null,
        minimum: null,
        maximum: null,
      };
    }

    const values = readings.map((reading) => reading.value);
    const latest = readings[readings.length - 1].value;

    return {
      latest,
      lastUpdatedAt: readings[readings.length - 1].created_at,
      minimum: Math.min(...values),
      maximum: Math.max(...values),
    };
  }, [readings]);

  const lastUpdatedLabel = metrics.lastUpdatedAt
    ? formatReadingTime(metrics.lastUpdatedAt, timezone)
    : "--";

  return (
    <DashboardTemplate
      notice={
        initialErrorMessage && (
          <ErrorState
            title="Unable to load initial data"
            message={initialErrorMessage}
          />
        )
      }
      toolbar={
        <>
          <div>
            <h2 className="text-lg font-semibold">Dashboard Overview</h2>
            <p className="text-sm text-muted-foreground">
              Initial readings are server-rendered, then displayed in the
              selected timezone.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <ConnectionStatus status={connectionStatus} />
            <TimezoneSelect value={timezone} onChange={setTimezone} />
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            title="Last Updated"
            value={lastUpdatedLabel}
            description="Latest reading timestamp"
            icon={Clock}
          />
          <MetricCard
            title="Latest"
            value={formatTemperature(metrics.latest)}
            description="Most recent reading"
            icon={Thermometer}
          />
          <MetricCard
            title="Minimum"
            value={formatTemperature(metrics.minimum)}
            description="Lowest visible reading"
            icon={TrendingDown}
          />
          <MetricCard
            title="Maximum"
            value={formatTemperature(metrics.maximum)}
            description="Highest visible reading"
            icon={TrendingUp}
          />
        </>
      }
      lineChart={
        <TemperatureLineChart readings={readings} timezone={timezone} />
      }
      barChart={<TemperatureBarChart readings={readings} timezone={timezone} />}
      readings={<ReadingsTable readings={readings} timezone={timezone} />}
    />
  );
}
