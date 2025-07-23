import React from "react";

function AdminHome({ stats }) {
    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Dashboard</div>
                </div>
                <div className="row-wrapper">
                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/users.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Total users</div>
                            <div className="card-content">{stats.totalUsers}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/students.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Students</div>
                            <div className="card-content">{stats.totalStudents}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/teacher.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">Teachers</div>
                            <div className="card-content">{stats.totalTeachers}</div>
                        </div>
                    </div>

                    <div className="card-box-wrapper">
                        <div className="card-box">
                            <img
                                className="card-box-bg"
                                src="/assets/icons/college.svg"
                                alt="card-box-bg"
                            />
                            <div className="card-title">College Year</div>
                            <div className="card-content">{stats.collegeYear}</div>
                        </div>
                    </div>
                </div>
                <div className="section-wrapper">
                    <div className="section-header">
                        <div className="section-title">Latest changes</div>
                    </div>
                    <div className="section-content"></div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
