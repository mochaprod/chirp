import { RequestHandlerDB } from "./models/express";
import { ItemModel } from "./models/item";

import { respond } from "./utils/response";

const deleteItem: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    const { params: {
        id
    } } = req;

    try {
        const { deletedCount } = await Items.deleteOne({ id });

        if (deletedCount && deletedCount === 1) {
            respond(res);
        } else {
            throw new Error(`Item ${id} not found.`);
        }
    } catch (e) {
        respond(
            res,
            e.message
        );
    }
};

export default deleteItem;
