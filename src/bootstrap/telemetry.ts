import type { FastifyInstance } from "fastify";

export async function bootstrapTelemetry(app: FastifyInstance): Promise<void> {
  // Request duration and latency measurement hook
  app.addHook("onRequest", async (request) => {
    (request as unknown as { startTime: bigint }).startTime = process.hrtime.bigint();
  });

  app.addHook("onResponse", async (request, reply) => {
    const start = (request as unknown as { startTime?: bigint }).startTime;
    if (start) {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      request.log.info({
        url: request.url,
        method: request.method,
        statusCode: reply.statusCode,
        durationMs: durationMs.toFixed(2)
      }, "Request finished");
    }
  });
}
