import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";

import { ItemAPIResponse } from "../../models/api";
import { Item } from "../../models/data";

import Modal from "../Modal";

import useUser from "../hooks/useUser";

import { api } from "../../utils/api";

import styles from "./ViewTweet.module.scss";

const ViewTweet: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [data, setData] = useState<Item | null>(null);
    const [dialog, setDialog] = useState<boolean>(false);
    const { id } = useParams();
    const {
        token,
        user: {
            done,
            authenticated,
            name
        }
    } = useUser();

    const allowDeletion = () => {
        if (!data || !done) {
            return false;
        }

        if (!authenticated || !name || !token) {
            return false;
        }

        const { username } = data;

        if (username !== name) {
            return false;
        }

        return true;
    };

    const handleDeleteTweet = () => {
        if (!allowDeletion()) {
            return;
        }

        const deleteTweet = async () => {
            try {
                const { data: {
                    status
                } } = await api(
                    `/item/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (status !== "OK") {
                    throw new Error();
                } else {
                    setDialog(true);
                }
            } catch (e) {
                setError(true);
            }
        };

        deleteTweet();
    };

    const onModalBackdropClick = () => {
        setDialog(false);
    };

    const renderDeleteButton = () => {
        if (!allowDeletion()) {
            return null;
        }

        return (
            <button
                onClick={ handleDeleteTweet }
            >
                Delete
            </button>
        );
    };

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
                    throw new Error();
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
                <div>
                    <h3>
                        { username }
                    </h3>
                    { renderDeleteButton() }
                </div>
                <div>
                    { time.toString() }
                </div>
                <div>
                    { content }
                </div>
                <Modal
                    show={ dialog }
                    onBackdropClick={ onModalBackdropClick }
                >
                    <div
                        className={ styles.modal }
                    >
                        Deleted
                    </div>
                </Modal>
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

    if (!done) {
        return null;
    }

    return loaded
        ? renderResult()
        : (
            <div>
                Loading...
            </div>
        );
};

export default ViewTweet;
