import React from "react";
import StudentLayout from "@/layout/student/StudentLayout";

export default function Notes({ student, grades }) {
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Notes</div>
            </div>
            <div className="section-wrapper">
                <div className="section-content">
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