import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function bootstrapCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  });
}
