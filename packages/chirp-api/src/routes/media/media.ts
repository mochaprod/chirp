import { Request, Response } from "express";
import { ResponseSchema } from "../../models/express";
import { RequestParams } from "@elastic/elasticsearch";
import CassandraClient from "../../utils/cassandra";
import { respond } from "../../utils/response";

const media = (req: Request, res: Response, client: CassandraClient) => {
    try {
        const {
            params: {
                id
            }
        } = req;

        const image = client.retrieve(id);
        res.send(image);
    } catch (e) {
      respond(res, e.message);
    }
};

export default media;
