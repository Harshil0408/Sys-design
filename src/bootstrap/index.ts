import type { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";
import { bootstrapCors } from "./cors.js";
import { bootstrapHelmet } from "./helmet.js";
import { bootstrapSwagger } from "./swagger.js";
import { bootstrapDatabase } from "./database.js";
import { bootstrapRedis } from "./redis.js";
import { bootstrapElasticsearch } from "./elasticsearch.js";
import { bootstrapTelemetry } from "./telemetry.js";
import { setupErrorHandler } from "../shared/plugins/error-handler.js";
import { env } from "../shared/config/env.js";

export async function bootstrapApp(app: FastifyInstance): Promise<void> {
  // 1. Error handlers
  setupErrorHandler(app);

  // 2. Security & Headers
  await bootstrapCors(app);
  await bootstrapHelmet(app);

  // 3. Swagger Documentation
  await bootstrapSwagger(app);

  // 4. JWT Plugin
  await app.register(jwt, {
    secret: env.jwtSecret,
  });

  // 5. Infrastructure connections
  await bootstrapDatabase(app);
  await bootstrapRedis(app);
  await bootstrapElasticsearch(app);

  // 6. Telemetry & logging
  await bootstrapTelemetry(app);

  app.log.info("🚀 All bootstrap modules initialized successfully.");
}
