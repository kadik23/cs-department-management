import React from "react";
import StudentLayout from "@/layout/student/StudentLayout";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Notes({ student, grades, semester }) {
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Notes</div>
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
                            <input type="text" placeholder="search..." />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{flex: 2}}>Subject</div>
                            <div className="list-header-item">Control Note</div>
                            <div className="list-header-item">Exam Note</div>
                            <div className="list-header-item">Coefficient</div>
                            <div className="list-header-item">Credit</div>
                            <div className="list-header-item">Subject Average</div>
                        </div>
                        <div className="list-body">
                            {grades.map((row, idx) => (
                                <div className="list-row" key={idx}>
                                    <div className="list-item" style={{flex: 2}}>{row.subject?.subject_name}</div>
                                    <div className="list-item">{row.control_note}</div>
                                    <div className="list-item">{row.exam_note}</div>
                                    <div className="list-item">{row.subject?.coefficient}</div>
                                    <div className="list-item">{row.subject?.credit}</div>
                                    <div className="list-item">{((Number(row.control_note) + Number(row.exam_note))/2).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Notes.layout = page => <StudentLayout>{page}</StudentLayout>; 