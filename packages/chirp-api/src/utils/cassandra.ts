import cassandra from "cassandra-driver";

const INSERT_QUERY = "INSERT INTO images (id, image, used, user_id) VALUES (?, ?, false, ?);"
const SELECT_QUERY = "SELECT image FROM images WHERE id = ?";

class CassandraClient {
    private client: cassandra.Client;
    private Uuid: typeof cassandra.types.Uuid;

    constructor() {
        const { CASSANDRA } = process.env;

        if (!CASSANDRA) {
            throw new Error("Cassandra failed to connect");
        }

        const URLS = CASSANDRA
            .split(",")
            .map((ip) => ip.trim());
        const KEYSPACE = "chirp";
        const DATACENTER = "datacenter1";

        this.client = new cassandra.Client({
            contactPoints: URLS,
            localDataCenter: DATACENTER,
            keyspace: KEYSPACE
        });

        this.client.connect((err) => {
            console.log("Connected to Cassandra!");
        });

        this.Uuid = cassandra.types.Uuid;
    }

    public async insert(user_id: String, image: Buffer) {
        const id = this.Uuid.random();
        const params = [id, image, user_id];
        await this.client.execute(INSERT_QUERY, params, { prepare: true });

        return id;
    }

    public async retrieve(id: string) {
        const params = [id];
        const results: cassandra.types.ResultSet = await this.client.execute(SELECT_QUERY, params, { prepare: true });

        return results.first().get("image");
    }
}

export default CassandraClient;
