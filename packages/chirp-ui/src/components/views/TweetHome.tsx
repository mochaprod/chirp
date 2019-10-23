import React, { useState } from "react";

import { InsertItemAPIResponse } from "../../models/api";

import useUser from "../hooks/useUser";

import { api } from "../../utils/api";
import { Link } from "react-router-dom";

const TweetHome: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [itemID, setItemID] = useState<string | null>(null);
    const {
        token
    } = useUser();

    const addTweet = async () => {
        if (!content) {
            setError(true);

            return;
        }

        // Child type not implemented yet

        try {
            const { data: {
                status,
                id
            } } = await api<InsertItemAPIResponse>(
                "/additem",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        content
                    }
                }
            );

            if (status === "OK") {
                setItemID(id);
            }
        } catch (e) {
            setError(true);
        }
    };

    const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setContent(event.target.value);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (content) {
            addTweet();
        } else {
            setError(true);
        }
    };

    return (
        <form
            onSubmit={ onSubmit }
        >
            <h1>
                New tweet
            </h1>
            { itemID && (
                <div>
                    <Link
                        to={ `/tweet/${itemID}` }
                    >
                        View new tweet
                    </Link>
                </div>
            ) }
            { error && (
                <div>
                    Some error ocurred!
                </div>
            ) }
            <textarea
                placeholder="What's going on?"
                value={ content }
                onChange={ onContentChange }
            />
            <button
                type="submit"
            >
                Tweet
            </button>
            <Link
                to="/signout"
            >
                Sign out
            </Link>
        </form>
    );
};

export default TweetHome;
