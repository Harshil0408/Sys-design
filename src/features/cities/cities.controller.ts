import type { FastifyReply, FastifyRequest } from "fastify";
import type { CityListQuery } from "./cities.types.js";
import { citiesService } from "./cities.service.js";
import { successResponse, errorResponse } from "../../shared/utils/response.util.js";

export async function listCitiesHandler(
  request: FastifyRequest<{ Querystring: CityListQuery }>,
  reply: FastifyReply
): Promise<void> {
  const cities = await citiesService.getAllCities(request.query);
  reply.status(200).send(successResponse(cities, cities.length));
}

export async function getCityByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const city = await citiesService.getCityById(request.params.id);
  if (!city) {
    reply.status(404).send(errorResponse(`City with ID ${request.params.id} not found`, "CITY_NOT_FOUND"));
    return;
  }
  reply.status(200).send(successResponse(city));
}
