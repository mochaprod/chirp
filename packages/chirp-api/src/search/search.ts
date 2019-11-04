import { RequestHandlerDB } from "../models/express";
import { ItemPayload, ItemModel } from "../models/item";
import { FollowsModel } from "../models/user";

import { respond } from "../utils/response";
import elastic from "../utils/elasticsearch";
import { validateUserCookie } from "../cookies/auth";

const search: RequestHandlerDB<ItemModel, FollowsModel> = async (req, res, Items, Follows) => {
    try {
        if (!Follows) {
            throw new Error("Internal error: could not connect to users table!");
        }

        const { body: {
            limit: reqLimit,
            timestamp: reqTimestamp,
            q: reqQuery,
            username: reqUsername,
            following: reqFollowing
        } } = req;

        if (typeof reqLimit !== "number" && reqLimit !== undefined) {
            throw new Error(`Limit value super incorrect!`);
        }

        if (reqLimit < 0) {
            throw new Error(`Limit value ${reqLimit} is malformed!`);
        }

        let limit: number;

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

        const timestamp = Number(reqTimestamp) || Math.round(Date.now() / 1000);
        const must: any[] = [];
        const filter: any[] = [];
        const mustNot: any[] = [];

        if (reqQuery) {
            must.push({
                match: {
                    content: reqQuery
                }
            });
        }

        if (reqUsername) {
            must.push({
                match: {
                    ownerName: reqUsername
                }
            });
        }

        if (reqFollowing !== false) {
            const { valid, decoded } = validateUserCookie(req);

            if (!valid || !decoded) {
                throw new Error("You aren't logged in for this query!");
            }

            const usersFollowing = await Follows
                .find({ user: decoded.username })
                .map(({ follows }) => follows)
                .toArray();

            filter.push({
                terms: {
                    ownerName: usersFollowing
                }
            });
        }

        filter.push({
            range: {
                timestamp: {
                    lte: timestamp
                }
            }
        });

        const { body } = await elastic().search({
            size: limit,
            must,
            filter,
            mustNot
        });

        const hits = body.hits.hits as any[];
        const ids = hits.map(({ _id: id }) => id);

        // MongoClient.find using an array of ids does not guarantee order!
        // Change query if order is a requirement.
        const items = await Items
            .find({
                _id: {
                    $in: ids
                }
            })
            .map((payload) => {
                const item: ItemPayload = {
                    id: payload._id,
                    username: payload.ownerName,
                    content: payload.content,
                    childType: payload.childType,
                    timestamp: payload.timestamp,
                    retweeted: payload.retweeted,
                    property: {
                        likes: payload.likes
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
