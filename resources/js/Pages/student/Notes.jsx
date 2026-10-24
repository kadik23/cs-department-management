import React, { useState, useMemo } from "react";
import StudentLayout from "@/layout/student/StudentLayout";
import { exportToCsv } from "@/utils/exportCsv";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Notes({ student, grades = [], semester }) {
    const [search, setSearch] = useState("");

    const filteredGrades = useMemo(() => {
        if (!search) return grades;
        const q = search.toLowerCase();
        return grades.filter((row) =>
            (row.subject?.subject_name || "").toLowerCase().includes(q)
        );
    }, [grades, search]);

    const handleExport = () => {
        const headers = ["Subject", "Control Note", "Exam Note", "Coefficient", "Credit", "Subject Average"];
        const rows = filteredGrades.map((row) => {
            const subject = row.subject?.subject_name || "N/A";
            const control = row.control_note != null ? row.control_note : "";
            const exam = row.exam_note != null ? row.exam_note : "";
            const coef = row.subject?.coefficient ?? "";
            const credit = row.subject?.credit ?? "";
            let avg = "";
            if (row.control_note != null && row.exam_note != null) {
                avg = ((Number(row.control_note) + Number(row.exam_note)) / 2).toFixed(2);
            }
            return [subject, control, exam, coef, credit, avg];
        });

        const semName = semester?.semester_name ? semester.semester_name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'semester';
        const dateStr = new Date().toISOString().slice(0, 10);
        exportToCsv(`my_grades_${semName}_${dateStr}.csv`, headers, rows);
    };

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">Notes</div>
                <button
                    type="button"
                    onClick={handleExport}
                    className="btn"
                    style={{
                        fontSize: "13px",
                        padding: "8px 16px",
                        backgroundColor: "#0284c7",
                        borderColor: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export CSV/Excel
                </button>
            </div>
            <div className="section-wrapper">
                <div className="section-content">
                    {semester && (
                        <div style={{ marginBottom: "15px", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" }}>
                            <strong>Current Semester:</strong> {semester.semester_name} &nbsp;|&nbsp; <strong>Period:</strong> {formatDate(semester.start_at)} to {formatDate(semester.end_at)}
                        </div>
                    )}
                    <div className="list-control">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="search by subject..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item">Control Note</div>
                            <div className="list-header-item">Exam Note</div>
                            <div className="list-header-item">Coefficient</div>
                            <div className="list-header-item">Credit</div>
                            <div className="list-header-item">Subject Average</div>
                        </div>
                        <div className="list-body">
                            {filteredGrades.length === 0 ? (
                                <div className="list-row" style={{ justifyContent: "center", color: "#64748b", padding: "20px" }}>
                                    {search ? "No subjects match your search." : "No grades recorded yet."}
                                </div>
                            ) : (
                                filteredGrades.map((row, idx) => (
                                    <div className="list-row" key={idx}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600, color: "#0c4a6e" }}>
                                            {row.subject?.subject_name}
                                        </div>
                                        <div className="list-item">{row.control_note != null ? row.control_note : "—"}</div>
                                        <div className="list-item">{row.exam_note != null ? row.exam_note : "—"}</div>
                                        <div className="list-item">{row.subject?.coefficient ?? "—"}</div>
                                        <div className="list-item">{row.subject?.credit ?? "—"}</div>
                                        <div className="list-item" style={{ fontWeight: 600 }}>
                                            {row.control_note != null && row.exam_note != null
                                                ? ((Number(row.control_note) + Number(row.exam_note)) / 2).toFixed(2)
                                                : "—"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Notes.layout = page => <StudentLayout>{page}</StudentLayout>;
