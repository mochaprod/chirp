import { Item } from "./data";

export interface APIResponse {
    status: "OK" | "error";
    error?: string;
}

export interface UserAPIResponse extends APIResponse {
    name: string;
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
