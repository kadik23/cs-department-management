import React from "react";

export function Layout({ children }) {
    return (
        <>
            <div className="text-white">Navebar...</div>
            <div>{children}</div>
            <div className="text-white">Footer...</div>
        </>
    );
}

export default Layout;
