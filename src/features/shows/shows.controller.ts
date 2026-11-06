import type { FastifyReply, FastifyRequest } from "fastify";
import type { ShowListQuery } from "./shows.types.js";
import { showsService } from "./shows.service.js";
import { successResponse, errorResponse } from "../../shared/utils/response.util.js";

export async function listShowsHandler(
  request: FastifyRequest<{ Querystring: ShowListQuery }>,
  reply: FastifyReply
): Promise<void> {
  const shows = await showsService.getShows(request.query);
  reply.status(200).send(successResponse(shows, shows.length));
}

export async function getShowByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const show = await showsService.getShowById(request.params.id);
  if (!show) {
    reply.status(404).send(errorResponse(`Show with ID ${request.params.id} not found`, "SHOW_NOT_FOUND"));
    return;
  }
  reply.status(200).send(successResponse(show));
}
