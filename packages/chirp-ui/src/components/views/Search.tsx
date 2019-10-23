import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { SearchAPIResponse } from "../../models/api";
import { Item } from "../../models/data";

import { api } from "../../utils/api";

const Search: React.FC = () => {
    const [timestamp, setTimestamp] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);
    const [items, setItems] = useState<Item[]>([]);
    const { push } = useHistory();

    const onTimestampChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimestamp(event.target.value);
    };

    const onLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(event.target.value));
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
                style={ {
                    cursor: "pointer"
                } }
                onClick={ onItemClick }
            >
                <h3>
                    { username }
                </h3>
                <p>
                    { content }
                </p>
                <div>
                    { itemTime }
                </div>
                <div>
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
                        data: {
                            timestamp: timePayload,
                            limit: limitPayload
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
    }, [timestamp, limit]);

    return (
        <form
            onSubmit={ onFormSubmit }
        >
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
