import { getTemperatureReadings } from "@/api/temperature-api";
import { TemperatureDashboard } from "@/components/dashboard/temperature-dashboard";
import type { TemperatureReading } from "@/types/temperature";

export default async function DashboardPage() {
  let readings: TemperatureReading[] = [];
  let errorMessage: string | undefined;

  try {
    readings = await getTemperatureReadings();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load temperature readings";
  }

  return (
    <TemperatureDashboard
      initialReadings={readings}
      initialErrorMessage={errorMessage}
    />
  );
}
