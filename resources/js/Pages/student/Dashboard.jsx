import React from "react";
import { Link } from "@inertiajs/react";
import StudentLayout from "@/layout/student/StudentLayout";

export default function Dashboard({ student, colleagues, semester, collegeYear, recentAnnouncements = [] }) {
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Home</div>
            </div>
            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Semestre</div>
                        <div className="card-content">{semester ? semester.semester_name : "Semester not started yet."}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Group</div>
                        <div className="card-content">{student.group?.group_number}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Study Year</div>
                        <div className="card-content">
                            {(() => {
                                const level = student.academic_level?.level ?? student.group?.academic_level?.level ?? student.level ?? 1;
                                return `${level > 3 ? level % 3 : level} Year ${level > 3 ? "Master " : "License "} ${student.group?.academic_level?.speciality?.speciality_name || ''}`;
                            })()}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">College Year</div>
                        <div className="card-content">{collegeYear || "2026/2027"}</div>
                    </div>
                </div>
            </div>

            {/* Department Announcements Feed */}
            <div className="section-wrapper">
                <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", marginBottom: "12px" }}>
                    <div className="section-title">Department Announcements</div>
                    <Link
                        href="/student/announcements"
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
                        View All &rarr;
                    </Link>
                </div>

                <div className="section-content" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {recentAnnouncements.length === 0 ? (
                        <div
                            style={{
                                width: "100%",
                                padding: "20px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                textAlign: "center",
                                color: "#64748b",
                                fontSize: "13px",
                            }}
                        >
                            No new announcements right now.
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
                                            {item.category.toUpperCase()}
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
                                        href="/student/announcements"
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

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">About me</div>
                </div>
                <div className="section-content">
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/email.svg" alt="" />
                        </div>
                        <div className="info-content">{student.user?.email}</div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/location.svg" alt="" />
                        </div>
                        <div className="info-content">Medea, Algeria</div>
                    </div>
                </div>
            </div>
            <div className="section-wrapper" style={{ overflow: "auto" }}>
                <div className="section-header">
                    <div className="section-title">My colleagues</div>
                </div>
                <div className="section-content" style={{ overflow: "auto" }}>
                    <div className="friends" style={{ overflow: "auto", marginBottom: 40 }}>
                        {colleagues.map((col, idx) => (
                            <div className="friend" key={idx}>
                                <div className="friend-profile-pic">
                                    <img src="/assets/images/student.jpg" alt="profile_image" />
                                </div>
                                <div className="friend-name">{col.first_name} {col.last_name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = page => <StudentLayout>{page}</StudentLayout>; 