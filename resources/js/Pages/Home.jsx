import { Link, Head } from "@inertiajs/react";
import "../../css/style.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../state/auth/authSlice";

export default function Home({ flash }) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login({ name: username }));
        setUsername("");
        setPassword("");
    };

    const handleLogout = () => {
        dispatch(logout());
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
                            <p>Welcome, {user.name}!</p>
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
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
