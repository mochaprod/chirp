import { RequestHandlerDB } from "../../models/express";
import { FollowsModel } from "../../models/user";

const followers: RequestHandlerDB<FollowsModel> = async (
    req, res, Follows
) => {
};

export default followers;
