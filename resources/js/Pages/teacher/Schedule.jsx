import React from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

function parseTime(minutes, firstHour = 8) {
    const h = Math.floor(minutes / 60) + firstHour;
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function Schedule({ schedule, settings }) {
    // Build a 6x5 table (6 days, 5 slots)
    const table = Array.from({ length: 6 }, () => Array(5).fill(null));
    schedule.forEach(item => {
        table[item.day_of_week][item.class_index] = item;
    });
    
    return (
        <div className="page-content">
            <div className="page-header_teacher">
                <div className="page-title_teacher">My Schedule</div>
            </div>
            <div className="section-wrapper_teacher">
                <div className="section-content_teacher">
                    <div className="table-head">
                        <div className="table-head-item">Days</div>
                        {[0,1,2,3,4].map(i => (
                            <div className="table-head-item" key={i}>
                                {parseTime(i * settings.class_duration, parseInt(settings.first_class_start_at.substr(0,2)))}
                                {" to "}
                                {parseTime((i+1) * settings.class_duration, parseInt(settings.first_class_start_at.substr(0,2)))}
                            </div>
                        ))}
                    </div>
                    <div className="table-body">
                        {table.map((row, dayIdx) => (
                            <div className="table-row" key={dayIdx}>
                                <div className="table-item">{weekDays[dayIdx]}</div>
                                {row.map((cell, slotIdx) => (
                                    <div className="table-item" key={slotIdx}>
                                        {cell ? (
                                            <>
                                                <div className="subject_name">{cell.subject?.subject_name}<br/></div>
                                                <div className="class_info">
                                                    <div className="group_info">
                                                        {cell.group?.academicLevel?.speciality?.speciality_name} - 
                                                        Level {cell.group?.academicLevel?.level} - 
                                                        Group {cell.group?.group_number}
                                                    </div>
                                                    <div className="class_room">{cell.classRoom?.resource_type} {cell.classRoom?.resource_number}</div>
                                                </div>
                                            </>
                                        ) : "Empty"}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

Schedule.layout = page => <TeacherLayout>{page}</TeacherLayout>; 