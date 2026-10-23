import React, { useState } from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function Courses({ schedules = [], lectures = [] }) {
    const [scheduleSearch, setScheduleSearch] = useState("");
    const [lectureSearch, setLectureSearch] = useState("");

    const uniqueSubjects = new Set([
        ...schedules.map((s) => s.subject?.subject_name).filter(Boolean),
        ...lectures.map((l) => l.subject?.subject_name).filter(Boolean),
    ]).size;

    const uniqueDays = new Set(schedules.map((s) => s.day_of_week)).size;

    const filteredSchedules = schedules.filter((schedule) => {
        if (!scheduleSearch.trim()) return true;
        const query = scheduleSearch.toLowerCase();
        const subject = schedule.subject?.subject_name?.toLowerCase() || "";
        const day = weekDays[schedule.day_of_week]?.toLowerCase() || "";
        const group = `${schedule.group?.academicLevel?.speciality?.speciality_name || ""} L${schedule.group?.academicLevel?.level || ""} G${schedule.group?.group_number || ""}`.toLowerCase();
        const room = `${schedule.class_room?.resource_type || ""} ${schedule.class_room?.resource_number || ""}`.toLowerCase();
        return subject.includes(query) || day.includes(query) || group.includes(query) || room.includes(query);
    });

    const filteredLectures = lectures.filter((lecture) => {
        if (!lectureSearch.trim()) return true;
        const query = lectureSearch.toLowerCase();
        const subject = lecture.subject?.subject_name?.toLowerCase() || "";
        const level = `${lecture.academicLevel?.speciality?.speciality_name || ""} Level ${lecture.academicLevel?.level || ""}`.toLowerCase();
        const date = (lecture.date || "").toLowerCase();
        const room = `${lecture.class_room?.resource_type || ""} ${lecture.class_room?.resource_number || ""}`.toLowerCase();
        return subject.includes(query) || level.includes(query) || date.includes(query) || room.includes(query);
    });

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">My Courses</div>
            </div>

            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/teacher.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Schedules</div>
                        <div className="card-content">{schedules.length}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/students.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Lectures</div>
                        <div className="card-content">{lectures.length}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/college.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Subjects</div>
                        <div className="card-content">{uniqueSubjects}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img
                            className="card-box-bg"
                            src="/assets/icons/users.svg"
                            alt="card-bg"
                        />
                        <div className="card-title">Teaching Days</div>
                        <div className="card-content">{uniqueDays} Days/Wk</div>
                    </div>
                </div>
            </div>

            {/* Schedules Section */}
            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">Teaching Schedule</div>
                </div>
                <div className="section-content">
                    <div className="list-control">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="search schedules..."
                                value={scheduleSearch}
                                onChange={(e) => setScheduleSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item">Day</div>
                            <div className="list-header-item">Time</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Group</div>
                            <div className="list-header-item">Classroom</div>
                        </div>
                        <div className="list-body">
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule, idx) => (
                                    <div className="list-row" key={idx}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600 }}>
                                            {schedule.subject?.subject_name}
                                        </div>
                                        <div className="list-item">
                                            {weekDays[schedule.day_of_week]}
                                        </div>
                                        <div className="list-item">
                                            Slot {schedule.class_index + 1}
                                        </div>
                                        <div className="list-item" style={{ flex: 1.5 }}>
                                            {schedule.group?.academicLevel?.speciality?.speciality_name} - L{schedule.group?.academicLevel?.level} - G{schedule.group?.group_number}
                                        </div>
                                        <div className="list-item">
                                            {schedule.class_room?.resource_type} {schedule.class_room?.resource_number}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No teaching schedules found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lectures Section */}
            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">My Lectures</div>
                </div>
                <div className="section-content">
                    <div className="list-control">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="search lectures..."
                                value={lectureSearch}
                                onChange={(e) => setLectureSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Academic Level</div>
                            <div className="list-header-item">Date</div>
                            <div className="list-header-item">Time</div>
                            <div className="list-header-item">Classroom</div>
                        </div>
                        <div className="list-body">
                            {filteredLectures.length > 0 ? (
                                filteredLectures.map((lecture, idx) => (
                                    <div className="list-row" key={idx}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600 }}>
                                            {lecture.subject?.subject_name}
                                        </div>
                                        <div className="list-item" style={{ flex: 1.5 }}>
                                            {lecture.academicLevel?.speciality?.speciality_name} - Level {lecture.academicLevel?.level}
                                        </div>
                                        <div className="list-item">
                                            {lecture.date}
                                        </div>
                                        <div className="list-item">
                                            Slot {lecture.class_index + 1}
                                        </div>
                                        <div className="list-item">
                                            {lecture.class_room?.resource_type} {lecture.class_room?.resource_number}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No lectures found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Courses.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;