import React from "react";
import { Link } from "@inertiajs/react";

export function TeacherLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Teacher Header */}
            <header className="bg-green-700 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">CS Department - Teacher Portal</h1>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <Link href="/teacher/dashboard" className="hover:text-green-200">Dashboard</Link>
                            <Link href="/teacher/courses" className="hover:text-green-200">My Courses</Link>
                            <Link href="/teacher/schedule" className="hover:text-green-200">Schedule</Link>
                            <Link href="/teacher/grades" className="hover:text-green-200">Grades</Link>
                            <Link href="/teacher/attendance" className="hover:text-green-200">Attendance</Link>
                            <Link href="/logout" className="hover:text-red-200">Logout</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Teacher Footer */}
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 CS Department Management - Teacher Portal</p>
                </div>
            </footer>
        </div>
    );
}

export default TeacherLayout; 