import { API_URL } from "@/constants/env";
import { API_ROUTES } from "@/constants/api-routes";
import { handleApiResponse } from "@/lib/handle-api-response";
import type { TemperatureReading } from "@/types/temperature";

export async function getTemperatureData(): Promise<TemperatureReading[]> {
  const response = await fetch(`${API_URL}${API_ROUTES.temperatureData}`, {
    cache: "no-store",
  });

  return handleApiResponse<TemperatureReading[]>(
    response,
    "Failed to get temperature data",
  );
}
