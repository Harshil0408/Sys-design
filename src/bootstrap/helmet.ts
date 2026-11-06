import type { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

export async function bootstrapHelmet(app: FastifyInstance): Promise<void> {
  await app.register(helmet, {
    contentSecurityPolicy: false // Allows API usage without browser strict CSP blocks
  });
}
