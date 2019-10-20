import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { UserModel } from "./models/user";

import { setUserCookie, validateUserCookie } from "./cookies/auth";

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
            // Send email
            setUserCookie(res, username);

            res.send({
                status: "OK"
            } as ResponseSchema);
        } else {
            throw new Error("Unable to verify provided credentials!");
        }
    } catch (e) {
        res.send({
            status: "error",
            message: e.message
        } as ResponseSchema);
    }
};

export default login;
