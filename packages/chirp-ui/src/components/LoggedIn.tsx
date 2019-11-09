import React from "react";
import { Redirect } from "react-router-dom";

import useUser from "./hooks/useUser";

interface LoggedInProps {
    not?: boolean;
    redirect?: string;
}

const LoggedIn: React.FC<LoggedInProps> = ({
    children,
    not,
    redirect
}) => {
    const {
        user: {
            done,
            authenticated
        }
    } = useUser();

    if (!done) {
        return null;
    }

    const condition = not
        ? !authenticated
        : authenticated;
    const redirectTo = redirect || "/signup";

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

export default LoggedIn;
