import React, { useState, useEffect } from "react";

export interface StorageContextShape {
    token: string | null;
    setToken: (nextToken: string | null) => void | null;
}

export const StorageContext = React.createContext<StorageContextShape>({
    token: null,
    setToken: () => null
});

const StorageProvider: React.FC = ({ children }) => {
    const initialToken = localStorage.getItem("token");

    const [token, setToken] = useState<string | null>(
        initialToken || null
    );

    const value: StorageContextShape = {
        token,
        setToken
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    return (
        <StorageContext.Provider
            value={ value }
        >
            { children }
        </StorageContext.Provider>
    );
};

export default StorageProvider;
