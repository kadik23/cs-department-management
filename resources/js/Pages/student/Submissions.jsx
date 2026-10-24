import React, { useState, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function Submissions({
    student,
    submissions = [],
    sessionOptions = [],
    allSubjects = [],
    allTeachers = [],
}) {
    const { flash = {} } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    // Inertia form for assignment upload
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject_id: sessionOptions.length > 0 ? String(sessionOptions[0].subject_id) : (allSubjects[0]?.id ? String(allSubjects[0].id) : ""),
        teacher_id: sessionOptions.length > 0 ? String(sessionOptions[0].teacher_id) : (allTeachers[0]?.id ? String(allTeachers[0].id) : ""),
        type: "td",
        title: "",
        description: "",
        file: null,
    });

    // When subject changes in form, auto-match teacher if in sessionOptions
    const handleSubjectChange = (subjectId) => {
        setData((prev) => {
            const match = sessionOptions.find((opt) => String(opt.subject_id) === String(subjectId));
            return {
                ...prev,
                subject_id: subjectId,
                teacher_id: match ? String(match.teacher_id) : prev.teacher_id,
            };
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post("/student/submissions", {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    // Filter submissions
    const filteredSubmissions = useMemo(() => {
        return submissions.filter((sub) => {
            const matchesType = typeFilter === "all" || sub.type === typeFilter;
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesType;

            const title = (sub.title || "").toLowerCase();
            const desc = (sub.description || "").toLowerCase();
            const subj = (sub.subject?.subject_name || "").toLowerCase();
            const teacherName = `${sub.teacher?.user?.first_name || ""} ${sub.teacher?.user?.last_name || ""}`.toLowerCase();
            const fname = (sub.file_name || "").toLowerCase();

            const matchesSearch =
                title.includes(q) ||
                desc.includes(q) ||
                subj.includes(q) ||
                teacherName.includes(q) ||
                fname.includes(q);

            return matchesType && matchesSearch;
        });
    }, [submissions, typeFilter, searchQuery]);

    // Statistics
    const totalCount = submissions.length;
    const tdCount = submissions.filter((s) => s.type === "td").length;
    const tpCount = submissions.filter((s) => s.type === "tp").length;

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="page-content" style={{ maxWidth: "1150px", margin: "0 auto", paddingBottom: "60px" }}>
            {/* Page Header */}
            <div
                className="page-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <div className="page-title" style={{ fontSize: "24px", fontWeight: "700", color: "#0c4a6e" }}>
                        Submissions & Homework
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                        Submit assignments and deliverables for your TD and TP sessions
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {student?.group && (
                        <span
                            style={{
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                border: "1px solid #bae6fd",
                            }}
                        >
                            Group {student.group.group_number}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            clearErrors();
                            setIsModalOpen(true);
                        }}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            padding: "9px 18px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(2, 132, 199, 0.2)",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Submit Deliverable</span>
                    </button>
                </div>
            </div>

            {/* Flash Message Banner */}
            {flash?.message && (
                <div
                    style={{
                        backgroundColor: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{flash.message}</span>
                </div>
            )}

            {/* Metrics Bar */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "18px 20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                            Total Submissions
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "#0c4a6e", marginTop: "4px" }}>
                            {totalCount}
                        </div>
                    </div>
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            backgroundColor: "#e0f2fe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "18px 20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                            TD Deliverables
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7", marginTop: "4px" }}>
                            {tdCount}
                        </div>
                    </div>
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            backgroundColor: "#e0f2fe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0284c7" }}>TD</span>
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "18px 20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                            TP Deliverables
                        </div>
                        <div style={{ fontSize: "24px", fontWeight: "700", color: "#4f46e5", marginTop: "4px" }}>
                            {tpCount}
                        </div>
                    </div>
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            backgroundColor: "#e0e7ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#4f46e5" }}>TP</span>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "14px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Filter:</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                        {[
                            { key: "all", label: "All" },
                            { key: "td", label: "TD Only" },
                            { key: "tp", label: "TP Only" },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                type="button"
                                onClick={() => setTypeFilter(btn.key)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    border: "1px solid",
                                    borderColor: typeFilter === btn.key ? "#0284c7" : "#cbd5e1",
                                    backgroundColor: typeFilter === btn.key ? "#0284c7" : "#ffffff",
                                    color: typeFilter === btn.key ? "#ffffff" : "#475569",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ position: "relative", minWidth: "260px" }}>
                    <input
                        type="text"
                        placeholder="Search deliverables, teacher, subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px 8px 34px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "13px",
                            color: "#1e293b",
                            outline: "none",
                        }}
                    />
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ position: "absolute", left: "10px", top: "10px" }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px dashed #cbd5e1",
                        padding: "48px 24px",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            backgroundColor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                        {submissions.length === 0 ? "No deliverables submitted yet" : "No submissions match your filters"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px", maxWidth: "420px", margin: "4px auto 18px" }}>
                        {submissions.length === 0
                            ? "Complete and upload your TD or TP assignments for your teachers to review and download."
                            : "Try clearing your search query or switching your deliverable type filter."}
                    </div>
                    {submissions.length === 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                clearErrors();
                                setIsModalOpen(true);
                            }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                backgroundColor: "#0284c7",
                                color: "#ffffff",
                                padding: "9px 18px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Submit Your First Deliverable</span>
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filteredSubmissions.map((sub) => {
                        const isTD = sub.type === "td";
                        return (
                            <div
                                key={sub.id}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "10px",
                                    border: "1px solid #e2e8f0",
                                    padding: "20px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                    transition: "border-color 0.2s ease",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                        {/* Type Pill */}
                                        <span
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                textTransform: "uppercase",
                                                backgroundColor: isTD ? "#e0f2fe" : "#e0e7ff",
                                                color: isTD ? "#0369a1" : "#4338ca",
                                                border: `1px solid ${isTD ? "#bae6fd" : "#c7d2fe"}`,
                                            }}
                                        >
                                            {isTD ? "TD Assignment" : "TP Deliverable"}
                                        </span>

                                        {/* Subject Name */}
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "#0f172a",
                                                backgroundColor: "#f8fafc",
                                                padding: "3px 10px",
                                                borderRadius: "6px",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            {sub.subject?.subject_name || "Subject"}
                                        </span>

                                        {/* Assigned Teacher */}
                                        <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <span>
                                                Pr. {sub.teacher?.user?.first_name} {sub.teacher?.user?.last_name}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Date Sent */}
                                    <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>Sent: {formatDate(sub.created_at)}</span>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div>
                                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#0c4a6e" }}>
                                        {sub.title}
                                    </div>
                                    {sub.description && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "#475569",
                                                marginTop: "6px",
                                                lineHeight: "1.5",
                                                backgroundColor: "#f8fafc",
                                                padding: "10px 14px",
                                                borderRadius: "6px",
                                                borderLeft: "3px solid #0284c7",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {sub.description}
                                        </p>
                                    )}
                                </div>

                                {/* File Attachment & Actions */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        paddingTop: "12px",
                                        borderTop: "1px solid #f1f5f9",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div
                                            style={{
                                                backgroundColor: "#fee2e2",
                                                color: "#dc2626",
                                                padding: "6px 8px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <span>PDF</span>
                                        </div>
                                        <span style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}>
                                            {sub.file_name}
                                        </span>
                                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                            ({sub.formatted_size || "PDF"})
                                        </span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {/* Preview Button */}
                                        <button
                                            type="button"
                                            onClick={() => setPreviewPdfUrl(`/student/submissions/${sub.id}/preview`)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                backgroundColor: "#ffffff",
                                                color: "#0369a1",
                                                border: "1px solid #bae6fd",
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = "#e0f2fe";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = "#ffffff";
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span>Preview PDF</span>
                                        </button>

                                        {/* Download Button */}
                                        <a
                                            href={`/student/submissions/${sub.id}/download`}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                backgroundColor: "#0284c7",
                                                color: "#ffffff",
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                transition: "background-color 0.15s ease",
                                            }}
                                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            <span>Download</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Submission Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "16px",
                    }}
                    onClick={() => !processing && setIsModalOpen(false)}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            maxWidth: "600px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: "16px 22px",
                                borderBottom: "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#0c4a6e",
                                color: "#ffffff",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                <span style={{ fontWeight: 700, fontSize: "16px" }}>Submit TD / TP Deliverable</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => !processing && setIsModalOpen(false)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#ffffff",
                                    fontSize: "22px",
                                    cursor: "pointer",
                                    lineHeight: 1,
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleFormSubmit} style={{ padding: "22px" }}>
                            {/* Type Selection (TD vs TP) */}
                            <div style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px" }}>
                                    Session Type <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setData("type", "td")}
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "2px solid",
                                            borderColor: data.type === "td" ? "#0284c7" : "#e2e8f0",
                                            backgroundColor: data.type === "td" ? "#e0f2fe" : "#ffffff",
                                            color: data.type === "td" ? "#0369a1" : "#475569",
                                            fontWeight: "700",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <span>TD Assignment</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData("type", "tp")}
                                        style={{
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "2px solid",
                                            borderColor: data.type === "tp" ? "#4f46e5" : "#e2e8f0",
                                            backgroundColor: data.type === "tp" ? "#e0e7ff" : "#ffffff",
                                            color: data.type === "tp" ? "#4338ca" : "#475569",
                                            fontWeight: "700",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <span>TP Deliverable</span>
                                    </button>
                                </div>
                                {errors.type && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.type}</div>}
                            </div>

                            {/* Subject */}
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Subject <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <select
                                    value={data.subject_id}
                                    onChange={(e) => handleSubjectChange(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        color: "#1e293b",
                                        backgroundColor: "#ffffff",
                                    }}
                                    required
                                >
                                    <option value="">-- Select Subject --</option>
                                    {sessionOptions.length > 0
                                        ? sessionOptions.map((opt) => (
                                              <option key={`opt-${opt.subject_id}`} value={opt.subject_id}>
                                                  {opt.subject_name} ({opt.teacher_name})
                                              </option>
                                          ))
                                        : allSubjects.map((sub) => (
                                              <option key={sub.id} value={sub.id}>
                                                  {sub.subject_name}
                                              </option>
                                          ))}
                                </select>
                                {errors.subject_id && (
                                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.subject_id}</div>
                                )}
                            </div>

                            {/* Teacher */}
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Assigned Teacher <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <select
                                    value={data.teacher_id}
                                    onChange={(e) => setData("teacher_id", e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        color: "#1e293b",
                                        backgroundColor: "#ffffff",
                                    }}
                                    required
                                >
                                    <option value="">-- Select Teacher --</option>
                                    {allTeachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.teacher_id && (
                                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.teacher_id}</div>
                                )}
                            </div>

                            {/* Title */}
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Assignment Title / Name <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. TP 2 - Process Scheduling Algorithms"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        color: "#1e293b",
                                    }}
                                    required
                                />
                                {errors.title && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.title}</div>}
                            </div>

                            {/* Description / Student Notes */}
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Description / Student Notes (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter any notes, group member names, or details about your deliverable..."
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        color: "#1e293b",
                                        resize: "vertical",
                                    }}
                                />
                                {errors.description && (
                                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.description}</div>
                                )}
                            </div>

                            {/* PDF File Upload */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                                    Deliverable Document (PDF Only, Max 25MB) <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <div
                                    style={{
                                        border: "2px dashed #93c5fd",
                                        backgroundColor: "#f0f9ff",
                                        borderRadius: "8px",
                                        padding: "18px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => document.getElementById("pdf_file_input").click()}
                                >
                                    <input
                                        id="pdf_file_input"
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData("file", e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#0c4a6e" }}>
                                            {data.file ? data.file.name : "Click to select your deliverable PDF"}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                                            {data.file
                                                ? `${(data.file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document`
                                                : "Strictly PDF format up to 25MB"}
                                        </div>
                                    </div>
                                </div>
                                {errors.file && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.file}</div>}
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={processing}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        backgroundColor: "#ffffff",
                                        color: "#475569",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#0284c7",
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: processing ? "not-allowed" : "pointer",
                                        opacity: processing ? 0.7 : 1,
                                    }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span>{processing ? "Uploading..." : "Submit Deliverable"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* In-browser PDF Preview Modal */}
            {previewPdfUrl && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1100,
                        padding: "20px",
                    }}
                    onClick={() => setPreviewPdfUrl(null)}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            maxWidth: "1000px",
                            height: "90vh",
                            margin: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                padding: "12px 20px",
                                borderBottom: "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#0c4a6e",
                                color: "#ffffff",
                            }}
                        >
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>Deliverable PDF Preview</span>
                            <button
                                type="button"
                                onClick={() => setPreviewPdfUrl(null)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#ffffff",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <iframe
                            src={previewPdfUrl}
                            title="Deliverable Preview"
                            style={{ width: "100%", height: "100%", border: "none" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
