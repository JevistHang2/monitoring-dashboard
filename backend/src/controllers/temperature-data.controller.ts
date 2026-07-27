import type { Request, Response, NextFunction } from "express";
import { getLatestTemperatureReadings } from "../services/temperature-reading.service.js";
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
