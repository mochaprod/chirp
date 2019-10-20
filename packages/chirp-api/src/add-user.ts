import crypto from "crypto";

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { UserModel } from "./models/user";

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

        res.send({
            status: "OK"
        } as ResponseSchema);
    } catch (e) {
        res.send({
            status: "error",
            message: e.message
        } as ResponseSchema);
    }
};

export default addUser;
