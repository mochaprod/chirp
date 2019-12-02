import { RequestHandlerCassandra } from "./models/express";
import { ItemModel, MediaModel } from "./models/item";

import { respond } from "./utils/response";
import elastic from "./utils/elasticsearch";

const deleteItem: RequestHandlerCassandra<ItemModel, MediaModel> = async (
    req, res, cassandra, Items, Media
) => {
    const {
        user,
        params: {
            id
        }
    } = req;

    try {
        if (!user || !Media) {
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
                await Media.deleteMany({
                    _id: { $in: found.media }
                });

                await Promise.all(
                    found.media.map((mediaID) => cassandra.delete(mediaID))
                );
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
