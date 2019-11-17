import { RequestHandlerDB } from "./models/express";
import { ItemModel, LikesModel } from "./models/item";

import { respond } from "./utils/response";

const like: RequestHandlerDB<ItemModel, LikesModel> = async (
    req, res, Items, Likes
) => {
    const {
        user,
        params: {
            id
        },
        body: {
            like: bodyLike
        }
    } = req;

    try {
        if (!Likes || !user) {
            throw new Error("[app.like] Internal error");
        }

        const result = await Items.findOne({
            itemID: id,
            ownerID: user.id,
        });

        if (!result) {
            throw new Error(`Item ${id} doesn't exist!`);
        }

        const liked = await Likes.findOne({
            itemID: id,
            owner: user.name
        });

        if (bodyLike) {
            if (liked) {
                throw new Error("Already liked!");
            } else {
                await Likes.insert({
                    itemID: id,
                    owner: user.name,
                    ownerID: user.id
                });

                await Items.update(
                    { _id: id },
                    { $inc: { likes: 1 } }
                );
            }
        } else {
            if (!liked) {
                throw new Error("Already not liked!");
            } else {
                await Likes.deleteOne({
                    itemID: id,
                    ownerID: user.id
                });

                await Items.update(
                    { _id: id },
                    { $inc: { likes: -1 } }
                );
            }
        }

        respond(res);
    } catch (e) {
        respond(res, e.message);
    }
};

export default like;
