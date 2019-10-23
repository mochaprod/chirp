import shortid from "shortid";

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { ItemModel } from "./models/item";

import { respond } from "./utils/response";

const addItem: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    try {
        const { user, body: {
            childType,
            content,
            parent,
            media
        } } = req;

        if (!user) {
            throw new Error("Internal error!");
        }

        if (!content) {
            throw new Error("No content was provided!");
        }

        const itemID = shortid.generate();

        await Items.insertOne({
            id: itemID,
            ownerID: user.id,
            ownerName: user.name,
            retweeted: 0,
            content,
            childType,
            parentID: parent,
            timestamp: Math.round(Date.now() / 1000),
            media,
            likes: 0,
            likedBy: []
        });

        res.send({
            status: "OK",
            id: itemID
        } as ResponseSchema);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addItem;
