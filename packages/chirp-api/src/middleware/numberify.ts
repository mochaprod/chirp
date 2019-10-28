import { RequestHandler } from "express";

import { respond } from "../utils/response";

const numberify: (
    queryParam: string, defaultValue: number, min?: number, max?: number
) => RequestHandler = (
    queryParam: string, defaultValue: number, min?: number, max?: number
) => (req, res, next) => {
    const { query: { [queryParam]: param } } = req;

    let num;

    try {
        if (!param) {
            num = defaultValue;
        } else {
            // Throw error if not convertable
            num = Number(param);
        }

        // Assuming `min` < `max`

        if (typeof min === "number" && num < min) {
            num = min;
        }

        if (typeof max === "number" && num > max) {
            num = max;
        }

        req.query[queryParam] = num;

        next();
    } catch (e) {
        respond(
            res,
            "Expected a number value."
        );
    }
};

export default numberify;
