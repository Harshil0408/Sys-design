import type { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function bootstrapSwagger(app: FastifyInstance): Promise<void> {
  // 1. Register Swagger core generator
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "BookMyShow Backend API",
        description: "High-scale system design architecture prototype for BookMyShow built with Fastify & TypeScript",
        version: "1.0.0"
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development server"
        }
      ],
      tags: [
        { name: "Health", description: "Health check and system status endpoints" },
        { name: "Cities", description: "City browsing and location services" },
        { name: "Cinemas", description: "Theaters and cinema screen listings" },
        { name: "Shows", description: "Movie showtimes, pricing, and available seats" }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  });

  // 2. Register Swagger UI on /docs
  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    },
    staticCSP: false
  });

  app.log.info("📖 Swagger documentation registered at /docs");
}
