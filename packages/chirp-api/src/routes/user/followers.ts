import { RequestHandlerDB } from "../../models/express";
import { FollowsModel } from "../../models/user";

import { respond } from "../../utils/response";

const followers: RequestHandlerDB<FollowsModel> = async (
    req, res, Follows
) => {
    const {
        params: { user },
        query: { limit: requestLimit }
    } = req;

    try {
        if (!user) {
            throw new Error("No user provided.");
        }

        const limit = Number(requestLimit);

        // Check if user exists?

        const followersFound = await Follows
            .find({ follows: user })
            .limit(limit)
            .map(({ user: name }) => name)
            .toArray();

        respond(
            res,
            undefined,
            { users: followersFound }
        );
    } catch (e) {
        respond(res, e.message);
    }
};

export default followers;
