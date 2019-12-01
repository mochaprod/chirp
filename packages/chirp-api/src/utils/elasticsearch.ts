import elasticsearch from "@elastic/elasticsearch";
import { splitURLs } from "./env";

export interface SearchOptions {
    size: number;
    must: any[];
    mustNot: any[];
    filter: any[];
    sort: any[];
}

class ElasticChirpClient {
    private client: elasticsearch.Client;
    private index: string;

    constructor() {
        const { ELASTICSEARCH, ELASTIC_INDEX } = process.env;

        if (!ELASTIC_INDEX || !ELASTICSEARCH) {
            throw new Error("Elasticsearch not configured in app.");
        }

        const ips = splitURLs(ELASTICSEARCH);

        this.client = new elasticsearch.Client({
            nodes: ips
        });
        this.index = ELASTIC_INDEX;
    }

    public instance() {
        return this.client;
    }

    public async search(config: SearchOptions) {
        const {
            must,
            filter,
            sort,
        } = config;

        if (must.length === 0) {
            must.push({
                match_all: {}
            });
        }

        return this.client
            .search({
                index: this.index,
                body: {
                    size: config.size,
                    sort,
                    query: {
                        bool: {
                            must,
                            filter
                        }
                    }
                }
            });
    }

    public async searchHits(options: SearchOptions) {
        const response = await this.search(options);
    }

    public async insert<T>(id: string, body: T) {
        return this.client
            .index({
                index: this.index,
                id,
                body
            });
    }

    public async update<T>(id: string, body: Partial<T>) {
        return this.client
            .update({
                index: this.index,
                id,
                body
            });
    }

    public async delete(id: string) {
        return this.client
            .delete({
                index: this.index,
                id
            });
    }

    public async deleteAll() {
        return this.client
            .deleteByQuery({
                index: this.index,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            });
    }
}

function createElasticClient() {
    let client: ElasticChirpClient | null = null;

    return () => {
        if (!client) {
            client = new ElasticChirpClient();
        }

        return client;
    };
}

export default createElasticClient();
