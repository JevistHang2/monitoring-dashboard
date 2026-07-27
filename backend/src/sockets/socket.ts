import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { env } from "../config/env.js";
import type { SerializedTemperatureReading } from "../utils/serialize-temperature-reading.js";

let io: Server | null = null;

export function setupSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.frontendUrl,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function broadcastNewTemperatureReading(
  reading: SerializedTemperatureReading,
) {
  if (!io) {
    return;
  }

  io.emit("new-data", reading);
}
