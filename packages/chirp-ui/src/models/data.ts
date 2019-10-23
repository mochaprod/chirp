export interface Item {
    id: string;
    username: string;
    property: {
        likes: number;
    };
    retweeted: number;
    content: string;
    timestamp: number;
}
