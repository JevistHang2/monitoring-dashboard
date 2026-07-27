import type { Request, Response, NextFunction } from "express";
import { generateMockTemperatureReading } from "../services/mock-temperature.service.js";
import {
  getLatestTemperatureReadings,
  createTemperatureReading,
} from "../services/temperature-reading.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function getTemperatureData(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const readings = await getLatestTemperatureReadings();
    return sendSuccess(
      res,
      "Temperature readings fetched successfully",
      readings,
    );
  } catch (error) {
    next(error);
  }
}

export async function createMockTemperatureData(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = generateMockTemperatureReading();
    const reading = await createTemperatureReading(input);

    return sendSuccess(
      res,
      "Mock temperature reading created successfully",
      reading,
      201,
    );
  } catch (error) {
    next(error);
  }
}
