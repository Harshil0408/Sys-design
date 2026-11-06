import type { FastifyInstance } from "fastify";
import { listCinemasHandler, getCinemaByIdHandler } from "./cinemas.controller.js";

export async function cinemasRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/v1/cinemas",
    {
      schema: {
        tags: ["Cinemas"],
        summary: "List cinemas / theaters",
        description: "Returns list of theaters matching cityId or search keyword.",
        querystring: {
          type: "object",
          properties: {
            cityId: { type: "string", description: "Filter by city ID (e.g. city_mumbai)" },
            search: { type: "string", description: "Search by cinema name or location" }
          }
        },
        response: {
          200: {
            description: "List of cinemas",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    cityId: { type: "string" },
                    name: { type: "string" },
                    location: { type: "string" },
                    totalScreens: { type: "number" }
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
    listCinemasHandler
  );

  app.get(
    "/api/v1/cinemas/:id",
    {
      schema: {
        tags: ["Cinemas"],
        summary: "Get cinema details by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "Cinema ID (e.g. cine_pvr_phoenix)" }
          }
        },
        response: {
          200: {
            description: "Cinema details",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  cityId: { type: "string" },
                  name: { type: "string" },
                  location: { type: "string" },
                  totalScreens: { type: "number" }
                }
              }
            }
          },
          404: {
            description: "Cinema not found",
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
    getCinemaByIdHandler
  );
}
