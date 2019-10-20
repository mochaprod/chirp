import { RequestHandlerDB } from "./models/express";
import { ItemModel } from "./models/item";

import { respond } from "./utils/response";

const like: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    const { user, params: id } = req;

    try {
        if (!user) {
            throw new Error("Internal error [LIKES]");
        }

        const result = await Items.findOne({
            itemID: id,
            ownerID: user.id
        });

        if (result) {
        }
    } catch (e) {
        respond(res, e.message);
    }
};

export default like;
