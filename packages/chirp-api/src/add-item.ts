import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { ItemModel } from "./models/item";

const addItem: RequestHandlerDB<ItemModel> = async (req, res, Items) => {
    try {
        const { user, body } = req;

        if (!user) {
            throw new Error("Internal error");
        }

        const item = await Items.insertOne({
            ownerID: user.id,
            username: user.name,
            retweeted: 0,
            content: body.content,
            childType: body.childType,
            parentID: body.parent,
            timestamp: Math.round(Date.now() / 1000),
            media: body.media,
            property: {
                likes: 0
            }
        });

        res.send({
            status: "OK",
            id: item.insertedId.toHexString()
        } as ResponseSchema);
    } catch (e) {
        res.send({
            status: "error"
        } as ResponseSchema);
    }
};

export default addItem;
