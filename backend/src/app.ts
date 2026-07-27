import express from "express";
import { TemperatureReadingModel } from "./models/temperature-reading.model.js";
import { serializedTemperatureReading } from "./utils/serialize-temperature-reading.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/test-temperature-reading", async (_req, res, next) => {
  try {
    const temperatureReading = await TemperatureReadingModel.create({
      created_at: new Date(),
      value: 72,
    });

    res.status(201).json(serializedTemperatureReading(temperatureReading));
  } catch (error) {
    next(error);
  }
});

export default app;
