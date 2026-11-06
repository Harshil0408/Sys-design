import type { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse } from "../utils/response.util.js";

export async function authGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send(errorResponse("Unauthorized: Missing or invalid token", "UNAUTHORIZED"));
  }
}
