import React from "react";
import Aside from "../../components/teacher/aside";
import '@css/teacher.css'
import "@css/aside.css";

export function TeacherLayout({ children }) {
    return (
        <div className="container">
            <Aside />
            <div className="container">
                {children}
            </div>
        </div>
    );
}

export default TeacherLayout; 