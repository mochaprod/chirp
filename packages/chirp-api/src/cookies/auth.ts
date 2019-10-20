import jwt from "jsonwebtoken";
import { Response, RequestHandler } from "express";

import { CookieValidator, UserCookieContent } from "../models/user";

import { respond } from "../utils/response";

const SECRET =
    "e56d36e0607ff48f06afc2d8d0cbee974b425ee6e377dfc0c057d144adcf9ac6bdaee569f89a3b064acdd6146206426c";

export const removeUserCookie = (response: Response) => {
    response.clearCookie("session");
};

export const setUserCookie = (
    response: Response,
    id: string,
    username: string
) => {
    response.cookie(
        "session",
        jwt.sign(
            {
                id,
                username
            },
            SECRET
        ),
        {
            maxAge: 60 * 60 * 24 * 7
        }
    );
};

export const validateUserCookie: CookieValidator = (
    request,
    response
) => {
    let invalidated = false;
    const { cookies } = request;

    if (!cookies) {
        return {
            valid: false,
            invalidated
        };
    }

    const { session } = cookies;

    if (session) {
        try {
            const decoded = jwt.verify(session, SECRET) as UserCookieContent;

            return {
                valid: true,
                invalidated,
                decoded
            };
        } catch (e) {
            // Clear cookie on failure

            if (response) {
                invalidated = true;

                removeUserCookie(response);
            }
        }
    }

    return {
        valid: false,
        invalidated
    };
};

export const ifLoggedInMiddleware: RequestHandler = (req, res, next) => {
    const { valid, invalidated, decoded } = validateUserCookie(req);

    try {
        if (!valid) {
            if (invalidated) {
                throw Error("Failed to verify user credentials!");
            }

            throw new Error("You're not logged in!");
        } else {
            if (!decoded) {
                throw new Error("Failed to verify");
            }

            const user = {
                id: decoded.id,
                name: decoded.username,
            };

            req.user = user;

            next();
        }
    } catch (e) {
        respond(res, e.message);
    }
};
