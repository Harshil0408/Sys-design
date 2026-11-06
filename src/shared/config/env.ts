import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  env: string;
  port: number;
  host: string;
  logLevel: string;
  jwtSecret: string;
  redis: {
    host: string;
    port: number;
  };
  elasticsearch: {
    node: string;
  };
}

export const env: AppConfig = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret-key-123456",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10)
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200"
  }
};
