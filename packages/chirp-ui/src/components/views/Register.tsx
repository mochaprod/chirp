import React, { useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../utils/api";

const Register = () => {
    const [done, setDone] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const doSubmit = async () => {
        if (!name || !email || !password || !passwordConfirm) {
            setError(true);

            return;
        }

        if (password !== passwordConfirm) {
            setError(true);

            return;
        }

        try {
            const { data: {
                status
            } } = await api(
                "/adduser",
                {
                    method: "POST",
                    data: {
                        username: name,
                        email,
                        password
                    }
                }
            );

            if (status === "OK") {
                setDone(true);
            }
        } catch (e) {
            console.log(e);

            setError(true);
        }
    };

    const createOnChange = (setter: (next: string) => void) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setter(event.target.value);
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        doSubmit();
    };

    return (
        <form
            onSubmit={ onFormSubmit }
        >
            { error && (
                <div>
                    Please check your information!
                </div>
            ) }
            { done && (
                <div>
                    <span>
                        Good news! You've signed up. Just verify your email and you're all set!
                    </span>
                    <Link
                        to="/code"
                    >
                        Verify here.
                    </Link>
                </div>
            ) }
            <input
                type="text"
                placeholder="Username"
                value={ name }
                onChange={ createOnChange(setName) }
            />
            <input
                type="email"
                placeholder="Email"
                value={ email }
                onChange={ createOnChange(setEmail) }
            />
            <input
                type="password"
                placeholder="Password"
                value={ password }
                onChange={ createOnChange(setPassword) }
            />
            <input
                type="password"
                placeholder="Password again"
                value={ passwordConfirm }
                onChange={ createOnChange(setPasswordConfirm) }
            />
            <button>
                Sign up
            </button>
        </form>
    );
};

export default Register;
