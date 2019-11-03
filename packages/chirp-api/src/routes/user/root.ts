import { RequestHandlerDB } from "../../models/express";
import { FollowsModel, UserModel } from "../../models/user";

import { respond } from "../../utils/response";

const root: RequestHandlerDB<FollowsModel, UserModel> = async (
    req,
    res,
    Follows,
    Users
) => {
    const { params: { user: userParam } } = req;

    try {
        if (!Users) {
            throw new Error("Internal error!");
        }

        if (!userParam) {
            throw new Error("No user provided!");
        }

        const user = await Users.findOne({ username: userParam });

        if (user) {
            const { username } = user;

            const following = await Follows.countDocuments({ user: username });
            const followers = await Follows.countDocuments({ follows: username });

            respond(
                res,
                undefined,
                {
                    user: {
                        email: user.email,
                        following,
                        followers
                    }
                }
            );
        } else {
            throw new Error(`User ${userParam} not found!`);
        }
    } catch (e) {
        respond(res, e.message);
    }
};

export default root;
