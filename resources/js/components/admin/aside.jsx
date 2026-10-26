import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../state/auth/authSlice"; // adjust path if needed

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
            path: "/admin",
            title: "Dashboard",
        },
        {
            path: "/admin/announcements",
            title: "Announcements",
        },
        {
            path: "/admin/accounts",
            title: "Accounts",
        },
        {
            path: "/admin/semesters",
            title: "Semesters",
        },
        {
            path: "/admin/academic-levels",
            title: "Academic Levels",
        },
        {
            path: "/admin/schedules",
            title: "Schedules",
        },
        {
            path: "/admin/exams",
            title: "Exams Schedules",
        },
        {
            path: "/admin/lectures",
            title: "Lectures",
        },
        {
            path: "/admin/resources",
            title: "Resources",
        },
        {
            path: "/admin/students",
            title: "Students"
        },
        {
            path: "/admin/groups",
            title: "Groups"
        },
        {
            path: "/admin/subjects",
            title: "Subjects"
        },
        {
            path: "/admin/specialities",
            title: "Specialities"
        },
        {
            path: "/admin/profile",
            title: "Profile Settings"
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

    const adminName = auth?.user?.first_name ? `${auth.user.first_name} ${auth.user.last_name}` : "Admin User";

    return (
        <aside>
            <Link href="/admin/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="user-profile-pic">
                    <img src={'/assets/images/student.jpg'} alt="profile picture"/>
                </div>
                <div className="user-name">{adminName}</div>
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