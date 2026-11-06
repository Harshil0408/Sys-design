export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  services: {
    redis: boolean;
    elasticsearch: boolean;
    database: boolean;
  };
}
