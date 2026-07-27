import type { TemperatureReading } from "../models/temperature-reading.model.js";

export type SerializedTemperatureReading = {
  created_at: string;
  value: number;
};

export function serializedTemperatureReading(
  temperatureReading: TemperatureReading,
): SerializedTemperatureReading {
  return {
    created_at: temperatureReading.created_at.toISOString(),
    value: temperatureReading.value,
  };
}
