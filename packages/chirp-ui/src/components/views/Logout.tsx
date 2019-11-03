import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { StorageContext } from "../StorageProvider";

import useUser from "../hooks/useUser";

const Logout: React.FC = () => {
    const {
        user: {
            invalidate
        }
    } = useUser();

    invalidate();

    return (
        <Redirect
            to="/signin"
        />
    );
};

export default Logout;
