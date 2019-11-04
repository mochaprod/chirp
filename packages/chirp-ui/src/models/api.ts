import { Item, UserDetails } from "./data";

export interface APIResponse {
    status: "OK" | "error";
    error?: string;
}

export interface UserAPIResponse extends APIResponse {
    name: string;
}

export interface UserDetailsAPIResponse extends APIResponse {
    user: UserDetails;
}

export interface UserPostsAPIResponse extends APIResponse {
    items: string[];
}

export interface UserConnectionsAPIResponse extends APIResponse {
    users: string[];
}

export interface LoginAPIResponse extends APIResponse {
    token?: string;
}

export interface InsertItemAPIResponse extends APIResponse {
    id: string;
}

export interface ItemAPIResponse extends APIResponse {
    item: Item;
}

export interface SearchAPIResponse extends APIResponse {
    items: Item[];
}
