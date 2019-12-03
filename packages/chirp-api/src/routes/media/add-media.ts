import { MediaModel } from "../../models/item";

import { ResponseSchema, RequestHandlerCassandra } from "../../models/express";
import { respond } from "../../utils/response";

const addMedia: RequestHandlerCassandra<MediaModel> = async (
    req, res, client, Media
) => {
    try {
        const { user } = req;

        if (!user) {
            throw new Error("[app.add-media] No user!");
        }

        const file: Buffer = req.file.buffer;
        const id = await client.insert(user.id, file);
        await Media.insertOne({
            _id: id.toString(),
            owner: user.id,
            used: false
        });

        res.send({
            status: "OK",
            id: id.toString()
        } as ResponseSchema);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addMedia;
