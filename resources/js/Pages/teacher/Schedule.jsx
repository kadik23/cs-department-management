import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

function parseTime(minutes, firstHour = 8) {
    const h = Math.floor(minutes / 60) + firstHour;
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function Schedule({ teacher, schedule = [], settings = { class_duration: 60, first_class_start_at: "08:00" } }) {
    const duration = settings?.class_duration || 60;
    const firstHour = parseInt(settings?.first_class_start_at?.substr(0, 2) || "8", 10);

    // Build a 6x6 timetable grid (6 days: Sat-Thu, up to 6 slots)
    const table = Array.from({ length: 6 }, () => Array(6).fill(null));
    schedule.forEach((item) => {
        if (item.day_of_week != null && table[item.day_of_week]) {
            table[item.day_of_week][item.class_index] = item;
        }
    });

    const teacherName = teacher?.user ? `${teacher.user.first_name} ${teacher.user.last_name}` : "Faculty Member";
    const teacherEmail = teacher?.user?.email || "N/A";
    const teacherId = teacher?.id ? `FAC-${String(teacher.id).padStart(5, "0")}` : "N/A";

    return (
        <div className="page-content">
            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 8mm;
                    }
                }
            `}</style>

            {/* Official Print Header - Displays ONLY during print/PDF export */}
            <div className="official-print-header print-only">
                <div className="ministry-block">
                    <div className="republic-title">People's Democratic Republic of Algeria</div>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                        Ministry of Higher Education and Scientific Research
                    </div>
                    <div className="dept-title">
                        Faculty of Exact Sciences • Department of Computer Science
                    </div>
                </div>

                <div className="doc-banner">
                    <div>
                        <div className="doc-name">Faculty Teaching Timetable</div>
                        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            Emploi du temps d'enseignement hebdomadaire
                        </div>
                    </div>
                    <div className="doc-meta">
                        <div><strong>Academic Year:</strong> 2025 / 2026</div>
                        <div><strong>Generated:</strong> {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
                    </div>
                </div>

                <div className="print-info-grid" style={{ marginTop: "10px" }}>
                    <div className="print-info-item">
                        <span className="print-info-label">Instructor / Professor</span>
                        <span className="print-info-val">{teacherName}</span>
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Faculty ID</span>
                        <span className="print-info-val">{teacherId}</span>
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Department</span>
                        <span className="print-info-val">Computer Science</span>
                    </div>
                    <div className="print-info-item">
                        <span className="print-info-label">Official Email</span>
                        <span className="print-info-val">{teacherEmail}</span>
                    </div>
                </div>
            </div>

            <div className="page-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div className="page-title">My Schedule</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Weekly Teaching Timetable: Lectures (Cours) & Group Sessions (TD / TP)
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 18px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            boxShadow: "0 1px 3px rgba(2, 132, 199, 0.25)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                        title="Print or Export Teaching Timetable to PDF"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>Print Timetable</span>
                    </button>
                </div>
            </div>

            <div className="section-wrapper timetable-print-wrapper">
                <div className="section-content">
                    <div className="table-head">
                        <div className="table-head-item">Days</div>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div className="table-head-item" key={i}>
                                {parseTime(i * duration, firstHour)}
                                {" to "}
                                {parseTime((i + 1) * duration, firstHour)}
                            </div>
                        ))}
                    </div>
                    <div className="table-body">
                        {table.map((row, dayIdx) => (
                            <div className="table-row" key={dayIdx}>
                                <div className="table-item">{weekDays[dayIdx]}</div>
                                {row.map((cell, slotIdx) => (
                                    <div className="table-item" key={slotIdx}>
                                        {cell ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <div>
                                                    <span
                                                        style={{
                                                            fontSize: "10px",
                                                            fontWeight: 800,
                                                            padding: "2px 7px",
                                                            borderRadius: "4px",
                                                            backgroundColor: cell.is_lecture ? "#e0f2fe" : "#dcfce7",
                                                            color: cell.is_lecture ? "#0369a1" : "#15803d",
                                                            border: cell.is_lecture ? "1px solid #bae6fd" : "1px solid #bbf7d0",
                                                            fontFamily: "monospace",
                                                        }}
                                                    >
                                                        {cell.is_lecture ? "📘 Cours (Amphi)" : "💻 TD / TP"}
                                                    </span>
                                                </div>

                                                <div className="subject_name" style={{ fontWeight: 700, fontSize: "13px", color: "#0c4a6e" }}>
                                                    {cell.subject?.subject_name}
                                                </div>

                                                <div className="class_info" style={{ marginTop: "2px", fontSize: "11px", color: "#475569" }}>
                                                    <div className="group_info" style={{ fontWeight: 600 }}>
                                                        {cell.is_lecture ? (
                                                            <span>
                                                                👥 {cell.academic_level?.speciality?.speciality_name || cell.academicLevel?.speciality?.speciality_name} L{cell.academic_level?.level || cell.academicLevel?.level} (All Groups)
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                👥 Group {cell.group?.group_number || "N/A"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="class_room" style={{ fontWeight: 600, color: "#0284c7", marginTop: "2px" }}>
                                                        📍 {cell.classRoom?.resource_type} {cell.classRoom?.resource_number}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            "Empty"
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Official Print Footer - Displays ONLY during print/PDF export */}
            <div className="official-print-footer print-only" style={{ marginTop: "14px", paddingTop: "8px", borderTop: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b" }}>
                <div>Computer Science Department Management System • Academic Year 2025/2026</div>
                <div>Faculty Teaching Timetable Validation • Department Head</div>
                <div>Official Document</div>
            </div>
        </div>
    );
}

Schedule.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;