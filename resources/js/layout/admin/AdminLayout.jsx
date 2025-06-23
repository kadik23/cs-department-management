import React from "react";
import { Link } from "@inertiajs/react";

export function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-blue-800 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">CS Department - Admin Panel</h1>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <Link href="/admin/dashboard" className="hover:text-blue-200">Dashboard</Link>
                            <Link href="/admin/users" className="hover:text-blue-200">Users</Link>
                            <Link href="/admin/subjects" className="hover:text-blue-200">Subjects</Link>
                            <Link href="/admin/schedules" className="hover:text-blue-200">Schedules</Link>
                            <Link href="/admin/reports" className="hover:text-blue-200">Reports</Link>
                            <Link href="/logout" className="hover:text-red-200">Logout</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Admin Footer */}
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 CS Department Management - Admin Panel</p>
                </div>
            </footer>
        </div>
    );
}

export default AdminLayout; 