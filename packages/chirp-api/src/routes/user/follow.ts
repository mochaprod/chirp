import { RequestHandlerDB } from "../../models/express";
import { FollowsModel, UserModel } from "../../models/user";

import { respond } from "../../utils/response";

const follow: RequestHandlerDB<FollowsModel, UserModel> = async (
    req,
    res,
    Follows,
    Users
) => {
    const { user, body: {
        username: followUsername,
        follow: reqFollow
    } } = req;

    const doFollow = reqFollow === undefined
        ? true
        : reqFollow;

    try {
        if (!Users || !user) {
            throw new Error("Internal error!");
        }

        if (user.name === followUsername) {
            throw new Error("You can't follow yourself!");
        }

        const followTarget = await Users.findOne({ username: followUsername });

        if (!followTarget) {
            throw new Error(`User ${followUsername} doesn't exist!`);
        }

        const doesFollow = await Follows.findOne({
            user: user.name,
            follows: followUsername
        });

        if (doesFollow) {
            // If user is already following the follow target user.

            if (doFollow) {
                // Throw an error if user is trying to follow when
                // already following.

                throw new Error(`Already following ${followUsername}!`);
            }

            await Follows.deleteOne({
                _id: doesFollow._id
            });
        } else {
            if (!doFollow) {
                throw new Error(`Already not following ${followUsername}!`);
            }

            await Follows.insertOne({
                user: user.name,
                follows: followUsername
            });
        }

        respond(res);
    } catch (e) {
        respond(res, e.message);
    }
};

export default follow;
