import React from "react";
import StudentLayout from "@/layout/student/StudentLayout";

function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr.split("T")[0];
    }
}

export default function Exams({ student, exams = [], settings = {} }) {
    const examDuration = settings?.exam_duration || 90;
    const firstExamStart = settings?.first_exam_start_at
        ? settings.first_exam_start_at.split(":").map(Number)
        : [8, 0];

    const levelNumber =
        student?.group?.academic_level?.level ||
        student?.academic_level?.level ||
        student?.group?.academicLevel?.level ||
        student?.academicLevel?.level ||
        "1";
    const specialityName =
        student?.group?.academic_level?.speciality?.speciality_name ||
        student?.academic_level?.speciality?.speciality_name ||
        student?.group?.academicLevel?.speciality?.speciality_name ||
        student?.academicLevel?.speciality?.speciality_name ||
        "Computer Science";
    const groupNumber = student?.group?.group_number || "N/A";
    const studentName = student?.user
        ? `${student.user.first_name} ${student.user.last_name}`
        : "Student";
    const studentId = student?.id ? `STD-${String(student.id).padStart(6, "0")}` : "N/A";

    return (
        <div className="page-content">
            <style>{`
                @media print {
                    @page {
                        size: portrait;
                        margin: 10mm;
                    }
                }
            `}</style>

            {/* Page Header (Screen only) */}
            <div className="page-header screen-only" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div className="page-title">Exams & Examination Slips</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Official examination schedule and student convocation slip (Fiche de convocation aux examens)
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {student?.group && (
                        <div
                            style={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#0c4a6e",
                                backgroundColor: "#e0f2fe",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #bae6fd",
                            }}
                        >
                            Group {student.group.group_number}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 18px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            boxShadow: "0 1px 3px rgba(2, 132, 199, 0.25)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                        title="Print official examination convocation slip or export as PDF"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>Print Exam Slip</span>
                    </button>
                </div>
            </div>

            {/* Examination Convocation Document (Visible on screen and cleanly printed) */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "28px 32px",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                    marginBottom: "24px",
                }}
                className="convocation-container"
            >
                {/* Official University Header */}
                <div className="official-print-header" style={{ marginBottom: "18px" }}>
                    <div className="ministry-block" style={{ textAlign: "center" }}>
                        <div className="republic-title" style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#334155" }}>
                            People's Democratic Republic of Algeria
                        </div>
                        <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                            Ministry of Higher Education and Scientific Research
                        </div>
                        <div className="dept-title" style={{ fontSize: "14px", fontWeight: 800, color: "#0c4a6e", marginTop: "2px" }}>
                            Faculty of Exact Sciences • Department of Computer Science
                        </div>
                    </div>

                    <div
                        className="doc-banner"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            marginTop: "10px",
                        }}
                    >
                        <div>
                            <div className="doc-name" style={{ fontSize: "14px", fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Examination Convocation Slip
                            </div>
                            <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                                Fiche de convocation aux examens semestriels
                            </div>
                        </div>
                        <div className="doc-meta" style={{ fontSize: "11px", color: "#475569", textAlign: "right" }}>
                            <div><strong>Academic Year:</strong> 2025 / 2026</div>
                            <div><strong>Issue Date:</strong> {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        </div>
                    </div>

                    {/* Student Identification Grid */}
                    <div
                        className="print-info-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "10px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            padding: "10px 14px",
                            marginTop: "12px",
                        }}
                    >
                        <div className="print-info-item">
                            <span className="print-info-label" style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>
                                Candidate Name
                            </span>
                            <span className="print-info-val" style={{ fontSize: "13px", fontWeight: 700, color: "#0c4a6e" }}>
                                {studentName}
                            </span>
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label" style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>
                                Student ID / Matricule
                            </span>
                            <span className="print-info-val" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                {studentId}
                            </span>
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label" style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>
                                Level & Speciality
                            </span>
                            <span className="print-info-val" style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                                L{levelNumber} {specialityName}
                            </span>
                        </div>
                        <div className="print-info-item">
                            <span className="print-info-label" style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#64748b" }}>
                                Assigned Group
                            </span>
                            <span className="print-info-val" style={{ fontSize: "13px", fontWeight: 700, color: "#0369a1" }}>
                                {groupNumber !== "N/A" ? `Group ${groupNumber}` : "Unassigned"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Exam Timetable Table */}
                {exams.length === 0 ? (
                    <div
                        style={{
                            padding: "36px",
                            textAlign: "center",
                            color: "#64748b",
                            backgroundColor: "#f8fafc",
                            borderRadius: "8px",
                            border: "1px dashed #cbd5e1",
                            margin: "16px 0",
                        }}
                    >
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "#0c4a6e" }}>
                            No examinations scheduled
                        </div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>
                            There are currently no examination schedules published for your group.
                        </div>
                    </div>
                ) : (
                    <table className="convocation-table" style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f1f5f9" }}>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a" }}>
                                    Date
                                </th>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a" }}>
                                    Time Window
                                </th>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a" }}>
                                    Duration
                                </th>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", width: "40%" }}>
                                    Subject / Module
                                </th>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a" }}>
                                    Room / Hall
                                </th>
                                <th style={{ border: "1.5px solid #94a3b8", padding: "8px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#0f172a", textAlign: "center" }}>
                                    Signature
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((row, idx) => {
                                const fromCalc = row.class_index * examDuration + firstExamStart[1];
                                const fromHours = Math.floor(fromCalc / 60) + firstExamStart[0];
                                const fromMinutes = fromCalc % 60;
                                const toCalc = (row.class_index + 1) * examDuration + firstExamStart[1];
                                const toHours = Math.floor(toCalc / 60) + firstExamStart[0];
                                const toMinutes = toCalc % 60;

                                const startTimeStr = `${fromHours.toString().padStart(2, "0")}:${fromMinutes.toString().padStart(2, "0")}`;
                                const endTimeStr = `${toHours.toString().padStart(2, "0")}:${toMinutes.toString().padStart(2, "0")}`;

                                return (
                                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>
                                            {formatDate(row.date)}
                                        </td>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "12px", fontFamily: "monospace", fontWeight: 700, color: "#0369a1" }}>
                                            {startTimeStr} - {endTimeStr}
                                        </td>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "12px", color: "#475569" }}>
                                            {examDuration} min
                                        </td>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "12px", fontWeight: 700, color: "#0c4a6e" }}>
                                            {row.subject?.subject_name}
                                        </td>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "12px", fontWeight: 600, color: "#0284c7" }}>
                                            📍 {row.class_room?.resource_type} {row.class_room?.resource_number}
                                        </td>
                                        <td style={{ border: "1px solid #cbd5e1", padding: "9px 10px", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
                                            [ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Important Examination Instructions */}
                <div
                    className="convocation-rules"
                    style={{
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        backgroundColor: "#f8fafc",
                        padding: "10px 14px",
                        marginTop: "16px",
                        fontSize: "11px",
                        color: "#334155",
                        lineHeight: 1.5,
                    }}
                >
                    <div style={{ fontWeight: 800, textTransform: "uppercase", color: "#0c4a6e", marginBottom: "4px", fontSize: "11px" }}>
                        Important Examination Instructions / Consignes Importantes
                    </div>
                    <ol style={{ paddingLeft: "18px", margin: 0 }}>
                        <li>A valid <strong>Student ID Card</strong> or official National ID is strictly required for admission to all examination rooms.</li>
                        <li>Mobile phones, smartwatches, earbuds, and programmable devices must be completely turned off and stored away.</li>
                        <li>Candidates must report to the examination room at least <strong>15 minutes</strong> prior to the start of the scheduled session.</li>
                        <li>No student is permitted to leave the examination room during the first 30 minutes of the examination session.</li>
                        <li>Any form of cheating or unauthorized communication will result in immediate expulsion and referral to the Disciplinary Council.</li>
                    </ol>
                </div>

                {/* Official Signatures & Stamp Blocks */}
                <div
                    className="convocation-signatures"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "24px",
                        paddingTop: "12px",
                    }}
                >
                    <div
                        className="convocation-sig-box"
                        style={{
                            width: "240px",
                            border: "1px dashed #94a3b8",
                            borderRadius: "6px",
                            padding: "10px 12px",
                            minHeight: "85px",
                            fontSize: "11px",
                            color: "#475569",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ fontWeight: 700, color: "#0c4a6e" }}>Student Candidate Signature</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", fontStyle: "italic" }}>
                            Read and approved
                        </div>
                    </div>

                    <div
                        className="convocation-sig-box"
                        style={{
                            width: "240px",
                            border: "1px dashed #94a3b8",
                            borderRadius: "6px",
                            padding: "10px 12px",
                            minHeight: "85px",
                            fontSize: "11px",
                            color: "#475569",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontWeight: 700, color: "#0c4a6e" }}>Department Head & Exam Committee</div>
                        <div style={{ fontSize: "10px", color: "#94a3b8", fontStyle: "italic" }}>
                            Official Stamp & Visa
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="official-print-footer"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "9px",
                        color: "#94a3b8",
                        borderTop: "1px solid #e2e8f0",
                        paddingTop: "8px",
                        marginTop: "20px",
                    }}
                >
                    <div>Computer Science Department • Official Academic Convocation Slip</div>
                    <div>Page 1 / 1</div>
                </div>
            </div>
        </div>
    );
}

Exams.layout = (page) => <StudentLayout>{page}</StudentLayout>;