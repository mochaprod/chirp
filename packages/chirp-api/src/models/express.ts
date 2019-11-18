import { Collection } from "mongodb";
import { Request, Response } from "express";

import CassandraClient from "../utils/cassandra";

export type RequestHandlerDB<P = any, S = any> = (
    req: Request,
    res: Response,
    collection: Collection<P>,
    optional?: Collection<S>
) => Promise<any> | void;

export type RequestHandlerCassandra<P = any> = (
    req: Request,
    res: Response,
    cassandra: CassandraClient,
    collection: Collection<P>
) => Promise<any> | void;

export interface ResponseSchema {
    status: "OK" | "error";
    error?: string;

    message?: string;

    [key: string]: any;
}
