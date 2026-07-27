import { Router } from "express";
import {
  getTemperatureData,
  createMockTemperatureData,
} from "../controllers/temperature-data.controller.js";

export const temperatureDataRouter = Router();

temperatureDataRouter.get("/data", getTemperatureData);
temperatureDataRouter.post("/data/mock", createMockTemperatureData);
