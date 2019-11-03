import axios, { AxiosRequestConfig } from "axios";

import { APIResponse } from "../models/api";

export const api = async <P extends APIResponse>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    secure?: boolean
) => {
    const {
        REACT_APP_API_HOST: HOST
    } = process.env;

    const protocol = secure
        ? "https"
        : "http";

    return axios.request<P>({
        url: `${protocol}://${HOST}${endpoint}`,
        ...options
    });
};
