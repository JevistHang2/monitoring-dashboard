import mongoose from "mongoose";
import { env } from "../config/env.js";

let databaseEventsRegistered = false;

export function registerDatabaseEvents() {
  if (databaseEventsRegistered) {
    return;
  }

  databaseEventsRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error", error);
  });
}

export async function connectToDatabase() {
  registerDatabaseEvents();
  await mongoose.connect(env.mongodbUri);
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}
