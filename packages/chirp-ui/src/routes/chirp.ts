import React from "react";

import { Route } from "../models/router";

import Home from "../components/views/Home";
import Register from "../components/views/Register";
import NotFound from "../components/views/NotFound";
import Login from "../components/views/Login";
import Logout from "../components/views/Logout";
import Verify from "../components/views/Verify";
import User from "../components/views/User";
import withRequireAuthentication from "../components/auth/withRequireAuthentication";

const chirpRoutes: Route[] = [
    {
        to: "/",
        exact: true,
        component: Home
    },
    {
        to: "/signin",
        exact: true,
        component: withRequireAuthentication(true)(Login)
    },
    {
        to: "/signup",
        exact: true,
        component: withRequireAuthentication(true)(Register)
    },
    {
        to: "/signout",
        exact: true,
        component: withRequireAuthentication()(Logout)
    },
    {
        to: "/code",
        exact: true,
        component: withRequireAuthentication(true)(Verify)
    },
    {
        to: "/tweet/:id",
        exact: true,
        component: React.lazy(() => import("../components/views/ViewTweet"))
    },
    {
        to: "/profile/:user",
        exact: true,
        component: User
    },
    {
        to: "/search",
        exact: true,
        component: React.lazy(() => import("../components/views/Search"))
    },
    {
        to: "/not-found",
        exact: true,
        component: NotFound
    }
];

export default chirpRoutes;
