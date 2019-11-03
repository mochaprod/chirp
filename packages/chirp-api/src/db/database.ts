import { Db, Collection } from "mongodb";

import { UserModel, FollowsModel } from "../models/user";
import { ItemModel, LikesModel } from "../models/item";

export interface Collections {
    Users: Collection<UserModel>;
    Items: Collection<ItemModel>;
    Follows: Collection<FollowsModel>;
}

const connect = (db: Db) => {
    return {
        Users: db.collection<UserModel>("users"),
        Items: db.collection<ItemModel>("items"),
        Follows: db.collection<FollowsModel>("follows")
    } as Collections;
};

export default connect;
