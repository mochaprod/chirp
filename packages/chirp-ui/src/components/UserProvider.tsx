import React, { useState, useEffect, useContext } from "react";

import { StorageContext } from "./StorageProvider";

import { UserAPIResponse } from "../models/api";

import { api } from "../utils/api";

export interface UserContextShape {
    done: boolean;
    authenticated: boolean;
    name?: string;
    invalidate: () => void;
}

export const UserContext = React.createContext<UserContextShape>({
    done: false,
    authenticated: false,
    invalidate: () => {
        // Noop
    }
});

const UserProvider: React.FC = ({
    children
}) => {
    const [done, setDone] = useState<boolean>(false);
    const [authed, setAuthed] = useState<boolean>(false);

    const { token, setToken } = useContext(StorageContext);

    const invalidate = () => {
        setAuthed(false);
        setToken(null);
    };

    const providerValue: UserContextShape = {
        done,
        authenticated: authed,
        invalidate
    };

    useEffect(() => {
        if (authed) {
            return;
        }

        const ping = async () => {
            try {
                if (token) {
                    const {
                        data: {
                            status
                        }
                    } = await api<UserAPIResponse>(
                        "/user",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (status === "OK") {
                        setAuthed(true);
                    } else {
                        setAuthed(false);
                    }
                }
            } catch (e) {
                setAuthed(false);
            } finally {
                setDone(true);
            }
        };

        ping();
    }, [authed, token]);

    return (
        <UserContext.Provider
            value={ providerValue }
        >
            { children }
        </UserContext.Provider>
    );
};

export default UserProvider;
