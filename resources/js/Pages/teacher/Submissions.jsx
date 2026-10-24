import React, { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Submissions({
    teacher,
    submissions = [],
    stats = {},
    filters = {},
    teacherSubjects = [],
    teacherGroups = [],
}) {
    const { flash = {} } = usePage().props;

    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [subjectFilter, setSubjectFilter] = useState(filters.subject_id || "all");
    const [groupFilter, setGroupFilter] = useState(filters.group_id || "all");
    const [typeFilter, setTypeFilter] = useState(filters.type || "all");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    // Client-side instant filter and sort (newest date of send first)
    const filteredSubmissions = useMemo(() => {
        return submissions
            .filter((sub) => {
                // Subject filter
                if (subjectFilter !== "all" && String(sub.subject_id) !== String(subjectFilter)) {
                    return false;
                }
                // Group filter
                if (groupFilter !== "all" && String(sub.group_id) !== String(groupFilter)) {
                    return false;
                }
                // Type filter
                if (typeFilter !== "all" && sub.type !== typeFilter) {
                    return false;
                }
                // Status filter (read vs unread)
                if (statusFilter === "unread" && sub.is_read) {
                    return false;
                }
                if (statusFilter === "read" && !sub.is_read) {
                    return false;
                }
                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const title = (sub.title || "").toLowerCase();
                    const desc = (sub.description || "").toLowerCase();
                    const sName = (sub.subject?.subject_name || "").toLowerCase();
                    const studentName = `${sub.student?.user?.first_name || ""} ${sub.student?.user?.last_name || ""}`.toLowerCase();
                    const fname = (sub.file_name || "").toLowerCase();
                    const groupNum = sub.student?.group?.group_number ? `group ${sub.student.group.group_number}` : "";

                    const matches =
                        title.includes(q) ||
                        desc.includes(q) ||
                        sName.includes(q) ||
                        studentName.includes(q) ||
                        fname.includes(q) ||
                        groupNum.includes(q);

                    if (!matches) return false;
                }
                return true;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [submissions, subjectFilter, groupFilter, typeFilter, statusFilter, searchQuery]);

    // Handle Toggle Read/Unread
    const handleToggleRead = (submissionId) => {
        router.post(
            `/teacher/submissions/${submissionId}/toggle-read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    // Format Date
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

    // Calculate dynamic stats
    const totalCount = stats.total ?? submissions.length;
    const unreadCount = stats.unread ?? submissions.filter((s) => !s.is_read).length;
    const readCount = stats.read ?? submissions.filter((s) => s.is_read).length;
    const tdCount = stats.td ?? submissions.filter((s) => s.type === "td").length;
    const tpCount = stats.tp ?? submissions.filter((s) => s.type === "tp").length;

    return (
        <div className="page-content" style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
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
                        Student Submissions / Homework
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                        Review student deliverables for your TD and TP sessions sorted by date of send
                    </div>
                </div>

                {unreadCount > 0 && (
                    <span
                        style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <span
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#2563eb",
                            }}
                        />
                        {unreadCount} Unread Deliverable{unreadCount !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Flash Message */}
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
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "14px",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                        Total Submissions
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#0c4a6e", marginTop: "4px" }}>
                        {totalCount}
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#f8fafc",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        border: "1px solid #bfdbfe",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#0284c7", textTransform: "uppercase" }}>
                        Unread (Pending)
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7", marginTop: "4px" }}>
                        {unreadCount}
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                        Marked as Read
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#475569", marginTop: "4px" }}>
                        {readCount}
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                        TD Submissions
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#0284c7", marginTop: "4px" }}>
                        {tdCount}
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                >
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                        TP Submissions
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#4f46e5", marginTop: "4px" }}>
                        {tpCount}
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
                    flexDirection: "column",
                    gap: "14px",
                }}
            >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Status & Type Pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                        {/* Status Filter */}
                        <div style={{ display: "flex", gap: "4px", backgroundColor: "#f1f5f9", padding: "3px", borderRadius: "8px" }}>
                            {[
                                { key: "all", label: "All Status" },
                                { key: "unread", label: "Unread" },
                                { key: "read", label: "Read" },
                            ].map((btn) => (
                                <button
                                    key={btn.key}
                                    type="button"
                                    onClick={() => setStatusFilter(btn.key)}
                                    style={{
                                        padding: "5px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        border: "none",
                                        backgroundColor: statusFilter === btn.key ? "#0c4a6e" : "transparent",
                                        color: statusFilter === btn.key ? "#ffffff" : "#475569",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Type Filter */}
                        <div style={{ display: "flex", gap: "4px", backgroundColor: "#f1f5f9", padding: "3px", borderRadius: "8px" }}>
                            {[
                                { key: "all", label: "All Types" },
                                { key: "td", label: "TD" },
                                { key: "tp", label: "TP" },
                            ].map((btn) => (
                                <button
                                    key={btn.key}
                                    type="button"
                                    onClick={() => setTypeFilter(btn.key)}
                                    style={{
                                        padding: "5px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        border: "none",
                                        backgroundColor: typeFilter === btn.key ? "#0284c7" : "transparent",
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

                    {/* Search Input */}
                    <div style={{ position: "relative", minWidth: "280px", flex: "1", maxWidth: "380px" }}>
                        <input
                            type="text"
                            placeholder="Search student, title, description..."
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

                {/* Dropdowns row */}
                {(teacherSubjects.length > 0 || teacherGroups.length > 0) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                        {teacherSubjects.length > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Subject:</label>
                                <select
                                    value={subjectFilter}
                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "12px",
                                        color: "#334155",
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    <option value="all">All Subjects</option>
                                    {teacherSubjects.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {teacherGroups.length > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Group:</label>
                                <select
                                    value={groupFilter}
                                    onChange={(e) => setGroupFilter(e.target.value)}
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "12px",
                                        color: "#334155",
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    <option value="all">All Groups</option>
                                    {teacherGroups.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            Group {g.group_number} {g.academic_level?.speciality?.name ? `(${g.academic_level.speciality.name})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(subjectFilter !== "all" || groupFilter !== "all" || typeFilter !== "all" || statusFilter !== "all" || searchQuery) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSubjectFilter("all");
                                    setGroupFilter("all");
                                    setTypeFilter("all");
                                    setStatusFilter("all");
                                    setSearchQuery("");
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#0284c7",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    marginLeft: "auto",
                                }}
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Submissions Inbox List */}
            {filteredSubmissions.length === 0 ? (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px dashed #cbd5e1",
                        padding: "50px 24px",
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
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                        {submissions.length === 0 ? "No submissions received yet" : "No submissions found matching criteria"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                        {submissions.length === 0
                            ? "Student TD and TP deliverables will appear here sorted by submission date as students send them in."
                            : "Try adjusting your search query or reset your filters."}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {filteredSubmissions.map((sub) => {
                        const isTD = sub.type === "td";
                        const studentUser = sub.student?.user;
                        const studentName = studentUser
                            ? `${studentUser.first_name} ${studentUser.last_name}`
                            : `Student #${sub.student_id}`;
                        const groupNumber = sub.student?.group?.group_number || sub.group?.group_number;
                        const specialityName = sub.student?.group?.academic_level?.speciality?.name;

                        return (
                            <div
                                key={sub.id}
                                style={{
                                    backgroundColor: sub.is_read ? "#ffffff" : "#f0f9ff",
                                    borderRadius: "10px",
                                    border: "1px solid",
                                    borderColor: sub.is_read ? "#e2e8f0" : "#bae6fd",
                                    padding: "20px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {/* Top Line: Student Info, Badges, Date of Send */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                        {/* Status Dot */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span
                                                style={{
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor: sub.is_read ? "#94a3b8" : "#0284c7",
                                                    display: "inline-block",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    color: sub.is_read ? "#64748b" : "#0284c7",
                                                }}
                                            >
                                                {sub.is_read ? "Read" : "New / Unread"}
                                            </span>
                                        </div>

                                        {/* Student Name */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0c4a6e" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0c4a6e" }}>
                                                {studentName}
                                            </span>
                                        </div>

                                        {/* Group / Cohort badge */}
                                        {groupNumber && (
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    color: "#475569",
                                                    backgroundColor: "#f1f5f9",
                                                    padding: "2px 8px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #cbd5e1",
                                                }}
                                            >
                                                Group {groupNumber} {specialityName ? `• ${specialityName}` : ""}
                                            </span>
                                        )}

                                        {/* Type Badge */}
                                        <span
                                            style={{
                                                padding: "2px 8px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                textTransform: "uppercase",
                                                backgroundColor: isTD ? "#e0f2fe" : "#e0e7ff",
                                                color: isTD ? "#0369a1" : "#4338ca",
                                                border: `1px solid ${isTD ? "#bae6fd" : "#c7d2fe"}`,
                                            }}
                                        >
                                            {isTD ? "TD" : "TP"}
                                        </span>

                                        {/* Subject */}
                                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#0284c7" }}>
                                            {sub.subject?.subject_name}
                                        </span>
                                    </div>

                                    {/* Date of Send (Sorted by date) */}
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#64748b",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            backgroundColor: "#ffffff",
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>Sent: {formatDate(sub.created_at)}</span>
                                    </div>
                                </div>

                                {/* Title & Student Description */}
                                <div>
                                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                                        {sub.title}
                                    </div>
                                    {sub.description && (
                                        <div
                                            style={{
                                                fontSize: "13px",
                                                color: "#334155",
                                                marginTop: "6px",
                                                lineHeight: "1.5",
                                                backgroundColor: sub.is_read ? "#f8fafc" : "#ffffff",
                                                padding: "10px 14px",
                                                borderRadius: "6px",
                                                borderLeft: "3px solid #0284c7",
                                                border: "1px solid #e2e8f0",
                                                borderLeftWidth: "3px",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            <span style={{ fontWeight: "600", color: "#0c4a6e", marginRight: "6px" }}>
                                                Student Notes:
                                            </span>
                                            {sub.description}
                                        </div>
                                    )}
                                </div>

                                {/* PDF Document Info & Teacher Actions */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        paddingTop: "12px",
                                        borderTop: "1px solid #e2e8f0",
                                    }}
                                >
                                    {/* PDF File Details */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div
                                            style={{
                                                backgroundColor: "#fee2e2",
                                                color: "#dc2626",
                                                padding: "5px 8px",
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
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                                            {sub.file_name}
                                        </span>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                            ({sub.formatted_size || "PDF"})
                                        </span>
                                    </div>

                                    {/* Actions: Preview, Download, Mark as Read Toggle */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {/* Preview Button */}
                                        <button
                                            type="button"
                                            onClick={() => setPreviewPdfUrl(`/teacher/submissions/${sub.id}/preview`)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                backgroundColor: "#ffffff",
                                                color: "#0369a1",
                                                border: "1px solid #bae6fd",
                                                padding: "7px 12px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
                                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span>Preview PDF</span>
                                        </button>

                                        {/* Download Button (with white icon) */}
                                        <a
                                            href={`/teacher/submissions/${sub.id}/download`}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                backgroundColor: "#0284c7",
                                                color: "#ffffff",
                                                padding: "7px 13px",
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
                                            <span>Download PDF</span>
                                        </a>

                                        {/* Internal Mark as Read / Unread Action */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleRead(sub.id)}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                backgroundColor: sub.is_read ? "#f1f5f9" : "#0c4a6e",
                                                color: sub.is_read ? "#475569" : "#ffffff",
                                                border: "1px solid",
                                                borderColor: sub.is_read ? "#cbd5e1" : "#0c4a6e",
                                                padding: "7px 13px",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                            title="Internal tracking: Mark as read or unread"
                                        >
                                            {sub.is_read ? (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                    <span>Mark as Unread</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    <span>Mark as Read</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                            maxWidth: "1050px",
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
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>Student Deliverable Preview</span>
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
                            title="Student Deliverable Preview"
                            style={{ width: "100%", height: "100%", border: "none" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
