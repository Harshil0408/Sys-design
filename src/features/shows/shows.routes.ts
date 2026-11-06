import type { FastifyInstance } from "fastify";
import { listShowsHandler, getShowByIdHandler } from "./shows.controller.js";

export async function showsRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/v1/shows",
    {
      schema: {
        tags: ["Shows"],
        summary: "List active movie shows",
        description: "Returns movie showtimes, formats, and pricing. Cached in Redis when queried by cinemaId.",
        querystring: {
          type: "object",
          properties: {
            cinemaId: { type: "string", description: "Filter by cinema ID (e.g. cine_pvr_phoenix)" },
            movieTitle: { type: "string", description: "Filter by movie name (e.g. Dune)" },
            format: { type: "string", description: "Filter by format (e.g. IMAX 2D, 4DX)" }
          }
        },
        response: {
          200: {
            description: "List of active shows",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    cinemaId: { type: "string" },
                    movieTitle: { type: "string" },
                    screenNumber: { type: "number" },
                    format: { type: "string" },
                    language: { type: "string" },
                    startTime: { type: "string" },
                    price: { type: "number" },
                    availableSeats: { type: "number" }
                  }
                }
              },
              meta: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  timestamp: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    listShowsHandler
  );

  app.get(
    "/api/v1/shows/:id",
    {
      schema: {
        tags: ["Shows"],
        summary: "Get show details and seat availability by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "Show ID (e.g. show_101)" }
          }
        },
        response: {
          200: {
            description: "Show details",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  cinemaId: { type: "string" },
                  movieTitle: { type: "string" },
                  screenNumber: { type: "number" },
                  format: { type: "string" },
                  language: { type: "string" },
                  startTime: { type: "string" },
                  price: { type: "number" },
                  availableSeats: { type: "number" }
                }
              }
            }
          },
          404: {
            description: "Show not found",
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    getShowByIdHandler
  );
}
