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

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div>
                    <div className="page-title">My Schedule</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Weekly Teaching Timetable: Lectures (Cours) & Group Sessions (TD / TP)
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
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
        </div>
    );
}

Schedule.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;