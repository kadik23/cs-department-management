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
            path: "/teacher",
            title: "Dashboard",
        },
        {
            path: "/teacher/announcements",
            title: "Announcements",
        },
        {
            path: "/teacher/courses",
            title: "My Courses",
        },
        {
            path: "/teacher/schedule",
            title: "Schedule",
        },
        {
            path: "/teacher/submissions",
            title: "Submissions",
        },
        {
            path: "/teacher/grades",
            title: "Grades",
        },
        {
            path: "/teacher/attendance",
            title: "Attendance",
        },
        {
            path: "/teacher/profile",
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

    const teacherName = auth?.user?.first_name ? `Pr. ${auth.user.first_name} ${auth.user.last_name}` : "Teacher";

    return (
        <aside>
            <Link href="/teacher/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="user-profile-pic">
                    <img src={'/assets/images/teacher.png'} alt="profile picture"/>
                </div>
                <div className="user-name">{teacherName}</div>
            </Link>
            <nav>
                {aside_links.map((link, index) => (
                    <Link 
                        key={index}
                        className={url === link.path ? "aside-selected-link" : ""}
                        href={link.path}
                    >
                        {link.title}
                    </Link>
                ))}
                <button className="btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default Aside; 