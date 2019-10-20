import crypto from "crypto";

import { RequestHandlerDB } from "./models/express";
import { UserModel } from "./models/user";

import { respond } from "./utils/response";

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

        await Users
            .insertOne({
                username,
                email,
                password,
                verified: false,
                verificationToken: crypto.randomBytes(32).toString("hex")
            });

        respond(res);
    } catch (e) {
        respond(res, e.message);
    }
};

export default addUser;
