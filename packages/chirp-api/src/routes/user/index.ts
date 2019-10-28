import { Router, Response, Request, NextFunction } from "express";

import { Collections } from "../../db/database";
import { loggedInOnly } from "../../cookies/auth";
import { respond } from "../../utils/response";

import root from "./root";
import posts from "./posts";
import followers from "./followers";
import following from "./following";

function createUserRouter(
    request: Request,
    response: Response,
    next: NextFunction,
    collections: Collections
) {
    const userRouter = Router();

    userRouter.get("/", loggedInOnly());
    userRouter.get("/", (req, res) => {
        const { user } = req;

        if (user) {
            respond(
                res,
                undefined,
                { name: user.name }
            );
        } else {
            respond(
                res,
                "Internal error!"
            );
        }
    });

    userRouter.get("/:user", (req, res) => root(
        req, res, collections.Follows, collections.Users
    ));
    userRouter.get("/:user/posts", (req, res) => posts(
        req, res, collections.Items
    ));
    userRouter.get("/:user/followers", (req, res) => followers(
        req, res, collections.Follows
    ));
    userRouter.get("/:user/following", (req, res) => following(
        req, res, collections.Follows
    ));

    return userRouter(request, response, next);
}

export default createUserRouter;
