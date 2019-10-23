import React from "react";

import TweetHome from "./TweetHome";
import LoadingFallback from "../LoadingFallback";

import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    const { user: {
        done, authenticated
    } } = useUser();

    if (done && authenticated) {
        return (
            <TweetHome />
        );
    }

    if (done && !authenticated) {
        return (
            <div>
                <h1>
                    Welcome to Chirp!
                </h1>
                <div>
                    <Link
                        to="/signin"
                    >
                        Returning? Sign in.
                    </Link>
                </div>
                <div>
                    <Link
                        to="/signup"
                    >
                        Create an account for free!
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <LoadingFallback />
    );
};

export default Home;
