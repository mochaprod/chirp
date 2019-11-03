import shortid from "shortid";

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { ItemModel, ItemCoreModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

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
        const timestamp = Math.round(Date.now() / 1000);

        const item: ItemCoreModel = {
            id: itemID,
            childType: childType || null,
            ownerID: user.id,
            ownerName: user.name,
            timestamp,
            content,
            parentID: parent || null
        };

        await elastic().insert<ItemCoreModel>(
            itemID,
            item
        );

        await Items.insertOne({
            ...item,
            retweeted: 0,
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
