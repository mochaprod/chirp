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
            following: reqFollowing,
            rank: reqRank,
            parent: reqParent,
            replies: reqReplies,
            hasMedia: reqHasMedia
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
        const sort: any[] = [];

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
                .map(({ follows }) => follows.toLowerCase())
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

        if (reqRank === "time") {
            sort.push({
                timestamp: { order: "desc" }
            });
        }

        if (reqParent && reqReplies !== false) {
            must.push({
                match: {
                    parentID: reqParent
                }
            });
        }

        if (reqReplies === false) {
            mustNot.push({
                match: {
                    childType: "reply"
                }
            });
        }

        if (reqHasMedia) {
            must.push({
                exists: {
                    field: "media"
                }
            });
        }

        const { body } = await elastic().search({
            size: limit,
            must,
            filter,
            mustNot,
            sort
        });

        const hits = body.hits.hits as any[];
        let items = hits
            .map(({
                _id: id,
                _source: {
                    childType,
                    timestamp: time,
                    content,
                    ownerName: username,
                    retweeted,
                    likes,
                    parentID,
                    media
                }
            }) => ({
                id, childType, time, username, content, retweeted, media,
                parent: parentID,
                property: {
                    likes
                }
            }));

        if (reqRank !== "time") {
            items = items.sort((
                { retweeted: retweetedA, property: { likes: likesA } },
                { retweeted: retweetedB, property: { likes: likesB } }
            ) => {
                const val = retweetedB + likesB - retweetedA + likesA;

                return val;
            });
        }

        // MongoClient.find using an array of ids does not guarantee order!
        // Change query if order is a requirement.
        res.send({
            status: "OK",
            items
        });
    } catch (e) {
        respond(res, e.message);
    }
};

export default search;
