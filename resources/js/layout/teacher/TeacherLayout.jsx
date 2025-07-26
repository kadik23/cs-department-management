import React from "react";
import Aside from "../../components/teacher/aside";
import '@css/teacher.css'

export function TeacherLayout({ children }) {
    return (
        <div className="container">
            <Aside />
            {children}
        </div>
    );
}

export default TeacherLayout; 