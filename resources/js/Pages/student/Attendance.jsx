import React, { useState, useMemo } from "react";
import StudentLayout from "@/layout/student/StudentLayout";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return typeof dateStr === 'string' ? dateStr.substring(0, 10) : dateStr;
};

export default function Attendance({ student, attendances = [], semester, summary = {}, subjects = [] }) {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const filteredAttendances = useMemo(() => {
        return attendances.filter((item) => {
            if (selectedSubject && String(item.subject_id) !== String(selectedSubject)) {
                return false;
            }
            if (selectedStatus && item.status !== selectedStatus) {
                return false;
            }
            if (selectedDate && formatDate(item.date) !== selectedDate) {
                return false;
            }
            return true;
        });
    }, [attendances, selectedSubject, selectedStatus, selectedDate]);

    const handleResetFilters = () => {
        setSelectedSubject("");
        setSelectedStatus("");
        setSelectedDate("");
    };

    const hasFilters = Boolean(selectedSubject || selectedStatus || selectedDate);

    const totalCount = summary.total || 0;
    const presentCount = summary.present || 0;
    const absentCount = summary.absent || 0;
    const lateCount = summary.late || 0;
    const excusedCount = summary.excused || 0;
    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'present':
                return {
                    backgroundColor: '#ccfbf1',
                    color: '#0f766e',
                    border: '1px solid #99f6e4'
                };
            case 'absent':
                return {
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca'
                };
            case 'late':
                return {
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    border: '1px solid #fde68a'
                };
            case 'excused':
                return {
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    border: '1px solid #bae6fd'
                };
            default:
                return {
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0'
                };
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title">Attendance</div>
            </div>

            {semester && (
                <div 
                    style={{ 
                        width: 'calc(100% * 11/12)',
                        marginBottom: "20px", 
                        padding: "12px 18px", 
                        backgroundColor: "#f8fafc", 
                        borderRadius: "8px", 
                        border: "1px solid #e2e8f0", 
                        fontSize: "13px", 
                        color: "#334155" 
                    }}
                >
                    <strong>Current Semester:</strong> {semester.semester_name} &nbsp;|&nbsp; 
                    <strong>Period:</strong> {formatDate(semester.start_at)} to {formatDate(semester.end_at)}
                </div>
            )}

            {/* Stat Summary Cards */}
            <div className="row-wrapper" style={{ width: 'calc(100% * 11/12)', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#64748b' }}>Total Sessions</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: '#0c4a6e' }}>
                            {totalCount}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#0f766e' }}>Present</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f766e' }}>
                            {presentCount}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#b91c1c' }}>Absent</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: '#b91c1c' }}>
                            {absentCount}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#b45309' }}>Late</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: '#b45309' }}>
                            {lateCount}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#0369a1' }}>Excused</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: '#0369a1' }}>
                            {excusedCount}
                        </div>
                    </div>
                </div>
                <div className="card-box-wrapper" style={{ flex: '1 1 150px' }}>
                    <div className="card-box" style={{ padding: '16px' }}>
                        <div className="card-title" style={{ fontSize: '11px', color: '#64748b' }}>Attendance Rate</div>
                        <div className="card-content" style={{ fontSize: '22px', fontWeight: 'bold', color: attendanceRate >= 75 ? '#0f766e' : '#b91c1c' }}>
                            {attendanceRate}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper" style={{ width: 'calc(100% * 11/12)' }}>
                <div className="section-content">
                    {/* Filters Toolbar */}
                    <div 
                        className="list-control" 
                        style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '12px', 
                            alignItems: 'center', 
                            marginBottom: '20px' 
                        }}
                    >
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: '#e0f2fe',
                                color: '#0c4a6e',
                                borderRadius: '7px',
                                border: 'none',
                                outline: 'none',
                                fontSize: '13px',
                                cursor: 'pointer',
                                minWidth: '180px'
                            }}
                        >
                            <option value="">All Subjects ({subjects.length})</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.subject_name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: '#e0f2fe',
                                color: '#0c4a6e',
                                borderRadius: '7px',
                                border: 'none',
                                outline: 'none',
                                fontSize: '13px',
                                cursor: 'pointer',
                                minWidth: '150px'
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                        </select>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: '#e0f2fe',
                                color: '#0c4a6e',
                                borderRadius: '7px',
                                border: 'none',
                                outline: 'none',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        />

                        {hasFilters && (
                            <button
                                type="button"
                                className="cancel-btn btn"
                                onClick={handleResetFilters}
                                style={{ padding: '6px 14px', fontSize: '12px' }}
                            >
                                Reset Filters
                            </button>
                        )}

                        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
                            Showing {filteredAttendances.length} of {attendances.length} records
                        </div>
                    </div>

                    {/* Attendances Table */}
                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item">Date</div>
                            <div className="list-header-item">Status</div>
                            <div className="list-header-item" style={{ flex: 2 }}>Remark / Notes</div>
                        </div>
                        <div className="list-body">
                            {filteredAttendances.length === 0 ? (
                                <div className="list-row" style={{ justifyContent: 'center', color: '#64748b', padding: '24px' }}>
                                    {hasFilters ? 'No attendance records match the selected filters.' : 'No attendance records recorded yet.'}
                                </div>
                            ) : (
                                filteredAttendances.map((item) => (
                                    <div className="list-row" key={item.id}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600, color: '#0c4a6e' }}>
                                            {item.subject?.subject_name || 'N/A'}
                                        </div>
                                        <div className="list-item">
                                            {formatDate(item.date)}
                                        </div>
                                        <div className="list-item">
                                            <span
                                                style={{
                                                    ...getStatusBadgeStyle(item.status),
                                                    padding: '4px 10px',
                                                    borderRadius: '9999px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="list-item" style={{ flex: 2, color: '#475569' }}>
                                            {item.notes || '—'}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Attendance.layout = (page) => <StudentLayout>{page}</StudentLayout>;
