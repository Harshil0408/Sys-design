export class ElasticsearchWrapper {
  private isConnected = false;

  async init(nodeUrl: string): Promise<void> {
    // Adapter for Elasticsearch client initialization
    this.isConnected = true;
  }

  async search(index: string, query: string): Promise<unknown[]> {
    return [];
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

export const esClient = new ElasticsearchWrapper();
