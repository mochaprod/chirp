import { RequestHandlerDB } from "../models/express";
import { ItemPayload, ItemModel } from "../models/item";

import { respond } from "../utils/response";

const search: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    try {
        const { body: {
            limit: reqLimit, timestamp: reqTimestamp
        } } = req;

        if (typeof reqLimit !== "number" && reqLimit !== undefined) {
            throw new Error(`Limit value super incorrect!`);
        }

        if (reqLimit < 0) {
            throw new Error(`Limit value ${reqLimit} is malformed!`);
        }

        let limit;

        if (!reqLimit) {
            limit = 25;
        } else if (reqLimit > 100) {
            limit = 100;
        } else {
            limit = reqLimit;
        }

        if (
            (typeof reqTimestamp !== "number" && reqTimestamp !== undefined)
            || reqTimestamp < 0
        ) {
            throw new Error(`Timestamp value "${reqTimestamp}" is malformed!`);
        }

        const timestamp = reqTimestamp || Math.round(Date.now() / 1000);

        const items = await Items.find({
            timestamp: { $lte: timestamp },
        })
            .sort({
                timestamp: -1
            })
            .limit(limit)
            .map<ItemPayload>((result) => {
                const item: ItemPayload = {
                    id: result.id,
                    username: result.ownerName,
                    content: result.content,
                    childType: result.childType,
                    timestamp: result.timestamp,
                    retweeted: result.retweeted,
                    property: {
                        likes: result.likes
                    }
                };

                return item;
            })
            .toArray();

        res.send({
            status: "OK",
            items
        });
    } catch (e) {
        respond(res, e.message);
    }
};

export default search;
