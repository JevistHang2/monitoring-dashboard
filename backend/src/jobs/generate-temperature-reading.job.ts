import cron from "node-cron";
import { generateMockTemperatureReading } from "../services/mock-temperature.service.js";
import { createTemperatureReading } from "../services/temperature-reading.service.js";
import { broadcastNewTemperatureReading } from "../sockets/socket.js";

export async function generateAndBroadcastTemperatureReading() {
  const input = generateMockTemperatureReading();
  const reading = await createTemperatureReading(input);

  broadcastNewTemperatureReading(reading);

  return reading;
}

export function startGenerateTemperatureReadingJob() {
  const task = cron.schedule("*/5 * * * * *", async () => {
    try {
      const reading = await generateAndBroadcastTemperatureReading();

      console.log("Generated temperature reading", reading);
    } catch (error) {
      console.error("Failed to generate temperature reading", error);
    }
  });

  return task;
}
