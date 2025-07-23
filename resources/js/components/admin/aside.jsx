import React from 'react'
import { Link, usePage } from '@inertiajs/react'

function Aside() {
    const { url } = usePage();
    
    const aside_links = [
        {
            path: "/admin",
            title: "Dashboard",
        },
        {
            path: "/admin/accounts",
            title: "Accounts",
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
        }
    ];

    return (
        <aside>
            <div className="user-profile-pic">
                <img src={'/assets/images/student.jpg'} alt="profile picture"/>
            </div>
            <div className="user-name">Admin User</div>
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
                <a href="/logout">Log out</a>
            </nav>
        </aside>
    );
}

export default Aside;