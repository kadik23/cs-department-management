import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function Courses({ schedules, lectures }) {
    return (
        <div className="page-content">
            <div className="page-header_teacher">
                <div className="page-title_teacher">My Courses</div>
            </div>
            <div className="section-wrapper_teacher">
                <div className="section-content_teacher">
                    {/* Schedules Section */}
                    <div className="card-box_teacher">
                        <div className="card-header_teacher">
                            <h3>My Teaching Schedule</h3>
                        </div>
                        <div className="card-body_teacher">
                            <div className="list_teacher">
                                <div className="list-header_teacher">
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Subject</div>
                                    <div className="list-header-item_teacher">Day</div>
                                    <div className="list-header-item_teacher">Time</div>
                                    <div className="list-header-item_teacher">Group</div>
                                    <div className="list-header-item_teacher">Classroom</div>
                                </div>
                                <div className="list-body_teacher">
                                    {schedules.map((schedule, idx) => (
                                        <div className="list-row_teacher" key={idx}>
                                            <div className="list-item_teacher" style={{flex: 2}}>
                                                {schedule.subject?.subject_name}
                                            </div>
                                            <div className="list-item_teacher">
                                                {weekDays[schedule.day_of_week]}
                                            </div>
                                            <div className="list-item_teacher">
                                                Slot {schedule.class_index + 1}
                                            </div>
                                            <div className="list-item_teacher">
                                                {schedule.group?.academicLevel?.speciality?.speciality_name} - 
                                                L{schedule.group?.academicLevel?.level} - 
                                                G{schedule.group?.group_number}
                                            </div>
                                            <div className="list-item_teacher">
                                                {schedule.class_room?.resource_type} {schedule.class_room?.resource_number}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lectures Section */}
                    <div className="card-box_teacher">
                        <div className="card-header_teacher">
                            <h3>My Lectures</h3>
                        </div>
                        <div className="card-body_teacher">
                            <div className="list_teacher">
                                <div className="list-header_teacher">
                                    <div className="list-header-item_teacher" style={{flex: 2}}>Subject</div>
                                    <div className="list-header-item_teacher">Academic Level</div>
                                    <div className="list-header-item_teacher">Date</div>
                                    <div className="list-header-item_teacher">Time</div>
                                    <div className="list-header-item_teacher">Classroom</div>
                                </div>
                                <div className="list-body_teacher">
                                    {lectures.map((lecture, idx) => (
                                        <div className="list-row_teacher" key={idx}>
                                            <div className="list-item_teacher" style={{flex: 2}}>
                                                {lecture.subject?.subject_name}
                                            </div>
                                            <div className="list-item_teacher">
                                                {lecture.academicLevel?.speciality?.speciality_name} - 
                                                Level {lecture.academicLevel?.level}
                                            </div>
                                            <div className="list-item_teacher">
                                                {lecture.date}
                                            </div>
                                            <div className="list-item_teacher">
                                                Slot {lecture.class_index + 1}
                                            </div>
                                            <div className="list-item_teacher">
                                                {lecture.class_room?.resource_type} {lecture.class_room?.resource_number}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Courses.layout = page => <TeacherLayout>{page}</TeacherLayout>;