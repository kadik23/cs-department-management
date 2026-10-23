import React, { useState } from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentCardSliderModal from "@/components/teacher/StudentCardSliderModal";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Grades({
    grades = [],
    semester,
    teacherSubjects = [],
    teacherGroups = [],
    students = [],
}) {
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extract unique subjects from teacherSubjects and grades
    const availableSubjects = Array.from(
        new Map(
            [
                ...teacherSubjects,
                ...grades.map((g) => g.subject).filter(Boolean),
            ].map((s) => [String(s.id || s.subject_name), s])
        ).values()
    );

    const totalStudents = grades.length;
    const avgControl = totalStudents > 0
        ? (grades.reduce((sum, g) => sum + Number(g.control_note || 0), 0) / totalStudents).toFixed(2)
        : "0.00";
    const avgExam = totalStudents > 0
        ? (grades.reduce((sum, g) => sum + Number(g.exam_note || 0), 0) / totalStudents).toFixed(2)
        : "0.00";
    const avgOverall = totalStudents > 0
        ? (grades.reduce((sum, g) => sum + ((Number(g.control_note || 0) + Number(g.exam_note || 0)) / 2), 0) / totalStudents).toFixed(2)
        : "0.00";

    const filteredGrades = grades.filter((grade) => {
        // Text search
        if (search.trim()) {
            const query = search.toLowerCase();
            const studentName = `${grade.student?.user?.first_name || ""} ${grade.student?.user?.last_name || ""}`.toLowerCase();
            const username = (grade.student?.user?.username || "").toLowerCase();
            const subject = (grade.subject?.subject_name || "").toLowerCase();
            if (!studentName.includes(query) && !username.includes(query) && !subject.includes(query)) {
                return false;
            }
        }

        // Subject filter
        if (subjectFilter) {
            const subjId = grade.subject_id || grade.subject?.id;
            const subjName = grade.subject?.subject_name;
            if (String(subjId) !== String(subjectFilter) && subjName !== subjectFilter) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">Grades</div>
                <button
                    type="button"
                    className="btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ fontSize: "13px", padding: "8px 20px" }}
                >
                    + Enter Grades & Attendance
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
                        <div className="card-content">{totalStudents}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/teacher.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Avg Control</div>
                        <div className="card-content">{avgControl}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/students.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Avg Exam</div>
                        <div className="card-content">{avgExam}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/college.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Overall Avg</div>
                        <div className="card-content">{avgOverall}</div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
                <div className="section-content">
                    {semester && (
                        <div
                            style={{
                                width: "100%",
                                marginBottom: "15px",
                                padding: "10px 14px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "14px",
                                color: "#334155",
                            }}
                        >
                            <strong>Current Semester:</strong> {semester.semester_name} &nbsp;|&nbsp;{" "}
                            <strong>Period:</strong> {formatDate(semester.start_at)} to {formatDate(semester.end_at)}
                        </div>
                    )}

                    <div className="list-control" style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                        <div className="search" style={{ flex: "1 1 240px", maxWidth: "340px", height: "40px" }}>
                            <input
                                type="text"
                                placeholder="search by student..."
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

                        {/* Clear Filters */}
                        {(search || subjectFilter) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSubjectFilter("");
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
                            <div className="list-header-item">Control Note</div>
                            <div className="list-header-item">Exam Note</div>
                            <div className="list-header-item">Coefficient</div>
                            <div className="list-header-item">Credit</div>
                            <div className="list-header-item">Average</div>
                        </div>
                        <div className="list-body">
                            {filteredGrades.length > 0 ? (
                                filteredGrades.map((grade, idx) => {
                                    const average = ((Number(grade.control_note || 0) + Number(grade.exam_note || 0)) / 2).toFixed(2);
                                    return (
                                        <div className="list-row" key={idx}>
                                            <div className="list-item" style={{ flex: 2 }}>
                                                <div style={{ fontWeight: 600 }}>
                                                    {grade.student?.user?.first_name} {grade.student?.user?.last_name}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#64748b" }}>
                                                    {grade.student?.user?.username}
                                                </div>
                                            </div>
                                            <div className="list-item" style={{ flex: 2, fontWeight: 500 }}>
                                                {grade.subject?.subject_name}
                                            </div>
                                            <div className="list-item">
                                                {grade.control_note}
                                            </div>
                                            <div className="list-item">
                                                {grade.exam_note}
                                            </div>
                                            <div className="list-item">
                                                {grade.coefficient ?? grade.subject?.coefficient ?? "-"}
                                            </div>
                                            <div className="list-item">
                                                {grade.credit ?? grade.subject?.credit ?? "-"}
                                            </div>
                                            <div className="list-item" style={{ fontWeight: 600 }}>
                                                {average}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No grade records found.
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

Grades.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;
 