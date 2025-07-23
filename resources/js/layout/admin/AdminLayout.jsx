import React from "react";
import { Link } from "@inertiajs/react";
import Aside from "../../components/admin/aside";
import '@css/admin.css'
import "@css/aside.css";

export function AdminLayout({ children }) {
    return (
        <div className="container">
            <Aside/>
                {children}
        </div>
    );
}

export default AdminLayout; 