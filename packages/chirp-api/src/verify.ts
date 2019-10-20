import { RequestHandlerDB } from "./models/express";
import { UserModel } from "./models/user";

import { respond } from "./utils/response";

const SUPER_DUPER_SECRET_KEY = "abracadabra";

const verify: RequestHandlerDB<UserModel> = async (req, res, Users) => {
    const { body: { email, key } } = req;

    try {
        const found = await Users.findOne({
            email
        });

        if (found) {
            if (found.verified) {
                throw new Error("You're already verified!");
            }

            const { verificationToken: token } = found;

            if (key === token || key === SUPER_DUPER_SECRET_KEY) {
                await Users.updateOne({
                    _id: found._id
                }, {
                    $set: {
                        verified: true
                    }
                });

                respond(res);
            } else {
                throw new Error("Verification key is invalid!");
            }
        } else {
            throw new Error("No account exists with that email!");
        }
    } catch (e) {
        respond(res, e.message);
    }
};

export default verify;
