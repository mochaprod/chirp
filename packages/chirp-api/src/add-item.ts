import shortid from "shortid";

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { ItemModel } from "./models/item";

const addItem: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    try {
        const { user, body } = req;

        if (!user) {
            throw new Error("Internal error");
        }

        const itemID = shortid.generate();

        await Items.insertOne({
            id: itemID,
            ownerID: user.id,
            username: user.name,
            retweeted: 0,
            content: body.content,
            childType: body.childType,
            parentID: body.parent,
            timestamp: Math.round(Date.now() / 1000),
            media: body.media,
            property: {
                likes: 0,
                likedBy: []
            }
        });

        res.send({
            status: "OK",
            id: itemID
        } as ResponseSchema);
    } catch (e) {
        res
            .status(500)
            .send({
                status: "error"
            } as ResponseSchema);
    }
};

export default addItem;
