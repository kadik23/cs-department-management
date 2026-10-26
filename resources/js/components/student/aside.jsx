import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../state/auth/authSlice";

function Aside() {
    const { url, props } = usePage();
    const auth = props?.auth;
    const dispatch = useDispatch();
    
    function getCsrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : '';
    }
    
    const aside_links = [
        {
            path: "/student/",
            title: "Dashboard",
        },
        {
            path: "/student/announcements",
            title: "Announcements",
        },
        {
            path: "/student/courses",
            title: "Courses",
        },
        {
            path: "/student/schedule",
            title: "Schedule",
        },
        {
            path: "/student/submissions",
            title: "Submissions",
        },
        {
            path: "/student/notes",
            title: "Notes",
        },
        {
            path: "/student/attendance",
            title: "Attendance",
        },
        {
            path: "/student/exams",
            title: "Exams",
        },
        {
            path: "/student/profile",
            title: "My Profile",
        }
    ];

    const handleLogout = async () => {
        await fetch("/logout", {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
        });
        dispatch(logoutAction());
        window.location.href = "/";
    };

    const studentName = auth?.user?.first_name ? `${auth.user.first_name} ${auth.user.last_name}` : "Student";

    return (
        <aside>
            <Link href="/student/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="user-profile-pic">
                    <img src={'/assets/images/student.jpg'} alt="profile picture"/>
                </div>
                <div className="user-name">{studentName}</div>
            </Link>
            <nav>
                {aside_links.map((link, index) => {
                    const isSelected = url === link.path || (link.path === "/student/" && (url === "/student" || url === "/student/"));
                    return (
                        <Link 
                            key={index}
                            className={isSelected ? "aside-selected-link" : ""}
                            href={link.path}
                        >
                            {link.title}
                        </Link>
                    );
                })}
                <button className="btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default Aside; 