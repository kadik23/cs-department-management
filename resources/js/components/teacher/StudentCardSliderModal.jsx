import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") : "";
}

export default function StudentCardSliderModal({
    isOpen,
    onClose,
    students = [],
    subjects = [],
    groups = [],
    semester,
}) {
    if (!isOpen) return null;

    // Filters
    const [selectedSubjectId, setSelectedSubjectId] = useState(
        subjects.length > 0 ? subjects[0].id : ""
    );
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // Filter students
    const filteredStudents = students.filter((student) => {
        if (selectedGroupId && String(student.group_id) !== String(selectedGroupId)) {
            return false;
        }
        return true;
    });

    // Slider state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Keep currentIndex valid when filtered list changes
    useEffect(() => {
        if (currentIndex >= filteredStudents.length && filteredStudents.length > 0) {
            setCurrentIndex(filteredStudents.length - 1);
        }
    }, [filteredStudents.length, currentIndex]);

    const currentStudent = filteredStudents[currentIndex] || null;

    // Current card form state
    const [controlNote, setControlNote] = useState("");
    const [examNote, setExamNote] = useState("");
    const [studentState, setStudentState] = useState("present");

    const [savingGrade, setSavingGrade] = useState(false);
    const [savingAttendance, setSavingAttendance] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ text: "", type: "" });

    const showAlert = (text, type = "success") => {
        setAlertMessage({ text, type });
        setTimeout(() => {
            setAlertMessage({ text: "", type: "" });
        }, 3000);
    };

    // Pre-populate when switching student, subject, or date
    useEffect(() => {
        if (!currentStudent) {
            setControlNote("");
            setExamNote("");
            setStudentState("present");
            return;
        }

        // Look for existing grade for this student & selected subject
        const existingGrade = (currentStudent.grades || []).find(
            (g) =>
                String(g.subject_id) === String(selectedSubjectId) &&
                (!semester || String(g.semester_id) === String(semester.id))
        );
        setControlNote(
            existingGrade && existingGrade.control_note !== null
                ? existingGrade.control_note
                : ""
        );
        setExamNote(
            existingGrade && existingGrade.exam_note !== null
                ? existingGrade.exam_note
                : ""
        );

        // Look for existing attendance for this student, subject & date
        const existingAttendance = (currentStudent.attendances || []).find(
            (a) =>
                String(a.subject_id) === String(selectedSubjectId) &&
                (a.date || "").split("T")[0] === attendanceDate
        );
        if (existingAttendance) {
            const st = (
                existingAttendance.status ||
                existingAttendance.student_state ||
                "present"
            ).toLowerCase();
            setStudentState(st);
        } else {
            setStudentState("present");
        }
    }, [currentIndex, currentStudent, selectedSubjectId, attendanceDate, semester]);

    // Save Grade API
    const handleSaveGrade = async (showNotification = true) => {
        if (!currentStudent) return false;
        if (!selectedSubjectId) {
            showAlert("Please select a subject first", "error");
            return false;
        }

        setSavingGrade(true);
        try {
            const response = await fetch("/teacher/grades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    student_id: currentStudent.id,
                    subject_id: selectedSubjectId,
                    semester_id: semester?.id || null,
                    control_note: controlNote === "" ? null : Number(controlNote),
                    exam_note: examNote === "" ? null : Number(examNote),
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (showNotification) showAlert("Grade saved successfully!");
                // Update in-memory record
                if (!currentStudent.grades) currentStudent.grades = [];
                const idx = currentStudent.grades.findIndex(
                    (g) => String(g.subject_id) === String(selectedSubjectId)
                );
                if (idx >= 0) {
                    currentStudent.grades[idx] = data.grade;
                } else {
                    currentStudent.grades.push(data.grade);
                }
                return true;
            } else {
                showAlert(data.message || "Failed to save grade", "error");
                return false;
            }
        } catch (err) {
            showAlert("Network error saving grade", "error");
            return false;
        } finally {
            setSavingGrade(false);
        }
    };

    // Save Attendance API
    const handleSaveAttendance = async (stateToSave = studentState, showNotification = true) => {
        if (!currentStudent) return false;
        if (!selectedSubjectId) {
            showAlert("Please select a subject first", "error");
            return false;
        }

        setSavingAttendance(true);
        try {
            const response = await fetch("/teacher/attendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    student_id: currentStudent.id,
                    subject_id: selectedSubjectId,
                    date: attendanceDate,
                    student_state: stateToSave,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                if (showNotification) showAlert("Attendance recorded!");
                // Update in-memory record
                if (!currentStudent.attendances) currentStudent.attendances = [];
                const idx = currentStudent.attendances.findIndex(
                    (a) =>
                        String(a.subject_id) === String(selectedSubjectId) &&
                        (a.date || "").split("T")[0] === attendanceDate
                );
                if (idx >= 0) {
                    currentStudent.attendances[idx] = data.attendance;
                } else {
                    currentStudent.attendances.push(data.attendance);
                }
                return true;
            } else {
                showAlert(data.message || "Failed to record attendance", "error");
                return false;
            }
        } catch (err) {
            showAlert("Network error recording attendance", "error");
            return false;
        } finally {
            setSavingAttendance(false);
        }
    };

    // Quick single-click attendance state change
    const handleStateClick = (state) => {
        setStudentState(state);
        handleSaveAttendance(state, true);
    };

    // Save Both & Next
    const handleSaveAndNext = async () => {
        const gradeSaved = await handleSaveGrade(false);
        const attSaved = await handleSaveAttendance(studentState, false);
        if (gradeSaved || attSaved) {
            showAlert("Student record updated!");
        }
        handleNext();
    };

    // Navigation
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < filteredStudents.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            showAlert("Reached the end of the student list!", "success");
        }
    };

    const handleClose = () => {
        // Trigger page data refresh with router
        router.reload({ preserveScroll: true });
        onClose();
    };

    return (
        <div
            id="dialogue"
            className="dialogue"
            style={{
                display: "flex",
                opacity: 1,
                position: "fixed",
                zIndex: 1000,
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                justifyContent: "center",
                alignItems: "center",
            }}
            onClick={(e) => {
                if (e.target.id === "dialogue") handleClose();
            }}
        >
            {/* Alert Message Toast */}
            {alertMessage.text && (
                <div
                    style={{
                        position: "fixed",
                        top: 24,
                        zIndex: 1100,
                        padding: "10px 24px",
                        borderRadius: "8px",
                        backgroundColor:
                            alertMessage.type === "error" ? "#dc2626" : "#16a34a",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "13px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                >
                    {alertMessage.text}
                </div>
            )}

            <div
                className="dialogue-inner"
                style={{
                    maxWidth: "880px",
                    width: "92%",
                    maxHeight: "92vh",
                    overflowY: "auto",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
            >
                {/* Modal Header */}
                <div className="dialogue-header">
                    <div className="dialogue-title" style={{ fontSize: "16px", fontWeight: 700 }}>
                        Register Grades & Attendance
                    </div>
                    <div
                        className="dialogue-close-btn"
                        onClick={handleClose}
                        style={{ cursor: "pointer", fontSize: "13px" }}
                    >
                        Close
                    </div>
                </div>

                {/* Modal Controls / Filter Bar */}
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "#075985",
                        padding: "12px 24px",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "16px",
                        borderBottom: "1px solid #0369a1",
                    }}
                >
                    {/* Subject Filter */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "180px" }}>
                        <label style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                            Subject:
                        </label>
                        <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                backgroundColor: "#e0f2fe",
                                color: "#0c4a6e",
                                fontWeight: 600,
                                fontSize: "13px",
                            }}
                        >
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Group Filter */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "180px" }}>
                        <label style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                            Group:
                        </label>
                        <select
                            value={selectedGroupId}
                            onChange={(e) => {
                                setSelectedGroupId(e.target.value);
                                setCurrentIndex(0);
                            }}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                backgroundColor: "#e0f2fe",
                                color: "#0c4a6e",
                                fontWeight: 600,
                                fontSize: "13px",
                            }}
                        >
                            <option value="">All Groups</option>
                            {groups.map((grp) => (
                                <option key={grp.id} value={grp.id}>
                                    {grp.academic_level?.speciality?.speciality_name ||
                                    grp.academicLevel?.speciality?.speciality_name ||
                                    ""}{" "}
                                    L{grp.academic_level?.level || grp.academicLevel?.level || ""} - G
                                    {grp.group_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Attendance Date */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "150px" }}>
                        <label style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                            Attendance Date:
                        </label>
                        <input
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                            style={{
                                padding: "7px 12px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                backgroundColor: "#e0f2fe",
                                color: "#0c4a6e",
                                fontWeight: 600,
                                fontSize: "13px",
                            }}
                        />
                    </div>
                </div>

                {/* Progress / Step Indicator */}
                <div
                    style={{
                        width: "100%",
                        padding: "10px 24px",
                        backgroundColor: "#083344",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                        {filteredStudents.length > 0
                            ? `Student ${currentIndex + 1} of ${filteredStudents.length}`
                            : "No students available"}
                    </span>
                    <div
                        style={{
                            width: "200px",
                            height: "6px",
                            backgroundColor: "#0e7490",
                            borderRadius: "3px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${
                                    filteredStudents.length > 0
                                        ? ((currentIndex + 1) / filteredStudents.length) * 100
                                        : 0
                                }%`,
                                backgroundColor: "#38bdf8",
                                transition: "width 0.3s ease",
                            }}
                        />
                    </div>
                </div>

                {/* Dialogue Body: Student Card Slider */}
                <div className="dialogue-body" style={{ padding: "24px" }}>
                    {currentStudent ? (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                animation: "fadeIn 0.25s ease-in-out",
                            }}
                        >
                            {/* Student Profile Overview Card */}
                            <div
                                style={{
                                    backgroundColor: "#075985",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: "24px",
                                    border: "1px solid #0284c7",
                                }}
                            >
                                <img
                                    src="/assets/images/student.jpg"
                                    alt="Student Avatar"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "3px solid #38bdf8",
                                    }}
                                />
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            color: "#f0f9ff",
                                        }}
                                    >
                                        {currentStudent.first_name || currentStudent.user?.first_name}{" "}
                                        {currentStudent.last_name || currentStudent.user?.last_name}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#bae6fd", fontWeight: 500 }}>
                                        {currentStudent.group
                                            ? `Group ${currentStudent.group.group_number} (${
                                                  currentStudent.group.academic_level?.speciality
                                                      ?.speciality_name ||
                                                  currentStudent.group.academicLevel?.speciality
                                                      ?.speciality_name ||
                                                  ""
                                              })`
                                            : "No Group Assigned"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#7dd3fc" }}>
                                        Username: {currentStudent.user?.username || currentStudent.id} &nbsp;|&nbsp;{" "}
                                        Email: {currentStudent.user?.email || "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Two-Column Registration Grid: Grades & Attendance */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px",
                                }}
                            >
                                {/* Column 1: Grades Form */}
                                <div
                                    style={{
                                        backgroundColor: "#034870",
                                        borderRadius: "10px",
                                        padding: "18px",
                                        border: "1px solid #0284c7",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "15px",
                                            fontWeight: 700,
                                            color: "#e0f2fe",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <img
                                            src="/assets/icons/teacher.svg"
                                            alt=""
                                            style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }}
                                        />
                                        Student Grades (0 - 20)
                                    </div>

                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <label style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                                                Control Note:
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.25"
                                                placeholder="e.g. 14.5"
                                                value={controlNote}
                                                onChange={(e) => setControlNote(e.target.value)}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "6px",
                                                    outline: "none",
                                                    border: "none",
                                                    backgroundColor: "#e0f2fe",
                                                    color: "#0c4a6e",
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                }}
                                            />
                                        </div>

                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <label style={{ fontSize: "12px", color: "#bae6fd", fontWeight: 600 }}>
                                                Exam Note:
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.25"
                                                placeholder="e.g. 15.0"
                                                value={examNote}
                                                onChange={(e) => setExamNote(e.target.value)}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "6px",
                                                    outline: "none",
                                                    border: "none",
                                                    backgroundColor: "#e0f2fe",
                                                    color: "#0c4a6e",
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            type="button"
                                            className="small-btn"
                                            onClick={() => handleSaveGrade(true)}
                                            disabled={savingGrade}
                                            style={{
                                                backgroundColor: "#0284c7",
                                                borderColor: "#0284c7",
                                                padding: "6px 16px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {savingGrade ? "Saving..." : "Save Grade"}
                                        </button>
                                    </div>
                                </div>

                                {/* Column 2: Attendance Form */}
                                <div
                                    style={{
                                        backgroundColor: "#034870",
                                        borderRadius: "10px",
                                        padding: "18px",
                                        border: "1px solid #0284c7",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "14px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "15px",
                                            fontWeight: 700,
                                            color: "#e0f2fe",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <img
                                            src="/assets/icons/students.svg"
                                            alt=""
                                            style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }}
                                        />
                                        Attendance Status
                                    </div>

                                    {/* Status Pill Buttons */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                        <button
                                            type="button"
                                            onClick={() => handleStateClick("present")}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                border: "2px solid #16a34a",
                                                backgroundColor:
                                                    studentState === "present" ? "#16a34a" : "transparent",
                                                color: studentState === "present" ? "#ffffff" : "#bbf7d0",
                                                transition: "all 0.2s",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Present
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleStateClick("absent")}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                border: "2px solid #dc2626",
                                                backgroundColor:
                                                    studentState === "absent" ? "#dc2626" : "transparent",
                                                color: studentState === "absent" ? "#ffffff" : "#fecaca",
                                                transition: "all 0.2s",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Absent
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleStateClick("late")}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                border: "2px solid #d97706",
                                                backgroundColor:
                                                    studentState === "late" ? "#d97706" : "transparent",
                                                color: studentState === "late" ? "#ffffff" : "#fef08a",
                                                transition: "all 0.2s",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            Late
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleStateClick("excused")}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                border: "2px solid #0284c7",
                                                backgroundColor:
                                                    studentState === "excused" ? "#0284c7" : "transparent",
                                                color: studentState === "excused" ? "#ffffff" : "#bae6fd",
                                                transition: "all 0.2s",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                            Excused
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            type="button"
                                            className="small-btn"
                                            onClick={() => handleSaveAttendance(studentState, true)}
                                            disabled={savingAttendance}
                                            style={{
                                                backgroundColor: "#0284c7",
                                                borderColor: "#0284c7",
                                                padding: "6px 16px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {savingAttendance ? "Saving..." : "Save Attendance"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Slider Navigation Bar */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                    paddingTop: "16px",
                                    borderTop: "1px solid #075985",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    style={{
                                        opacity: currentIndex === 0 ? 0.4 : 1,
                                        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                                        padding: "8px 24px",
                                        fontSize: "13px",
                                        backgroundColor: "#0369a1",
                                        borderColor: "#0284c7",
                                    }}
                                >
                                    ‹ Prev Student
                                </button>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleSaveAndNext}
                                        style={{
                                            padding: "8px 24px",
                                            fontSize: "13px",
                                            backgroundColor: "#16a34a",
                                            borderColor: "#15803d",
                                        }}
                                    >
                                        Save & Next ›
                                    </button>

                                    {currentIndex < filteredStudents.length - 1 ? (
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={handleNext}
                                            style={{
                                                padding: "8px 24px",
                                                fontSize: "13px",
                                                backgroundColor: "#0284c7",
                                            }}
                                        >
                                            Next Student ›
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={handleClose}
                                            style={{
                                                padding: "8px 24px",
                                                fontSize: "13px",
                                                backgroundColor: "#0891b2",
                                                borderColor: "#06b6d4",
                                            }}
                                        >
                                            Finish ✓
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: "40px", textAlign: "center", color: "#bae6fd" }}>
                            No students found for the selected subject and group.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
