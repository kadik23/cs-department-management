import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

export default function Dashboard({ teacher, schedulesCount, lecturesCount, semester }) {
    return (
        <div className="page-content">
            <div className="page-header_teacher">
                <div className="page-title_teacher">Teacher Dashboard</div>
            </div>
            <div className="section-wrapper_teacher">
                <div className="section-content_teacher">
                    <div className="card-box_teacher">
                        <div className="card-header_teacher">
                            <h3>Welcome, {teacher?.user?.first_name} {teacher?.user?.last_name}</h3>
                        </div>
                        <div className="card-body_teacher">
                            <div className="teacher-info_teacher">
                                <p><strong>Username:</strong> {teacher?.user?.username}</p>
                                <p><strong>Email:</strong> {teacher?.user?.email}</p>
                                <p><strong>Teacher ID:</strong> {teacher?.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid_teacher">
                        <div className="stat-card_teacher">
                            <div className="stat-icon">
                                <img src="/assets/icons/teacher.svg" alt="schedule" />
                            </div>
                            <div className="stat-content_teacher">
                                <div className="stat-title_teacher">My Schedules</div>
                                <div className="stat-value_teacher">{schedulesCount}</div>
                            </div>
                        </div>

                        <div className="stat-card_teacher">
                            <div className="stat-icon">
                                <img src="/assets/icons/teacher.svg" alt="lectures" />
                            </div>
                            <div className="stat-content_teacher">
                                <div className="stat-title_teacher">My Lectures</div>
                                <div className="stat-value_teacher">{lecturesCount}</div>
                            </div>
                        </div>
                    </div>

                    {semester && (
                        <div className="card-box_teacher">
                            <div className="card-header_teacher">
                                <h3>Current Semester</h3>
                            </div>
                            <div className="card-body_teacher">
                                <div className="semester-info_teacher">
                                    <p><strong>Semester:</strong> {semester.semester_name}</p>
                                    <p><strong>Start Date:</strong> {semester.start_at}</p>
                                    <p><strong>End Date:</strong> {semester.end_at}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = page => <TeacherLayout>{page}</TeacherLayout>; 