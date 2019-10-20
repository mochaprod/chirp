export const DEV_MODE = process.env.NODE_ENV !== "production";

export const assert = (test: any, message: string) => {
    if (DEV_MODE && !test) {
        console.error(message);
    }
};
