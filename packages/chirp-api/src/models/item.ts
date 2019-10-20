import { ObjectId } from "mongodb";

export enum ContentType {
    RETWEET = "RETWEET",
    REPLY = "REPLY"
}

export interface ItemModel {
    _id: ObjectId;
    id?: string;
    content: string;
    childType?: ContentType | null;
    parentID?: string;
    media?: string[];
    timestamp: number;
    ownerID: string;
    username: string;
    retweeted: number;
    property: {
        likes: number;
    };
}
