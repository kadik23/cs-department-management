import React from "react";
import Aside from "../../components/student/aside";
import '@css/student.css'
import '@css/students.css'
import "@css/aside.css";

export function StudentLayout({ children }) {
    return (
        <div className="container">
            <Aside />
            {children}
        </div>
    );
}

export default StudentLayout; 