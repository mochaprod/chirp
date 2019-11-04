import { RequestHandlerDB } from "../../models/express";
import { ItemModel } from "../../models/item";
import { respond } from "../../utils/response";

const posts: RequestHandlerDB<ItemModel> = async (
    req, res, Items
) => {
    const {
        params: { user },
        query: { limit: requestLimit }
    } = req;

    try {
        if (!user) {
            throw new Error("User provided is malformed.");
        }

        const limit = Number(requestLimit);

        // Check if user exists?

        const items = await Items
            .find({ ownerName: user })
            .limit(limit)
            .map(({ _id: id }) => id)
            .toArray();

        respond(
            res,
            undefined,
            { items }
        );
    } catch (e) {
        respond(res, e.message);
    }
};

export default posts;
