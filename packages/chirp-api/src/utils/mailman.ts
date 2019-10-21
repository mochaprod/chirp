import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/stream-transport";

const verificationBody = (
    username: string,
    key: string
) => {
    const { EXTERNAL_HOST } = process.env;
    const HOST = EXTERNAL_HOST || "localhost";

    const link = `http://${HOST}/verify?u=${username}&c=${key}`;

    return `Hi ${username}! Verify your email with the code below:\n\nvalidation key: <${key}>\n\nOr use this convenient link:\n\n${link}`;
};

const createMailClient = () => {
    const { SMTP, SMTP_PORT } = process.env;

    if (!SMTP) {
        throw new Error("No SMTP host found!");
    }

    const transporter = nodemailer.createTransport({
        port: Number(SMTP_PORT),
        host: SMTP,
        tls: {
            rejectUnauthorized: true
        }
    });

    const send = (
        to: string,
        key: string,
        username: string
    ) => {
        const template: MailOptions = {
            subject: "Email verification for Chirp",
            from: "356.chirp@gmail.com",
            to,
            text: verificationBody(username, key)
        };

        transporter.sendMail(template);
    };

    return send;
};

export default createMailClient;
