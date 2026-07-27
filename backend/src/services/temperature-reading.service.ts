import { TemperatureReadingModel } from "../models/temperature-reading.model.js";
import {
  serializeTemperatureReading,
  type SerializedTemperatureReading,
} from "../utils/serialize-temperature-reading.js";

const DEFAULT_LIMIT = 50;

export async function getLatestTemperatureReadings(
  limit = DEFAULT_LIMIT,
): Promise<SerializedTemperatureReading[]> {
  const readings = await TemperatureReadingModel.find()
    .sort({ created_at: -1 })
    .limit(limit);

  return readings.map(serializeTemperatureReading).reverse();
}
