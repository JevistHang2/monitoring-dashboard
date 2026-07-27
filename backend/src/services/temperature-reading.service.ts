import { TemperatureReadingModel } from "../models/temperature-reading.model.js";
import {
  serializeTemperatureReading,
  type SerializedTemperatureReading,
} from "../utils/serialize-temperature-reading.js";
import type { NewTemperatureReadingInput } from "./mock-temperature.service.js";

const DEFAULT_LIMIT = 50;

export async function getLatestTemperatureReadings(
  limit = DEFAULT_LIMIT,
): Promise<SerializedTemperatureReading[]> {
  const readings = await TemperatureReadingModel.find()
    .sort({ created_at: -1 })
    .limit(limit);

  return readings.map(serializeTemperatureReading).reverse();
}

export async function createTemperatureReading(
  input: NewTemperatureReadingInput,
): Promise<SerializedTemperatureReading> {
  const reading = await TemperatureReadingModel.create(input);

  return serializeTemperatureReading(reading);
}
