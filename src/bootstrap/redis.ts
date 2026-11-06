import type { FastifyInstance } from "fastify";
import { redisClient } from "../shared/infra/redis/redis.client.js";
import { env } from "../shared/config/env.js";

export async function bootstrapRedis(app: FastifyInstance): Promise<void> {
  app.log.info({ host: env.redis.host, port: env.redis.port }, "Initializing Redis connection...");
  await redisClient.connect(env.redis.host, env.redis.port);

  app.addHook("onClose", async () => {
    app.log.info("Disconnecting Redis client...");
    await redisClient.disconnect();
  });
}
