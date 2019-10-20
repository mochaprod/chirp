import { Collection } from "mongodb";
import { Request, Response } from "express";

export type RequestHandlerDB<P = any> = (
    req: Request,
    res: Response,
    collection: Collection<P>
) => Promise<any>;

export interface ResponseSchema {
    status: "OK" | "error";
    error?: string;

    message?: string;

    [key: string]: any;
}
