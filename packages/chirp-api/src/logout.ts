import { RequestHandler } from "express";

import { removeUserCookie } from "./cookies/auth";
import { respond } from "./utils/response";

/**
 * Logged-in status checked by middleware
 */
const logout: RequestHandler = (_, res) => {
    removeUserCookie(res);
    respond(res);
};

export default logout;
