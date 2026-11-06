import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { errorResponse } from "../utils/response.util.js";

export function setupErrorHandler(fastify: FastifyInstance): void {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    request.log.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "An unexpected error occurred.";
    const code = error.code || "INTERNAL_ERROR";

    reply.status(statusCode).send(errorResponse(message, code));
  });

  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send(errorResponse(`Route ${request.method}:${request.url} not found`, "NOT_FOUND"));
  });
}
