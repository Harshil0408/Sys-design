import type { FastifyInstance } from "fastify";
import { getHealthHandler } from "./health.controller.js";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Check system and connected services health",
        description: "Returns server uptime, status, and connection states of Redis, MongoDB, and Elasticsearch.",
        response: {
          200: {
            description: "System health status",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  uptimeSeconds: { type: "number" },
                  timestamp: { type: "string" },
                  version: { type: "string" },
                  services: {
                    type: "object",
                    properties: {
                      redis: { type: "boolean" },
                      elasticsearch: { type: "boolean" },
                      database: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    getHealthHandler
  );
}
