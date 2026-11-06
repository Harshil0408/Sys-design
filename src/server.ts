import { buildApp } from "./app.js";
import { env } from "./shared/config/env.js";

async function startServer() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: env.host });
    app.log.info(`🎬 BookMyShow server running at http://${env.host}:${env.port}`);
  } catch (err) {
    app.log.error(err, "Failed to start server");
    process.exit(1);
  }

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, starting graceful shutdown...`);
      try {
        await app.close();
        app.log.info("Server closed successfully.");
        process.exit(0);
      } catch (closeErr) {
        app.log.error(closeErr, "Error during graceful shutdown");
        process.exit(1);
      }
    });
  }
}

startServer();
