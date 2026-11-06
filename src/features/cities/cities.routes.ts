import type { FastifyInstance } from "fastify";
import { listCitiesHandler, getCityByIdHandler } from "./cities.controller.js";

export async function citiesRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/v1/cities",
    {
      schema: {
        tags: ["Cities"],
        summary: "List all available cities",
        description: "Returns list of active cities. Cached in Redis for 10 minutes.",
        querystring: {
          type: "object",
          properties: {
            state: { type: "string", description: "Filter cities by state (e.g. Maharashtra, Gujarat)" },
            search: { type: "string", description: "Search keyword matching name or slug" }
          }
        },
        response: {
          200: {
            description: "Successful cities listing",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    slug: { type: "string" },
                    state: { type: "string" },
                    isActive: { type: "boolean" }
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
    listCitiesHandler
  );

  app.get(
    "/api/v1/cities/:id",
    {
      schema: {
        tags: ["Cities"],
        summary: "Get city by unique ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "City ID (e.g. city_mumbai)" }
          }
        },
        response: {
          200: {
            description: "City details",
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  slug: { type: "string" },
                  state: { type: "string" },
                  isActive: { type: "boolean" }
                }
              }
            }
          },
          404: {
            description: "City not found",
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
    getCityByIdHandler
  );
}
