import { ObjectId } from "mongodb";
import { Request, Response } from "express";

export interface UserModel {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken: string;
}

export interface FollowsModel {
    _id: ObjectId;
    user: string;
    follows: string;
}

export type CookieValidator = (
    req: Request, response?: Response
) => CookieValidation;

export interface CookieValidation {
    // Truthy if jwt is verified
    valid: boolean;

    // Truthy if jwt verification fails and cookie deleted
    invalidated: boolean;

    // Decoded jwt payload
    decoded?: UserCookieContent;
}

export interface UserCookieContent {
    id: string;
    username: string;
}
