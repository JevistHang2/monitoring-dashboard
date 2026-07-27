import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectToDatabase() {
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to DB");
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}
