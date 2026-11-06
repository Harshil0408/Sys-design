import type { FastifyInstance } from "fastify";
import { esClient } from "../shared/infra/elasticsearch/es.client.js";
import { env } from "../shared/config/env.js";

export async function bootstrapElasticsearch(app: FastifyInstance): Promise<void> {
  app.log.info({ node: env.elasticsearch.node }, "Initializing Elasticsearch client...");
  await esClient.init(env.elasticsearch.node);
}
