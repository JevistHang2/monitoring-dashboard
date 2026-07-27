import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.routes.js";
import { temperatureDataRouter } from "./routes/temperature-data.routes.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { sendSuccess } from "./utils/api-response.js";

const APP_NAME = "monitoring-dashboard-backend";
const APP_VERSION = "1.0.0";

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.get("/", (_req, res) => {
  return sendSuccess(res, "Monitoring dashboard API is running", {
    name: APP_NAME,
    version: APP_VERSION,
  });
});

// Health check routes
app.use(healthRouter);

// Temperature data routes
app.use("/api", temperatureDataRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
