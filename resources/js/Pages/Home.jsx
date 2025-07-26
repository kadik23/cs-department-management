import { Link, Head, usePage } from "@inertiajs/react";
import "../../css/style.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../state/auth/authSlice";

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

export default function Home({ flash, auth }) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const inertiaAuth = auth && auth.user;

    // Hydrate Redux from Inertia shared props
    useEffect(() => {
        if (inertiaAuth) {
            dispatch(loginAction(inertiaAuth));
        }
    }, [inertiaAuth, dispatch]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": getCsrfToken(),
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                setError("Invalid credentials");
                return;
            }
            const data = await response.json();
            dispatch(loginAction(data.user));
            setUsername("");
            setPassword("");
            let role = 'admin';
            if (data.user && data.user.role === 'teacher') role = 'teacher';
            else if (data.user && data.user.role == 'student') role = 'student';
            else if (data.user && data.user.role == 'admin') role = 'admin';
            window.location.href = `/${role}`;
        } catch (err) {
            setError("Login failed");
        }
    };

    const handleLogout = async () => {
        await fetch("/logout", {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
        });
        dispatch(logoutAction());
        window.location.href = "/";
    };

    return (
        <div className="flex h-screen">
            <Head title="Home" />
            <div className="left-side">
                <div className="image-wrapper">
                    <img src="/assets/images/left.jpg" alt="Left side image" />
                </div>
                <div className="welcom">
                    <h1>Welcome to Computer Science Department</h1>
                    <p
                        style={{
                            paddingLeft: "5px",
                            paddingTop: "10px",
                            fontSize: "14px",
                            lineHeight: "24px",
                            color: "#f0f9ff",
                        }}
                    >
                        Access to this system is restricted to authorized users
                        only. If you do not have an account, please contact the
                        department administrator to request one.
                    </p>
                </div>
            </div>
            <div className="right-side">
                <div className="top-image">
                    <img
                        src="/assets/images/top.png"
                        alt="Top image"
                    />
                </div>
                <div className="wrapper">
                    {isAuthenticated ? (
                        <div>
                            <p>Welcome, {user.first_name} {user.last_name}!</p>
                            <button className="btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button className="btn" type="submit">
                                Login
                            </button>
                            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
