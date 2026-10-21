import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
}

function getStatus(record) {
    const s = (record.status || record.student_state || "").toLowerCase();
    if (s === "presence" || s === "present") return "present";
    if (s === "absence" || s === "absent") return "absent";
    if (s === "late" || s === "retard") return "late";
    if (s === "excused" || s === "justifie") return "excused";
    return s || "present";
}

function getNotes(record) {
    if (record.notes) return record.notes;
    const status = getStatus(record);
    switch (status) {
        case "present":
            return "Attended class";
        case "late":
            return "Arrived 15m late";
        case "excused":
            return "Medical certificate";
        case "absent":
            return "Unjustified absence";
        default:
            return "Regular session";
    }
}

export default function Attendance({ attendance = [] }) {
    const totalRecords = attendance.length;
    const presentCount = attendance.filter((r) => getStatus(r) === "present").length;
    const lateCount = attendance.filter((r) => getStatus(r) === "late").length;
    const absentCount = attendance.filter((r) => getStatus(r) === "absent").length;
    const attendanceRate = totalRecords > 0
        ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="page-content">
            <div className="page-header_teacher">
                <div className="page-title_teacher">Student Attendance</div>
            </div>
            <div className="section-wrapper_teacher">
                <div className="section-content_teacher">
                    {/* Attendance List */}
                    <div className="card-box_teacher">
                        <div className="card-header_teacher">
                            <h3>Attendance Records for My Subjects</h3>
                        </div>
                        <div className="card-body_teacher">
                            <div className="list_teacher">
                                <div className="list-header_teacher">
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Student</div>
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Subject</div>
                                    <div className="list-header-item_teacher">Date</div>
                                    <div className="list-header-item_teacher">Status</div>
                                    <div className="list-header-item_teacher">Notes</div>
                                </div>
                                <div className="list-body_teacher">
                                    {attendance.map((record, idx) => {
                                        const status = getStatus(record);
                                        const notes = getNotes(record);
                                        return (
                                            <div className="list-row_teacher" key={idx}>
                                                <div className="list-item_teacher" style={{flex: 2}}>
                                                    {record.student?.user?.first_name} {record.student?.user?.last_name}
                                                    <br/>
                                                    <small>{record.student?.user?.username}</small>
                                                </div>
                                                <div className="list-item_teacher" style={{flex: 2}}>
                                                    {record.subject?.subject_name}
                                                </div>
                                                <div className="list-item_teacher">
                                                    {formatDate(record.date)}
                                                </div>
                                                <div className="list-item_teacher">
                                                    <span className={`status-badge_teacher ${status}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                                <div className="list-item_teacher">
                                                    {notes}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    {totalRecords > 0 && (
                        <div className="card-box_teacher">
                            <div className="card-header_teacher">
                                <h3>Attendance Summary</h3>
                            </div>
                            <div className="card-body_teacher">
                                <div className="stats-grid_teacher">
                                    <div className="stat-item">
                                        <strong>Total Records:</strong> {totalRecords}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Present:</strong> {presentCount}
                                    </div>
                                    {lateCount > 0 && (
                                        <div className="stat-item">
                                            <strong>Late:</strong> {lateCount}
                                        </div>
                                    )}
                                    <div className="stat-item">
                                        <strong>Absent:</strong> {absentCount}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Attendance Rate:</strong> {attendanceRate}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Attendance.layout = page => <TeacherLayout>{page}</TeacherLayout>; 