export const DEV_MODE = process.env.NODE_ENV !== "production";

export const assert = (test: any, message: string) => {
    if (DEV_MODE && !test) {
        console.error(message);
    }
};

export const splitURLs = (str: string) => {
    return str.split(",").map((url) => `http://${url}`);
};
