import React from "react";
import Aside from "../../components/admin/aside";
import "@css/admin.css";
import { usePage } from '@inertiajs/react';

export function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth && auth.user;
    if (!user || user.role !== 'admin') {
        if (typeof window !== 'undefined') {
            window.location.replace('/');
        }
        return <div style={{padding: 40, color: 'red'}}>Unauthorized: Admins only</div>;
    }
    return (
        <div className="container">
            <Aside/>
                {children}
        </div>
    );
}

export default AdminLayout; 