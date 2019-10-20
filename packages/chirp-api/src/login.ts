import { RequestHandlerDB } from "./models/express";
import { UserModel } from "./models/user";

import { setUserCookie, validateUserCookie } from "./cookies/auth";

import { respond } from "./utils/response";

const login: RequestHandlerDB<UserModel> = async (req, res, Users) => {
    const {
        body: {
            username,
            password
        }
    } = req;

    try {
        const { valid } = validateUserCookie(req);

        if (valid) {
            throw new Error("You're already logged in!");
        }

        const user = await Users.findOne({ username });

        if (user && password === user.password) {
            if (!user.verified) {
                throw new Error("You're not verified yet!");
            }

            // Send email
            setUserCookie(res, user._id.toHexString(), username);

            respond(res);
        } else {
            throw new Error("Unable to verify provided credentials!");
        }
    } catch (e) {
        respond(res, e.message);
    }
};

export default login;
