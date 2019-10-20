import { RequestHandler } from "express";
import { removeUserCookie } from "./cookies/auth";
import { ResponseSchema } from "./models/express";

/**
 * Logged-in status checked by middleware
 */
const logout: RequestHandler = (_, res) => {
    removeUserCookie(res);

    res.send({
        status: "OK",
    } as ResponseSchema);
};

export default logout;
