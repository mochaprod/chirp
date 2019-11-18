import { Request, Response } from "express";

import { ResponseSchema } from "../../models/express";
import CassandraClient from "../../utils/cassandra";
import { respond } from "../../utils/response";

const addMedia = async (
    req: Request, res: Response, client: CassandraClient
) => {
    try {
        const { user } = req;

        if (!user) {
            throw new Error("[app.add-media] No user!");
        }

        const file: Buffer = req.file.buffer;
        const id = await client.insert(file);

        res.send({
            id: id.toString(),
            status: "OK"
        } as ResponseSchema);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addMedia;
