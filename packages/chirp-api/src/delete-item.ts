import { RequestHandlerDB } from "./models/express";
import { ItemModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

const deleteItem: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    const {
        user,
        params: {
            id
        }
    } = req;

    try {
        if (!user) {
            throw new Error("[app.delete] Internal error!");
        }

        const { deletedCount } = await Items.deleteOne({
            _id: id,
            ownerName: user.name
        });

        if (deletedCount && deletedCount === 1) {
            await elastic().delete(id);

            respond(res);
        } else {
            throw new Error(`Item ${id} belonging to ${user.name} not found.`);
        }
    } catch (e) {
        respond(
            res,
            e.message
        );
    }
};

export default deleteItem;
