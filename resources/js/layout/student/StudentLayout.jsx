import React from "react";
import { Link } from "@inertiajs/react";

export function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-blue-50">
            {/* Student Header */}
            <header className="bg-purple-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold">CS Department - Student Portal</h1>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <Link href="/student/dashboard" className="hover:text-purple-200">Dashboard</Link>
                            <Link href="/student/courses" className="hover:text-purple-200">My Courses</Link>
                            <Link href="/student/schedule" className="hover:text-purple-200">Schedule</Link>
                            <Link href="/student/grades" className="hover:text-purple-200">My Grades</Link>
                            <Link href="/student/attendance" className="hover:text-purple-200">Attendance</Link>
                            <Link href="/logout" className="hover:text-red-200">Logout</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Student Footer */}
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 CS Department Management - Student Portal</p>
                </div>
            </footer>
        </div>
    );
}

export default StudentLayout; 