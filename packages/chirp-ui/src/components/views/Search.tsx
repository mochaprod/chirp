import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { SearchAPIResponse } from "../../models/api";
import { Item } from "../../models/data";

import { api } from "../../utils/api";

import styles from "./Search.module.scss";
import useUser from "../hooks/useUser";

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [timestamp, setTimestamp] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);
    const [following, setFollowing] = useState<boolean>(true);
    const [items, setItems] = useState<Item[]>([]);
    const { push } = useHistory();
    const {
        token,
        user: {
            done
        }
    } = useUser();

    const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const onUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    };

    const onTimestampChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimestamp(event.target.value);
    };

    const onLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(event.target.value));
    };

    const onFollowingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFollowing(event.target.checked);
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const renderItems = () => items.map(({
        id,
        username,
        timestamp: itemTime,
        content
    }) => {
        const time = new Date(itemTime * 1000);

        const onItemClick = () => {
            push(`/tweet/${id}`);
        };

        return (
            <div
                key={ `${id}` }
                className={ styles.item }
            >
                <div
                    className={ styles.clickable }
                    onClick={ onItemClick }
                >
                    <h3
                        className={ styles.heading }
                    >
                        { username }
                    </h3>
                    <p>
                        { content }
                    </p>
                </div>
                <div>
                    { itemTime }
                </div>
                <div
                    className={ styles.sub }
                >
                    { time.toString() }
                </div>
            </div>
        );
    });

    useEffect(() => {
        const doSearch = async () => {
            try {
                const date = new Date(Number(timestamp));
                const timePayload = timestamp
                    ? Math.round(date.getTime())
                    : undefined;
                const limitPayload = limit || undefined;

                const { data: {
                    status,
                    items: searchResponseItems
                } } = await api<SearchAPIResponse>(
                    "/search",
                    {
                        method: "POST",
                        headers: token ? {
                            Authorization: `Bearer ${token}`
                        } : null,
                        data: {
                            q: query,
                            timestamp: timePayload,
                            limit: limitPayload,
                            username: user,
                            following
                        }
                    }
                );

                if (status === "OK") {
                    if (items) {
                        setItems(searchResponseItems);
                    }
                }
            } catch (e) {
                // Query failed
            }
        };

        doSearch();
    }, [query, user, timestamp, limit, following]);

    if (!done) {
        return null;
    }

    return (
        <form
            onSubmit={ onFormSubmit }
        >
            <input
                type="text"
                placeholder="Search"
                value={ query }
                onChange={ onQueryChange }
            />
            <input
                type="text"
                placeholder="From user"
                value={ user }
                onChange={ onUserChange }
            />
            <input
                type="number"
                placeholder="Timestamp (in seconds)"
                value={ timestamp }
                onChange={ onTimestampChange }
            />
            <input
                type="number"
                value={ limit }
                onChange={ onLimitChange }
            />
            <label>
                <input
                    type="checkbox"
                    checked={ following }
                    onChange={ onFollowingChange }
                />
                <span>
                    Following only
                </span>
            </label>
            <div>
                { items.length === 0
                    ? (
                        <h2>
                            No results!
                        </h2>
                    )
                    : renderItems() }
            </div>
        </form>
    );
};

export default Search;
