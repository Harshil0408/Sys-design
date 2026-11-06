import type { FastifyReply, FastifyRequest } from "fastify";
import type { CinemaListQuery } from "./cinemas.types.js";
import { cinemasService } from "./cinemas.service.js";
import { successResponse, errorResponse } from "../../shared/utils/response.util.js";

export async function listCinemasHandler(
  request: FastifyRequest<{ Querystring: CinemaListQuery }>,
  reply: FastifyReply
): Promise<void> {
  const cinemas = await cinemasService.getCinemas(request.query);
  reply.status(200).send(successResponse(cinemas, cinemas.length));
}

export async function getCinemaByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const cinema = await cinemasService.getCinemaById(request.params.id);
  if (!cinema) {
    reply.status(404).send(errorResponse(`Cinema with ID ${request.params.id} not found`, "CINEMA_NOT_FOUND"));
    return;
  }
  reply.status(200).send(successResponse(cinema));
}
