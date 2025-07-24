import React from "react";
import Aside from "../../components/admin/aside";
import "@css/admin.css";

export function AdminLayout({ children }) {
    return (
        <div className="container">
            <Aside/>
                {children}
        </div>
    );
}

export default AdminLayout; 