import type { FastifyReply, FastifyRequest } from "fastify";
import type { HealthStatus } from "./health.types.js";
import { redisClient } from "../../shared/infra/redis/redis.client.js";
import { esClient } from "../../shared/infra/elasticsearch/es.client.js";
import { successResponse } from "../../shared/utils/response.util.js";

export async function getHealthHandler(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const healthData: HealthStatus = {
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      redis: redisClient.connected,
      elasticsearch: esClient.connected,
      database: true
    }
  };

  reply.status(200).send(successResponse(healthData));
}
