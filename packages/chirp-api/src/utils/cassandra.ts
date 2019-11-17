import cassandra from "cassandra-driver";

const INSERT_QUERY = "INSERT INTO images (id, image) VALUES (?, ?)";
const SELECT_QUERY = "SELECT image FROM images WHERE id = ?";

class CassandraClient {
    private client: cassandra.Client;
    private Uuid: typeof cassandra.types.Uuid;

    constructor() {
        const URLS = ['209.50.57.107', '209.50.53.26'];
        const KEYSPACE = 'chirp';
        const DATACENTER = 'datacenter1';

        this.client = new cassandra.Client({
          contactPoints: URLS,
          localDataCenter: DATACENTER,
          keyspace: KEYSPACE
        });

        this.client.connect((err) => {
          console.log('Connected to Cassandra!');
        });

        this.Uuid = cassandra.types.Uuid;
    }

    public async insert(image: Buffer) {
      const id = this.Uuid.random();
      const params = [id, image];
      await this.client.execute(INSERT_QUERY, params, { prepare: true });
      return id;
    }

    public async retrieve(id: String) {
      const params = [id];
      const results: cassandra.types.ResultSet = await this.client.execute(SELECT_QUERY, params, { prepare: true });
      return results.first().get("image");
    }
}


export default CassandraClient;
