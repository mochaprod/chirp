import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";

import { ItemAPIResponse } from "../../models/api";
import { Item } from "../../models/data";

import { api } from "../../utils/api";

const ViewTweet: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [data, setData] = useState<Item | null>(null);
    const { id } = useParams();

    useEffect(() => {
        if (error) {
            return;
        }

        const getItem = async () => {
            try {
                const {
                    data: response
                } = await api<ItemAPIResponse>(`/item/${id}`);

                if (response.status === "OK") {
                    setData(response.item);
                } else {
                    setError(true);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        };

        getItem();
    }, [id, error]);

    const renderTweet = ({
        username, timestamp, content
    }: Item) => {
        const time = new Date(timestamp * 1000);

        return (
            <div>
                <h3>
                    { username }
                </h3>
                <div>
                    { time.toString() }
                </div>
                <div>
                    { content }
                </div>
            </div>
        );
    };

    const renderResult = () => {
        if (error || data === null) {
            // Tweet not found

            return (
                <Redirect
                    to="/not-found"
                />
            );
        }

        return renderTweet(data);
    };

    return loaded
        ? renderResult()
        : (
            <div>
                Loading...
            </div>
        );
};

export default ViewTweet;
