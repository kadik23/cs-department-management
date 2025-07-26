import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

export default function Attendance({ attendance }) {
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
                                    {attendance.map((record, idx) => (
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
                                                {record.date}
                                            </div>
                                            <div className="list-item_teacher">
                                                <span className={`status-badge_teacher ${record.status === 'present' ? 'present' : 'absent'}`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <div className="list-item_teacher">
                                                {record.notes || '-'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    {attendance.length > 0 && (
                        <div className="card-box_teacher">
                            <div className="card-header_teacher">
                                <h3>Attendance Summary</h3>
                            </div>
                            <div className="card-body_teacher">
                                <div className="stats-grid_teacher">
                                    <div className="stat-item">
                                        <strong>Total Records:</strong> {attendance.length}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Present:</strong> {attendance.filter(record => record.status === 'present').length}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Absent:</strong> {attendance.filter(record => record.status === 'absent').length}
                                    </div>
                                    <div className="stat-item">
                                        <strong>Attendance Rate:</strong> {
                                            ((attendance.filter(record => record.status === 'present').length / attendance.length) * 100).toFixed(1)
                                        }%
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