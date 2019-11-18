import { Request, Response } from "express";

import CassandraClient from "../../utils/cassandra";
import { respond } from "../../utils/response";

const media = async (req: Request, res: Response, client: CassandraClient) => {
    try {
        const {
            params: {
                id
            }
        } = req;

        const find = await client.retrieve(id);

        if (!find) {
            throw new Error(`Media ${id} not found!`);
        }

        res.send(find.image);
    } catch (e) {
        respond(res, e.message, {}, 404);
    }
};

export default media;
