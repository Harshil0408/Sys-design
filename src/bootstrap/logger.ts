import type { FastifyServerOptions } from "fastify";
import { env } from "../shared/config/env.js";

export function getLoggerConfig(): FastifyServerOptions["logger"] {
  if (env.env === "development") {
    return {
      level: env.logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname"
        }
      }
    };
  }
  return { level: env.logLevel };
}
