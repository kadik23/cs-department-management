import React from "react";
import StudentLayout from "@/layout/student/StudentLayout";

function parseTime(minutes, firstHour = 8, firstMinute = 0) {
    const h = Math.floor(minutes / 60) + firstHour;
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function Exams({ student, exams, settings }) {
    const firstExamStart = settings.first_exam_start_at ? settings.first_exam_start_at.split(":").map(Number) : [8,0];
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Exams Schudeler</div>
            </div>
            <div className="section-wrapper">
                <div className="list">
                    <div className="list-header">
                        <div className="list-header-item">Room Number</div>
                        <div className="list-header-item">Day</div>
                        <div className="list-header-item">Start At</div>
                        <div className="list-header-item">End At</div>
                        <div className="list-header-item" style={{flex: 2}}>Subject</div>
                    </div>
                    <div className="list-body">
                        {exams.map((row, idx) => {
                            const fromCalc = row.class_index * settings.exam_duration + firstExamStart[1];
                            const fromHours = Math.floor(fromCalc / 60) + firstExamStart[0];
                            const fromMinutes = fromCalc % 60;
                            const toCalc = (row.class_index + 1) * settings.exam_duration + firstExamStart[1];
                            const toHours = Math.floor(toCalc / 60) + firstExamStart[0];
                            const toMinutes = toCalc % 60;
                            return (
                                <div className="list-row" key={idx}>
                                    <div className="list-item">{row.class_room?.resource_type} {row.class_room?.resource_number}</div>
                                    <div className="list-item">{row.date}</div>
                                    <div className="list-item">{`${fromHours.toString().padStart(2,"0")}:${fromMinutes.toString().padStart(2,"0")}`}</div>
                                    <div className="list-item">{`${toHours.toString().padStart(2,"0")}:${toMinutes.toString().padStart(2,"0")}`}</div>
                                    <div className="list-item" style={{flex: 2}}>{row.subject?.subject_name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

Exams.layout = page => <StudentLayout>{page}</StudentLayout>; 