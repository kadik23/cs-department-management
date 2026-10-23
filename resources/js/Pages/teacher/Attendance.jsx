import React, { useState } from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentCardSliderModal from "@/components/teacher/StudentCardSliderModal";

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
            return "Arrived late";
        case "excused":
            return "Medical certificate";
        case "absent":
            return "Unjustified absence";
        default:
            return "Regular session";
    }
}

export default function Attendance({
    attendance = [],
    teacherSubjects = [],
    teacherGroups = [],
    students = [],
    semester,
}) {
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extract unique subjects from teacherSubjects and attendance records
    const availableSubjects = Array.from(
        new Map(
            [
                ...teacherSubjects,
                ...attendance.map((a) => a.subject).filter(Boolean),
            ].map((s) => [String(s.id || s.subject_name), s])
        ).values()
    );

    const totalRecords = attendance.length;
    const presentCount = attendance.filter((r) => getStatus(r) === "present").length;
    const lateCount = attendance.filter((r) => getStatus(r) === "late").length;
    const absentCount = attendance.filter((r) => getStatus(r) === "absent").length;
    const attendanceRate = totalRecords > 0
        ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(1)
        : "0.0";

    const filteredAttendance = attendance.filter((record) => {
        // Text search filter (student name or username)
        if (search.trim()) {
            const query = search.toLowerCase();
            const studentName = `${record.student?.user?.first_name || ""} ${record.student?.user?.last_name || ""}`.toLowerCase();
            const username = (record.student?.user?.username || "").toLowerCase();
            const subject = (record.subject?.subject_name || "").toLowerCase();
            if (!studentName.includes(query) && !username.includes(query) && !subject.includes(query)) {
                return false;
            }
        }

        // Subject filter
        if (subjectFilter) {
            const subjId = record.subject_id || record.subject?.id;
            const subjName = record.subject?.subject_name;
            if (String(subjId) !== String(subjectFilter) && subjName !== subjectFilter) {
                return false;
            }
        }

        // Date filter
        if (dateFilter) {
            const recDate = formatDate(record.date);
            if (recDate !== dateFilter) {
                return false;
            }
        }

        // Status filter
        if (statusFilter) {
            const recStatus = getStatus(record);
            if (recStatus !== statusFilter) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">Attendance</div>
                <button
                    type="button"
                    className="btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ fontSize: "13px", padding: "8px 20px" }}
                >
                    + Register Attendance & Grades
                </button>
            </div>

            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/users.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Total Records</div>
                        <div className="card-content">{totalRecords}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/teacher.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Present</div>
                        <div className="card-content">{presentCount}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/students.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Absent / Late</div>
                        <div className="card-content">{absentCount} / {lateCount}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/college.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Attendance Rate</div>
                        <div className="card-content">{attendanceRate}%</div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">Attendance Records</div>
                </div>
                <div className="section-content">
                    <div className="list-control" style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                        <div className="search" style={{ flex: "1 1 220px", maxWidth: "300px", height: "40px" }}>
                            <input
                                type="text"
                                placeholder="search student..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>

                        {/* Filter by Subject */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <select
                                value={subjectFilter}
                                onChange={(e) => setSubjectFilter(e.target.value)}
                                style={{
                                    height: "40px",
                                    padding: "0 14px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "7px",
                                    color: "#0c4a6e",
                                    fontFamily: "monospace",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">All Subjects</option>
                                {availableSubjects.map((sub, i) => (
                                    <option key={sub.id || i} value={sub.id || sub.subject_name}>
                                        {sub.subject_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter by Date */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                title="Filter by attendance date"
                                style={{
                                    height: "40px",
                                    padding: "0 12px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "7px",
                                    color: "#0c4a6e",
                                    fontFamily: "monospace",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            />
                        </div>

                        {/* Filter by Status */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    height: "40px",
                                    padding: "0 14px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "7px",
                                    color: "#0c4a6e",
                                    fontFamily: "monospace",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {(search || subjectFilter || dateFilter || statusFilter) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSubjectFilter("");
                                    setDateFilter("");
                                    setStatusFilter("");
                                }}
                                style={{
                                    height: "40px",
                                    padding: "0 14px",
                                    backgroundColor: "transparent",
                                    border: "1px dashed #94a3b8",
                                    borderRadius: "7px",
                                    color: "#64748b",
                                    fontFamily: "monospace",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Student</div>
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item">Date</div>
                            <div className="list-header-item">Status</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Notes</div>
                        </div>
                        <div className="list-body">
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((record, idx) => {
                                    const status = getStatus(record);
                                    const notes = getNotes(record);
                                    return (
                                        <div className="list-row" key={idx}>
                                            <div className="list-item" style={{ flex: 2 }}>
                                                <div style={{ fontWeight: 600 }}>
                                                    {record.student?.user?.first_name} {record.student?.user?.last_name}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#64748b" }}>
                                                    {record.student?.user?.username}
                                                </div>
                                            </div>
                                            <div className="list-item" style={{ flex: 2, fontWeight: 500 }}>
                                                {record.subject?.subject_name}
                                            </div>
                                            <div className="list-item">
                                                {formatDate(record.date)}
                                            </div>
                                            <div className="list-item">
                                                <span className={`status-badge ${status}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="list-item" style={{ flex: 1.5, color: "#475569" }}>
                                                {notes}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No attendance records found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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

Attendance.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;
 