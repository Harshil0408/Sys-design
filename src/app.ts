import Fastify, { type FastifyInstance } from "fastify";
import { getLoggerConfig } from "./bootstrap/logger.js";
import { bootstrapApp } from "./bootstrap/index.js";
import { healthRoutes } from "./features/health/health.routes.js";
import { citiesRoutes } from "./features/cities/cities.routes.js";
import { cinemasRoutes } from "./features/cinemas/cinemas.routes.js";
import { showsRoutes } from "./features/shows/shows.routes.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: getLoggerConfig(),
    disableRequestLogging: true
  });

  // 1. Run all modular bootstrap initializations
  await bootstrapApp(app);

  // 2. Register Feature Routes
  await app.register(healthRoutes);
  await app.register(citiesRoutes);
  await app.register(cinemasRoutes);
  await app.register(showsRoutes);

  return app;
}
