import { Db, Collection } from "mongodb";

import { UserModel } from "../models/user";
import { ItemModel } from "../models/item";

export interface Collections {
    Users: Collection<UserModel>;
    Items: Collection<ItemModel>;
}

const connect = (db: Db) => {
    return {
        Users: db.collection<UserModel>("users"),
        Items: db.collection<ItemModel>("items")
    } as Collections;
};

export default connect;
