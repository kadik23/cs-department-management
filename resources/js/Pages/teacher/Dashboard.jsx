import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentCardSliderModal from "@/components/teacher/StudentCardSliderModal";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Dashboard({
    teacher,
    schedulesCount,
    lecturesCount,
    semester,
    teacherSubjects = [],
    teacherGroups = [],
    students = [],
    recentAnnouncements = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">Dashboard</div>
                <button
                    type="button"
                    className="btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ fontSize: "13px", padding: "8px 20px" }}
                >
                    + Register Grades & Attendance
                </button>
            </div>

            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/college.svg"
                            alt="semester-bg"
                        />
                        <div className="card-title">Semester</div>
                        <div className="card-content">
                            {semester ? semester.semester_name : "Semester not started yet."}
                        </div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/teacher.svg"
                            alt="schedules-bg"
                        />
                        <div className="card-title">My Schedules</div>
                        <div className="card-content">{schedulesCount ?? 0}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/students.svg"
                            alt="lectures-bg"
                        />
                        <div className="card-title">My Lectures</div>
                        <div className="card-content">{lecturesCount ?? 0}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/users.svg"
                            alt="teacher-id-bg"
                        />
                        <div className="card-title">Teacher ID</div>
                        <div className="card-content">
                            {teacher?.id ? `#${teacher.id}` : "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">About me</div>
                </div>
                <div className="section-content">
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/teacher.svg" alt="" />
                        </div>
                        <div className="info-content">
                            {teacher?.user?.first_name} {teacher?.user?.last_name}
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/users.svg" alt="" />
                        </div>
                        <div className="info-content">
                            Username: {teacher?.user?.username}
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/email.svg" alt="" />
                        </div>
                        <div className="info-content">{teacher?.user?.email}</div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/location.svg" alt="" />
                        </div>
                        <div className="info-content">Computer Science Department, Medea</div>
                    </div>
                </div>
            </div>

            {/* Department Announcements Feed */}
            <div className="section-wrapper">
                <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%", marginBottom: "12px" }}>
                    <div className="section-title">Department Announcements</div>
                    <Link
                        href="/teacher/announcements"
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
                            No active announcements right now.
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
                                        href="/teacher/announcements"
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

            {semester && (
                <div className="section-wrapper">
                    <div className="section-header">
                        <div className="section-title">Current Semester</div>
                    </div>
                    <div className="section-content">
                        <div
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "14px",
                                color: "#334155",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <div>
                                <strong>Semester:</strong> {semester.semester_name}
                            </div>
                            <div>
                                <strong>Start Date:</strong> {formatDate(semester.start_at)}
                            </div>
                            <div>
                                <strong>End Date:</strong> {formatDate(semester.end_at)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <StudentCardSliderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                students={students}
                subjects={teacherSubjects}
                groups={teacherGroups}
                semester={semester}
            />
        </div>
    );
}

Dashboard.layout = (page) => <TeacherLayout>{page}</TeacherLayout>; 