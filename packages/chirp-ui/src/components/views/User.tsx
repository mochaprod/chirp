import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
    UserDetailsAPIResponse,
    UserConnectionsAPIResponse,
    UserPostsAPIResponse
} from "../../models/api";
import { UserDetails } from "../../models/data";

import useUser from "../hooks/useUser";

import { api } from "../../utils/api";

import styles from "./User.module.scss";

const User: React.FC = () => {
    const [details, setDetails] = useState<UserDetails | null>(null);
    const [userFollowing, setUserFollowing] = useState<boolean>(false);
    const [followers, setFollowers] = useState<string[] | null>(null);
    const [following, setFollowing] = useState<string[] | null>(null);
    const [posts, setPosts] = useState<string[] | null>(null);
    const [detailsError, setDetailsError] = useState<boolean>(false);
    const [followersError, setFollowersError] = useState<string | null>();
    const [followingError, setFollowingError] = useState<string | null>();
    const [postsError, setPostsError] = useState<string | null>();
    const { user } = useParams();
    const {
        token,
        user: { done, authenticated, name: loggedInUser }
    } = useUser();

    const renderPosts = () => {
        if (!posts) {
            return null;
        }

        return posts.map((id) => {
            return (
                <div
                    key={ id }
                >
                    <Link
                        to={ `/tweet/${id}` }
                    >
                        { id }
                    </Link>
                </div>
            );
        });
    };

    const createList = (list: string[]) => list.map((name) => (
        <li
            key={ name }
        >
            <Link
                to={ `/user/${name}` }
            >
                { name }
            </Link>
        </li>
    ));

    const renderList = (list: string[] | null) => list
        ? (
            <ul>
                { createList(list) }
            </ul>
        )
        : (
            <div>
                Loading...
            </div>
        );

    const createOnFollowClick = (follow: boolean) => (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const dispatchFollowRequest = async () => {
            try {
                const { data: {
                    status
                } } = await api(
                    "/follow",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            username: user,
                            follow
                        }
                    }
                );

                if (status === "OK") {
                    setUserFollowing(follow);
                }
            } catch (e) {
                console.warn("Follow request failed");
            }
        };

        dispatchFollowRequest();
    };

    const renderFollowButton = () => {
        if (!done || !authenticated || !loggedInUser || !token) {
            return null;
        }

        if (!followers) {
            return null;
        }

        if (user === loggedInUser) {
            return null;
        }

        return (
            <button
                className={ styles.btn }
                onClick={ createOnFollowClick(!userFollowing) }
            >
                { userFollowing
                    ? "Unfollow"
                    : "Follow" }
            </button>
        );
    };

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const { data: {
                    status,
                    user: responseDetails
                } } = await api<UserDetailsAPIResponse>(
                    `/user/${user}`
                );

                if (status === "OK") {
                    setDetails(responseDetails);
                } else {
                    setDetailsError(true);
                }
            } catch (e) {
                setDetailsError(true);
            }
        };

        getUserDetails();
    }, [user, userFollowing]);

    useEffect(() => {
        if (!details) {
            return;
        }

        const getFollowers = async () => {
            try {
                const { data: {
                    status,
                    users,
                    error
                } } = await api<UserConnectionsAPIResponse>(
                    `/user/${user}/followers`
                );

                if (status === "OK") {
                    if (
                        done
                        && authenticated
                        && loggedInUser
                        && users.includes(loggedInUser)
                    ) {
                        setUserFollowing(users.includes(loggedInUser));
                    }

                    setFollowers(users);
                } else {
                    setFollowersError(error);
                }
            } catch (e) {
                setFollowersError("Not sure what happend");
            }
        };

        getFollowers();
    }, [details, authenticated, done, loggedInUser, user]);

    useEffect(() => {
        if (!details) {
            return;
        }

        const getFollowing = async () => {
            try {
                const { data: {
                    status,
                    users,
                    error
                } } = await api<UserConnectionsAPIResponse>(
                    `/user/${user}/following`
                );

                if (status === "OK") {
                    setFollowing(users);
                } else {
                    throw new Error(error);
                }
            } catch (e) {
                setFollowingError(e.message);
            }
        };

        getFollowing();
    }, [details, user]);

    useEffect(() => {
        if (!details) {
            return;
        }

        const getPosts = async () => {
            try {
                const { data: {
                    status,
                    error,
                    items
                } } = await api<UserPostsAPIResponse>(
                    `/user/${user}/posts`
                );

                if (status === "OK") {
                    setPosts(items);
                } else {
                    throw new Error(error);
                }
            } catch (e) {
                setPostsError("Failed to get posts");
            }
        };

        getPosts();
    }, [details, user]);

    if (!done) {
        return null;
    }

    if (!details || detailsError) {
        return (
            <h2>
                { `User ${user} not found!` }
            </h2>
        );
    }

    return (
        <div>
            <h1>
                { user }
            </h1>
            <div>
                { renderFollowButton() }
            </div>
            <div>
                <h3>
                    Posts
                </h3>
                { postsError || renderPosts() }
            </div>
            <div>
                <h3>
                    Followers
                </h3>
                <span>
                    { `${details.followers} total followers` }
                </span>
                { followersError || renderList(followers) }
            </div>
            <div>
                <h3>
                    Following
                </h3>
                <span>
                    { `${details.following} total following` }
                </span>
                { followingError || renderList(following) }
            </div>
        </div>
    );
};

export default User;
