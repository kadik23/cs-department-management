import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

export default function Grades({ grades, semester }) {
    return (
        <div className="page-content">
            <div className="page-header_teacher">
                <div className="page-title_teacher">Student Grades</div>
            </div>
            <div className="section-wrapper_teacher">
                <div className="section-content_teacher">
                    {semester && (
                        <div className="card-box_teacher">
                            <div className="card-header_teacher">
                                <h3>Current Semester: {semester.semester_name}</h3>
                            </div>
                            <div className="card-body_teacher">
                                <p><strong>Period:</strong> {semester.start_at} to {semester.end_at}</p>
                            </div>
                        </div>
                    )}

                    <div className="card-box_teacher">
                        <div className="card-header_teacher">
                            <h3>Grades for My Subjects</h3>
                        </div>
                        <div className="card-body_teacher">
                            <div className="list_teacher">
                                <div className="list-header_teacher">
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Student</div>
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Subject</div>
                                    <div className="list-header-item_teacher">Control Note</div>
                                    <div className="list-header-item_teacher">Exam Note</div>
                                    <div className="list-header-item_teacher">Coefficient</div>
                                    <div className="list-header-item_teacher">Credit</div>
                                    <div className="list-header-item_teacher">Average</div>
                                </div>
                                <div className="list-body_teacher">
                                    {grades.map((grade, idx) => (
                                        <div className="list-row_teacher" key={idx}>
                                            <div className="list-item_teacher" style={{flex: 2}}>
                                                {grade.student?.user?.first_name} {grade.student?.user?.last_name}
                                                <br/>
                                                <small>{grade.student?.user?.username}</small>
                                            </div>
                                            <div className="list-item_teacher" style={{flex: 2}}>
                                                {grade.subject?.subject_name}
                                            </div>
                                            <div className="list-item_teacher">
                                                {grade.control_note}
                                            </div>
                                            <div className="list-item_teacher">
                                                {grade.exam_note}
                                            </div>
                                            <div className="list-item_teacher">
                                                {grade.coefficient}
                                            </div>
                                            <div className="list-item_teacher">
                                                {grade.credit}
                                            </div>
                                            <div className="list-item_teacher">
                                                {((Number(grade.control_note) + Number(grade.exam_note))/2).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {grades.length > 0 && (
                        <div className="card-box_teacher">
                            <div className="card-header_teacher">
                                <h3>Summary Statistics</h3>
                            </div>
                            <div className="card-body_teacher">
                                <div className="stats-grid_teacher">
                                    <div className="stat-item">
                                        <strong>Total Students:</strong> {grades.length}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Average Control Note:</strong> {
                                            (grades.reduce((sum, grade) => sum + Number(grade.control_note), 0) / grades.length).toFixed(2)
                                        }
                                    </div>
                                    <div className="stat-item">
                                        <strong>Average Exam Note:</strong> {
                                            (grades.reduce((sum, grade) => sum + Number(grade.exam_note), 0) / grades.length).toFixed(2)
                                        }
                                    </div>
                                    <div className="stat-item">
                                        <strong>Overall Average:</strong> {
                                            (grades.reduce((sum, grade) => sum + ((Number(grade.control_note) + Number(grade.exam_note))/2), 0) / grades.length).toFixed(2)
                                        }
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

Grades.layout = page => <TeacherLayout>{page}</TeacherLayout>; 