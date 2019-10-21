import crypto from "crypto";

import { RequestHandlerDB } from "./models/express";
import { UserModel } from "./models/user";

import { respond } from "./utils/response";
import mailman from "./utils/mailman";

const addUser: RequestHandlerDB<UserModel> = async (req, res, Users) => {
    const { body: {
        username,
        email,
        password
    } } = req;

    try {
        const existingUser = await Users.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            throw new Error("Username or email already exists!");
        }

        const verificationToken = crypto.randomBytes(16).toString("hex");

        mailman()(
            email,
            verificationToken,
            username
        );

        await Users
            .insertOne({
                username,
                email,
                password,
                verified: false,
                verificationToken
            });

        respond(res);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addUser;
