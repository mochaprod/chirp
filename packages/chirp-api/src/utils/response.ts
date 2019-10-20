import { Response } from "express";
import { ResponseSchema } from "../models/express";

export const respond = (res: Response, error?: string, more: object = {}) => {
    res
        .status(error ? 500 : 200)
        .send({
            status: error ? "error" : "OK",
            error,
            ...more
        } as ResponseSchema);
};
