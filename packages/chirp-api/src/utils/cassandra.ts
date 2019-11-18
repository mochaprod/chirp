import cassandra from "cassandra-driver";

const INSERT_QUERY = "INSERT INTO images (id, image, used, user_id) VALUES (?, ?, false, ?);";
const SELECT_QUERY = "SELECT * FROM images WHERE id = ?";
const UPDATE_USED_QUERY = "UPDATE images SET used = true WHERE id = ?;";

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

    public async insert(userID: string, image: Buffer) {
        const id = this.Uuid.random();
        const params = [id, image, userID];
        await this.client.execute(INSERT_QUERY, params, { prepare: true });

        return id;
    }

    public async retrieve(id: string) {
        const params = [id];
        const results: cassandra.types.ResultSet = await this.client.execute(
            SELECT_QUERY, params, { prepare: true }
        );

        if (results.rowLength === 0) {
            return null;
        }

        const first = results.first();

        return {
            id: first.get("id"),
            image: first.get("image"),
            used: first.get("used") as boolean,
            user: first.get("user_id")
        };
    }

    public async setUsed(id: string) {
        const params = [id];
        await this.client.execute(UPDATE_USED_QUERY, params, { prepare: true });
        return true;
    }
}

export default CassandraClient;
