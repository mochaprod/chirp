import React, { useState, useContext } from "react";

import { LoginAPIResponse } from "../../models/api";

import { StorageContext } from "../StorageProvider";

import { api } from "../../utils/api";

const Login: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [nameError, setNameError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>();
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { setToken } = useContext(StorageContext);

    const doSignIn = async () => {
        try {
            const { data: {
                status,
                token
            } } = await api<LoginAPIResponse>(
                "/login",
                {
                    method: "POST",
                    params: {
                        token: true
                    },
                    data: {
                        username: name,
                        password
                    }
                }
            );

            if (status === "OK" && token) {
                setToken(token);
            } else {
                setErrorMessage("Failed to login!");
            }
        } catch (e) {
            setErrorMessage("Failed!");
        }
    };

    const createOnChange = (
        setter: (next: string) => void,
        errorSetter: (next: boolean) => void
    ) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setter(event.target.value);
        errorSetter(false);
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let proceed = true;

        if (name.length < 1) {
            proceed = false;
            setNameError(true);
        }

        if (password.length < 1) {
            proceed = false;
            setPasswordError(true);
        }

        if (proceed) {
            doSignIn();
        }
    };

    return (
        <form
            onSubmit={ onSubmit }
        >
            <input
                type="text"
                value={ name }
                onChange={ createOnChange(setName, setNameError) }
            />
            <input
                type="password"
                value={ password }
                onChange={ createOnChange(setPassword, setPasswordError) }
            />
            <button
                type="submit"
            >
                Sign in
            </button>
        </form>
    );
};

export default Login;
