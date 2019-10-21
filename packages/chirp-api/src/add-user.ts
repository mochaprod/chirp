import crypto from "crypto";
import { createTransport } from 'nodemailer';

import { RequestHandlerDB, ResponseSchema } from "./models/express";
import { UserModel } from "./models/user";

const HOST = "chirp.cloud.compas.cs.stonybrook.edu";
const HOST_EMAIL = `chirp@${HOST}`;
const TITLE = "Email verification for Chirp"

const transporter = createTransport({
    port: 2525,
    host: "localhost",
    tls: {
        rejectUnauthorized: false
    }
});

const generateMailTemplate = (username:string, key: string): string => {
    return `Hi ${username}! See below for your verification key: \nverification key: <${key}>`;
}

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

        let verificationToken = crypto.randomBytes(32).toString("hex");

        const mail = {
            from: HOST_EMAIL,
            to: String(email),
            subject: TITLE,
            text: generateMailTemplate(username, verificationToken)
        };

        transporter.sendMail(mail);

        await Users
            .insertOne({
                username,
                email,
                password,
                verified: false,
                verificationToken: verificationToken
            });

        res.send({
            status: "OK"
        } as ResponseSchema);
    } catch (e) {
        res.send({
            status: "error",
            error: e.message
        } as ResponseSchema);
    }
};

export default addUser;
