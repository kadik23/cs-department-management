import React, { useState } from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import StudentCardSliderModal from "@/components/teacher/StudentCardSliderModal";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Dashboard({
    teacher,
    schedulesCount,
    lecturesCount,
    semester,
    teacherSubjects = [],
    teacherGroups = [],
    students = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">Dashboard</div>
                <button
                    type="button"
                    className="btn"
                    onClick={() => setIsModalOpen(true)}
                    style={{ fontSize: "13px", padding: "8px 20px" }}
                >
                    + Register Grades & Attendance
                </button>
            </div>

            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/college.svg"
                            alt="semester-bg"
                        />
                        <div className="card-title">Semester</div>
                        <div className="card-content">
                            {semester ? semester.semester_name : "Semester not started yet."}
                        </div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/teacher.svg"
                            alt="schedules-bg"
                        />
                        <div className="card-title">My Schedules</div>
                        <div className="card-content">{schedulesCount ?? 0}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/students.svg"
                            alt="lectures-bg"
                        />
                        <div className="card-title">My Lectures</div>
                        <div className="card-content">{lecturesCount ?? 0}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/users.svg"
                            alt="teacher-id-bg"
                        />
                        <div className="card-title">Teacher ID</div>
                        <div className="card-content">
                            {teacher?.id ? `#${teacher.id}` : "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">About me</div>
                </div>
                <div className="section-content">
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/teacher.svg" alt="" />
                        </div>
                        <div className="info-content">
                            {teacher?.user?.first_name} {teacher?.user?.last_name}
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/users.svg" alt="" />
                        </div>
                        <div className="info-content">
                            Username: {teacher?.user?.username}
                        </div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/email.svg" alt="" />
                        </div>
                        <div className="info-content">{teacher?.user?.email}</div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/location.svg" alt="" />
                        </div>
                        <div className="info-content">Computer Science Department, Medea</div>
                    </div>
                </div>
            </div>

            {semester && (
                <div className="section-wrapper">
                    <div className="section-header">
                        <div className="section-title">Current Semester</div>
                    </div>
                    <div className="section-content">
                        <div
                            style={{
                                width: "100%",
                                padding: "14px 18px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "14px",
                                color: "#334155",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <div>
                                <strong>Semester:</strong> {semester.semester_name}
                            </div>
                            <div>
                                <strong>Start Date:</strong> {formatDate(semester.start_at)}
                            </div>
                            <div>
                                <strong>End Date:</strong> {formatDate(semester.end_at)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

Dashboard.layout = (page) => <TeacherLayout>{page}</TeacherLayout>; 