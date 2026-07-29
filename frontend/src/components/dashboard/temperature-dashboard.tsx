"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Thermometer, TrendingDown, TrendingUp } from "lucide-react";

import { getTemperatureReadings } from "@/api/temperature-api";
import { ConnectionStatus } from "@/components/dashboard/connection-status";
import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ReadingsTable } from "@/components/dashboard/readings-table";
import { TemperatureBarChart } from "@/components/dashboard/temperature-bar-chart";
import { TemperatureLineChart } from "@/components/dashboard/temperature-line-chart";
import { TimezoneSelect } from "@/components/dashboard/timezone-select";
import { ErrorState } from "@/components/feedback/error-state";
import {
  DEFAULT_TIMEZONE,
  MAX_READINGS,
} from "@/constants/temperature-constant";
import { createSocket } from "@/lib/socket";
import { formatTemperature } from "@/lib/temperature-format";
import { formatReadingTime } from "@/lib/timezone";
import type {
  SocketConnectionStatus,
  TemperatureReading,
  Timezone,
} from "@/types/temperature";

type TemperatureDashboardProps = {
  initialReadings: TemperatureReading[];
  initialErrorMessage?: string;
};

type TemperatureMetrics = {
  latest: number | null;
  lastUpdatedAt: string | null;
  minimum: number | null;
  maximum: number | null;
};

function appendReading(
  currentReadings: TemperatureReading[],
  reading: TemperatureReading,
): TemperatureReading[] {
  const alreadyExists = currentReadings.some(
    (currentReading) => currentReading.created_at === reading.created_at,
  );

  if (alreadyExists) {
    return currentReadings;
  }

  return [...currentReadings, reading].slice(-MAX_READINGS);
}

function getTemperatureMetrics(
  readings: TemperatureReading[],
): TemperatureMetrics {
  if (readings.length === 0) {
    return {
      latest: null,
      lastUpdatedAt: null,
      minimum: null,
      maximum: null,
    };
  }

  const values = readings.map((reading) => reading.value);
  const latestReading = readings[readings.length - 1];

  return {
    latest: latestReading.value,
    lastUpdatedAt: latestReading.created_at,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}

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
  const [initialLoadError, setInitialLoadError] = useState(initialErrorMessage);

  useEffect(() => {
    async function syncReadings() {
      try {
        const latestReadings = await getTemperatureReadings();

        setReadings(latestReadings.slice(-MAX_READINGS));
        setInitialLoadError(undefined);
      } catch (error) {
        setInitialLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load temperature readings",
        );
      }
    }

    const socket = createSocket();

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("disconnected");
    });

    socket.io.on("reconnect_attempt", () => {
      setConnectionStatus("reconnecting");
    });

    socket.io.on("reconnect", () => {
      syncReadings();
      setConnectionStatus("connected");
    });

    socket.on("new-data", (reading) => {
      setReadings((currentReadings) => appendReading(currentReadings, reading));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.io.off("reconnect_attempt");
      socket.io.off("reconnect");
      socket.off("new-data");
      socket.disconnect();
    };
  }, []);

  const metrics = useMemo(() => getTemperatureMetrics(readings), [readings]);

  const lastUpdatedLabel = metrics.lastUpdatedAt
    ? formatReadingTime(metrics.lastUpdatedAt, timezone)
    : "--";

  return (
    <DashboardTemplate
      notice={
        initialLoadError && (
          <ErrorState
            title="Unable to load initial data"
            message={initialLoadError}
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
