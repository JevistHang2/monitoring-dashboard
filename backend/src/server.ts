import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/connection.js";
import { startGenerateTemperatureReadingJob } from "./jobs/generate-temperature-reading.job.js";
import { createServer } from "node:http";
import { setupSocket } from "./sockets/socket.js";

async function startServer() {
  await connectToDatabase();

  const httpServer = createServer(app);

  setupSocket(httpServer);

  const temperatureJob = startGenerateTemperatureReadingJob();

  httpServer.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });

  process.on("SIGINT", async () => {
    temperatureJob.stop();
    httpServer.close(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
