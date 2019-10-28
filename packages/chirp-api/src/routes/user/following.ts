import { RequestHandlerDB } from "../../models/express";
import { FollowsModel } from "../../models/user";

const following: RequestHandlerDB<FollowsModel> = async (
    req, res, Follows
) => {};

export default following;
