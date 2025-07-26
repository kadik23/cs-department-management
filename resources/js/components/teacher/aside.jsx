import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../state/auth/authSlice";

function Aside() {
    const { url } = usePage();
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
            path: "/teacher/courses",
            title: "My Courses",
        },
        {
            path: "/teacher/schedule",
            title: "Schedule",
        },
        {
            path: "/teacher/grades",
            title: "Grades",
        },
        {
            path: "/teacher/attendance",
            title: "Attendance",
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

    return (
        <aside>
            <div className="user-profile-pic">
                <img src={'/assets/images/teacher.png'} alt="profile picture"/>
            </div>
            <div className="user-name">Teacher</div>
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