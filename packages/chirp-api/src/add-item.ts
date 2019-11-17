import shortid from "shortid";

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { ItemModel, ItemCoreModel, ContentType } from "./models/item";

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

        if (
            childType === ContentType.RETWEET
            || childType === ContentType.REPLY
        ) {
            if (parent) {
                await Items.update(
                    { _id: parent },
                    { $inc: {
                        retweeted: 1
                    } }
                );
            } else {
                throw new Error("No parent for reply/retweet");
            }
        }

        const itemID = shortid.generate();
        const timestamp = Math.round(Date.now() / 1000);

        const item: ItemCoreModel = {
            childType: childType || null,
            ownerID: user.id,
            ownerName: user.name,
            timestamp,
            content,
            parentID: parent,
            retweeted: 0,
            likes: 0
        };

        await elastic().insert<ItemCoreModel>(
            itemID,
            item
        );

        await Items.insertOne({
            ...item,
            _id: itemID,
            media,
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
