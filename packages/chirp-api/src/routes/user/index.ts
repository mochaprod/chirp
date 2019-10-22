import { Router, Response, Request, NextFunction } from "express";

import { Collections } from "../../db/database";

import root from "./root";

function createUserRouter(
    request: Request,
    response: Response,
    next: NextFunction,
    collections: Collections
) {
    const userRouter = Router();

    userRouter.get("/:user", (req, res) => root(
        req, res, collections.Follows, collections.Users
    ));
    userRouter.get("/:user/posts");
    userRouter.get("/:user/followers");
    userRouter.get("/:user/following");

    return userRouter(request, response, next);
}

export default createUserRouter;
