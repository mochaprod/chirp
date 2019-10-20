import { Db, Collection } from "mongodb";

import { UserModel } from "../models/user";

export interface Collections {
    Users: Collection<UserModel>;
    Items: Collection;
}

const connect = (db: Db) => {
    return {
        Users: db.collection<UserModel>("users"),
        Items: db.collection("items")
    } as Collections;
};

export default connect;
