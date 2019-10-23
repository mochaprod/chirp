import React from "react";
import { Redirect } from "react-router-dom";

import useUser from "../hooks/useUser";

interface RequireAuthenticationProps {
    not?: boolean;
    loading?: React.ReactNode;
    redirectTo: string;
}

const RequireAuthentication: React.FC<RequireAuthenticationProps> = ({
    children,
    loading,
    not,
    redirectTo
}) => {
    const {
        user: {
            done,
            authenticated
        }
    } = useUser();

    if (!done) {
        return (
            <>
                { loading || null }
            </>
        );
    }

    const condition = not
        ? done && !authenticated
        : done && authenticated;

    if (condition) {
        return (
            <>
                { children }
            </>
        );
    }

    return (
        <Redirect
            to={ redirectTo }
        />
    );
};

export default RequireAuthentication;
