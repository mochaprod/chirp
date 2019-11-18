import { Response } from "express";
import { ResponseSchema } from "../models/express";

export const respond = (res: Response, error?: string, more: object = {}, errorCode: number = 500) => {
    res
        .status(error ? errorCode : 200)
        .send({
            status: error ? "error" : "OK",
            error,
            ...more
        } as ResponseSchema);
};
