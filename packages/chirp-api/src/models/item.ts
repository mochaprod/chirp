import { MongoDocument } from "./mongo";

export enum ContentType {
    RETWEET = "RETWEET",
    REPLY = "REPLY"
}

export interface ItemModel extends MongoDocument {
    id: string;
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
        likedBy: string[];
    };
}

export interface LikesModel extends MongoDocument {
    ownerID: string;
    owner: string;
    itemID: string;
}
