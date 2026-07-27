import { Router } from "express";
import { getTemperatureData } from "../controllers/temperature-data.controller.js";

export const temperatureDataRouter = Router();

temperatureDataRouter.get("/data", getTemperatureData);
