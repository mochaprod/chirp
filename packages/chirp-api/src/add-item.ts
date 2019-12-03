import shortid from "shortid";

import { ResponseSchema, RequestHandlerDB } from "./models/express";
import { ItemModel, ItemCoreModel, ContentType, MediaModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

const addItem: RequestHandlerDB<ItemModel, MediaModel> = async (
    req, res, Items, Media
) => {
    try {
        const { user, body: {
            childType,
            content,
            parent,
            media
        } } = req;

        if (!user || !Media) {
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
                const parentExists = await Items.findOne({
                    _id: parent
                });

                if (!parentExists) {
                    throw new Error("Parent doesn't exist!");
                }

                if (childType === ContentType.RETWEET) {
                    await elastic()
                        .update(
                            parent,
                            {
                                script: "ctx._source.retweeted += 1"
                            }
                        );

                    await Items.updateOne(
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

            const find = await Media
                .find({
                    _id: {
                        $in: media
                    },
                    owner: user.id,
                    used: false
                })
                .toArray();

            if (find.length !== mediaIDs.length) {
                throw new Error("Invalid media provided!");
            }

            await Media.updateMany(
                { _id: { $in: mediaIDs } },
                { $set: { used: true } }
            );
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

        await elastic().insert<ItemCoreModel>(
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
