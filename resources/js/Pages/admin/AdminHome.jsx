import React from "react";
import { Link } from "@inertiajs/react";

function AdminHome({ stats, recentAnnouncements = [] }) {
    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Dashboard</div>
                </div>
                <div className="row-wrapper">
                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/users.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Total users</div>
                            <div className="card-content">{stats.totalUsers}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/students.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Students</div>
                            <div className="card-content">{stats.totalStudents}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/teacher.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Teachers</div>
                            <div className="card-content">{stats.totalTeachers}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/college.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">College Year</div>
                            <div className="card-content">{stats.collegeYear}</div>
                        </div>
                    </div>
                </div>

                {/* Department Announcements Feed */}
                <div className="section-wrapper" style={{ marginTop: "24px" }}>
                    <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", marginBottom: "12px" }}>
                        <div className="section-title">Recent Announcements</div>
                        <Link
                            href="/admin/announcements"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#0284c7",
                                textDecoration: "none",
                            }}
                        >
                            Manage All &rarr;
                        </Link>
                    </div>

                    <div className="section-content" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {recentAnnouncements.length === 0 ? (
                            <div
                                style={{
                                    width: "100%",
                                    padding: "24px",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    textAlign: "center",
                                    color: "#64748b",
                                    fontSize: "13px",
                                }}
                            >
                                No announcements published yet.{" "}
                                <Link href="/admin/announcements" style={{ color: "#0284c7", fontWeight: 600 }}>
                                    Post an announcement
                                </Link>
                            </div>
                        ) : (
                            recentAnnouncements.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        width: "100%",
                                        padding: "14px 18px",
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: item.is_pinned ? "1.5px solid #0284c7" : "1px solid #e2e8f0",
                                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "12px",
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {item.is_pinned && (
                                                <span
                                                    style={{
                                                        fontSize: "10px",
                                                        fontWeight: 800,
                                                        padding: "2px 6px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "#fef9c3",
                                                        color: "#854d0e",
                                                        border: "1px solid #fde047",
                                                        fontFamily: "monospace",
                                                    }}
                                                >
                                                    PINNED
                                                </span>
                                            )}
                                            <span
                                                style={{
                                                    fontSize: "10px",
                                                    fontWeight: 800,
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    backgroundColor: item.priority === "urgent" ? "#fee2e2" : item.priority === "high" ? "#fef3c7" : "#e0f2fe",
                                                    color: item.priority === "urgent" ? "#b91c1c" : item.priority === "high" ? "#b45309" : "#0369a1",
                                                    border: `1px solid ${item.priority === "urgent" ? "#fca5a5" : item.priority === "high" ? "#fde68a" : "#bae6fd"}`,
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {item.priority.toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                                                {item.target_audience === "all" ? "Everyone" : item.target_audience === "teachers" ? "Teachers" : "Students"}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0c4a6e" }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "600px" }}>
                                            {item.content}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                            {new Date(item.published_at || item.created_at).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <Link
                                            href="/admin/announcements"
                                            style={{
                                                fontSize: "11px",
                                                color: "#0284c7",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            View &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
