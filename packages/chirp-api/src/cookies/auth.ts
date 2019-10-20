import jwt from "jsonwebtoken";
import { Response, Request, RequestHandler } from "express";
import { ResponseSchema } from "../models/express";

const SECRET =
    "e56d36e0607ff48f06afc2d8d0cbee974b425ee6e377dfc0c057d144adcf9ac6bdaee569f89a3b064acdd6146206426c";

export const removeUserCookie = (response: Response) => {
    response.clearCookie("session");
};

export const setUserCookie = (response: Response, username: string) => {
    response.cookie(
        "session",
        jwt.sign(
            {
                username
            },
            SECRET
        ),
        {
            maxAge: 60 * 60 * 24 * 7
        }
    );
};

export const validateUserCookie = (request: Request, response?: Response) => {
    const { cookies } = request;

    if (!cookies) {
        return {
            valid: false
        };
    }

    const { session } = cookies;

    if (session) {
        try {
            const decoded = jwt.verify(session, SECRET);

            return {
                valid: true,
                decoded
            };
        } catch (e) {
            // Clear cookie on failure

            if (response) {
                removeUserCookie(response);
            }
        }
    }

    return {
        valid: false
    };
};

export const ifLoggedInMiddleware: RequestHandler = (req, res, next) => {
    const { valid } = validateUserCookie(req);

    if (!valid) {
        res.send({
            status: "error",
            message: "You're not logged in!"
        } as ResponseSchema);
    } else {
        next();
    }
};
