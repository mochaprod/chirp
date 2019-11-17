import { Request, Response } from "express";
import { ResponseSchema } from "../../models/express";
import { RequestParams } from "@elastic/elasticsearch";
import CassandraClient from "../../utils/cassandra";
import { respond } from "../../utils/response";

const addMedia = (req: Request, res: Response, client: CassandraClient) => {
    try {
        const { user } = req;

        if (!user) {
            throw new Error("[app.add-media] No user!");
        }

        let file: Buffer = req.file.buffer;
        let id = client.insert(file);

        res.send({
            id: id,
            status: "OK"
        } as ResponseSchema);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addMedia;
