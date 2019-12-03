import { RequestHandlerDB } from "./models/express";
import { ItemModel, LikesModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

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

        const likeAction = bodyLike === undefined
            ? true
            : bodyLike;

        const result = await Items.countDocuments({
            _id: id
        });

        if (result <= 0) {
            throw new Error(`Item ${id} doesn't exist!`);
        }

        const liked = await Likes.findOne({
            itemID: id,
            owner: user.name
        });

        if (likeAction) {
            if (liked) {
                throw new Error("Already liked!");
            } else {
                await Likes.insertOne({
                    itemID: id,
                    owner: user.name,
                    ownerID: user.id
                });

                await Items.updateOne(
                    { _id: id },
                    { $inc: { likes: 1 } }
                );

                await elastic()
                    .update(
                        id,
                        {
                            script: "ctx._source.likes += 1"
                        }
                    );
            }
        } else {
            if (!liked) {
                throw new Error("Already not liked!");
            } else {
                await Likes.deleteOne({
                    _id: liked._id
                });

                await Items.updateOne(
                    { _id: id },
                    { $inc: { likes: -1 } }
                );

                await elastic()
                    .update(
                        id,
                        {
                            script: "ctx._source.likes -= 1"
                        }
                    );
            }
        }

        respond(res);
    } catch (e) {
        respond(res, e.message);
    }
};

export default like;
