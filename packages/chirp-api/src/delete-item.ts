import { RequestHandlerDB, RequestHandlerCassandra } from "./models/express";
import { ItemModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

const deleteItem: RequestHandlerCassandra<ItemModel> = async (
    req, res, cassandra, Items
) => {
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

        const found = await Items.findOne({
            _id: id,
            ownerName: user.name
        });

        if (found) {
            await Items.deleteOne({ _id: found._id });
            await elastic().delete(id);

            if (found.media) {
                for (const file of found.media) {
                    await cassandra.delete(file);
                }
            }

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
