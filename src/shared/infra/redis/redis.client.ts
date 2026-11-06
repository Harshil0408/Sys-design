export class RedisClientWrapper {
  private isConnected = false;

  async connect(host: string, port: number): Promise<void> {
    // Adapter for Redis connection (ioredis abstraction)
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

export const redisClient = new RedisClientWrapper();
