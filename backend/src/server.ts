import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase, disconnectFromDatabase } from "./db/connection.js";

async function startServer() {
  await connectToDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });

  process.on("SIGINT", async () => {
    server.close(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
