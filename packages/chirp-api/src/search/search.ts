import { FilterQuery } from "mongodb";

import { RequestHandlerDB } from "../models/express";
import { ItemPayload, ItemModel } from "../models/item";

import { respond } from "../utils/response";
import { FollowsModel } from "../models/user";

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
        const query: FilterQuery<ItemModel> = {
            timestamp: { $lte: timestamp }
        };

        if (reqUsername) {
            query.ownerName = reqUsername;
        }

        const result = await Items
            .find(query)
            .sort({
                timestamp: -1
            })
            .map<ItemPayload>((payload) => {
                const item: ItemPayload = {
                    id: payload.id,
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

        // Application-level queries

        let items = result;

        if (reqFollowing) {
            const { user } = req;

            if (!user) {
                throw new Error("You aren't logged in for this query!");
            }

            const usersFollowing = await Follows
                .find({ user: user.name })
                .map(({ follows }) => follows)
                .toArray();

            items = items
                .filter(({ username }) => usersFollowing.includes(username));
        }

        if (reqQuery) {
            items = result
                .filter(({ content }) => content.startsWith(reqQuery));
        }

        items = items.slice(0, limit);

        res.send({
            status: "OK",
            items
        });
    } catch (e) {
        respond(res, e.message);
    }
};

export default search;
