import React from "react";
import StudentLayout from "@/layout/student/StudentLayout";

export default function Dashboard({ student, colleagues, semester }) {
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Home</div>
            </div>
            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Semestre</div>
                        <div className="card-content">{semester ? semester.semester_name : "Semester not started yet."}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Group</div>
                        <div className="card-content">{student.group?.group_number}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">Study Year</div>
                        <div className="card-content">
                            {student.level > 3 ? student.level % 3 : student.level} Year {student.level > 3 ? "Master " : "License "}{student.group?.academic_level?.speciality?.speciality_name}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <div className="card-title">College Year</div>
                        <div className="card-content">2022/2023</div>
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
                            <img src="/assets/icons/email.svg" alt="" />
                        </div>
                        <div className="info-content">{student.user?.email}</div>
                    </div>
                    <div className="info-wrapper">
                        <div className="info-icon">
                            <img src="/assets/icons/location.svg" alt="" />
                        </div>
                        <div className="info-content">Medea, Algeria</div>
                    </div>
                </div>
            </div>
            <div className="section-wrapper" style={{ overflow: "auto" }}>
                <div className="section-header">
                    <div className="section-title">My colleagues</div>
                </div>
                <div className="section-content" style={{ overflow: "auto" }}>
                    <div className="friends" style={{ overflow: "auto", marginBottom: 40 }}>
                        {colleagues.map((col, idx) => (
                            <div className="friend" key={idx}>
                                <div className="friend-profile-pic">
                                    <img src="/assets/images/student.jpg" alt="profile_image" />
                                </div>
                                <div className="friend-name">{col.first_name} {col.last_name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = page => <StudentLayout>{page}</StudentLayout>; 