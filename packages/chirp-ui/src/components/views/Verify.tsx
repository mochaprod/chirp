import React, { useState } from "react";

import { api } from "../../utils/api";
import { Link } from "react-router-dom";

const Verify: React.FC = () => {
    const [error, setError] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const doSubmit = async () => {
        try {
            const { data: {
                status
            } } = await api(
                "/verify",
                {
                    method: "POST",
                    data: {
                        email,
                        key: code
                    }
                }
            );

            if (status === "OK") {
                setVerified(true);
            }
        } catch (e) {
            setError(true);
        }
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        doSubmit();
    };

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    return (
        <form
            onSubmit={ onSubmit }
        >
            { error && (
                <div>
                    Credentials incorrect!
                </div>
            ) }
            { verified && (
                <div>
                    <span>
                        You've been verified!
                    </span>
                    <Link
                        to="/signin"
                    >
                        Sign in!
                    </Link>
                </div>
            ) }
            <input
                required
                type="email"
                placeholder="Email"
                value={ email }
                onChange={ onEmailChange }
            />
            <input
                required
                type="text"
                placeholder="Verification code"
                value={ code }
                onChange={ onCodeChange }
            />
            <button
                type="submit"
            >
                Verify
            </button>
        </form>
    );
};

export default Verify;
