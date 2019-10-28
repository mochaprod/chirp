import { RequestHandlerDB } from "../../models/express";
import { FollowsModel } from "../../models/user";
import { respond } from "../../utils/response";

const following: RequestHandlerDB<FollowsModel> = async (
    req, res, Follows
) => {
    const {
        params: { user },
        query: { limit: requestLimit }
    } = req;

    try {
        if (!user) {
            throw new Error("User not provided!");
        }

        const limit = Number(requestLimit);

        const followingFound = await Follows
            .find({ user })
            .limit(limit)
            .map(({ follows }) => follows)
            .toArray();

        respond(
            res,
            undefined,
            { users: followingFound }
        );
    } catch (e) {
        respond(
            res,
            e.message
        );
    }
};

export default following;
