import express from "express";
import { temperatureDataRouter } from "./routes/temperature-data.routes.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(express.json());

// Check if the server is healthy
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Temperature data routes
app.use("/api", temperatureDataRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);
