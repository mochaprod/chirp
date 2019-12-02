import shortid from "shortid";

import { ResponseSchema, RequestHandlerCassandra } from "./models/express";
import { ItemModel, ItemCoreModel, ContentType } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

const addItem: RequestHandlerCassandra<ItemModel> = async (
    req, res, cassandra, Items
) => {
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
                if (childType === ContentType.RETWEET) {
                    elastic()
                        .update(
                            parent,
                            {
                                script: "ctx._source.retweeted += 1"
                            }
                        );

                    Items.updateOne(
                        { _id: parent },
                        { $inc: {
                            retweeted: 1
                        } }
                    );
                }
            } else {
                throw new Error("No parent for reply/retweet!");
            }
        }

        if (media) {
            const mediaIDs = media as string[];

            for (const mediaID of mediaIDs) {
                const find = await cassandra.retrieveMetaData(mediaID);

                if (!find) {
                    throw new Error(`Media ${mediaID} does not exist!`);
                } else if (find.user !== user.id) {
                    throw new Error(`Media ${mediaID} does not belong to you!`);
                } else if (find.used) {
                    throw new Error(`Media ${mediaID} already in use!`);
                } else {
                    await cassandra.setUsed(mediaID);
                }
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
            likes: 0,
            media
        };

        elastic().insert<ItemCoreModel>(
            itemID,
            item
        );

        await Items.insertOne({
            ...item,
            _id: itemID,
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
