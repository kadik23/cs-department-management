import React, { useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import Alert from "@/components/Alert";

const priorityConfig = {
    urgent: {
        label: "URGENT",
        bg: "#fee2e2",
        text: "#b91c1c",
        border: "#fca5a5",
    },
    high: {
        label: "HIGH PRIORITY",
        bg: "#fef3c7",
        text: "#b45309",
        border: "#fde68a",
    },
    normal: {
        label: "NORMAL",
        bg: "#e0f2fe",
        text: "#0369a1",
        border: "#bae6fd",
    },
};

const categoryLabels = {
    general: "General",
    academic: "Academic",
    exam: "Exams",
    event: "Event",
    schedule: "Schedule",
};

export default function Announcements({
    announcements = { data: [] },
    academicLevels = [],
    filters = {},
}) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

    const [filterCategory, setFilterCategory] = useState(filters.category || "all");
    const [filterPriority, setFilterPriority] = useState(filters.priority || "all");
    const [filterAudience, setFilterAudience] = useState(filters.target_audience || "all");
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const form = useForm({
        title: "",
        content: "",
        priority: "normal",
        category: "general",
        target_audience: "all",
        academic_level_id: "",
        is_pinned: false,
        expires_at: "",
        attachment: null,
    });

    const openCreateModal = () => {
        setEditingItem(null);
        form.reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        form.setData({
            title: item.title,
            content: item.content,
            priority: item.priority || "normal",
            category: item.category || "general",
            target_audience: item.target_audience || "all",
            academic_level_id: item.academic_level_id || "",
            is_pinned: Boolean(item.is_pinned),
            expires_at: item.expires_at ? item.expires_at.substring(0, 10) : "",
            attachment: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            router.post(`/admin/announcements/${editingItem.id}`, {
                _method: "PUT",
                ...form.data,
            }, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setAlert({ type: "success", message: "Announcement updated successfully." });
                    closeModal();
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0];
                    setAlert({ type: "error", message: first || "Failed to update announcement." });
                },
            });
        } else {
            form.post("/admin/announcements", {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setAlert({ type: "success", message: "Announcement published successfully." });
                    closeModal();
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0];
                    setAlert({ type: "error", message: first || "Failed to publish announcement." });
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this announcement?")) {
            router.delete(`/admin/announcements/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: "success", message: "Announcement deleted successfully." });
                },
            });
        }
    };

    const handleTogglePin = (id) => {
        router.post(`/admin/announcements/${id}/toggle-pin`, {}, {
            preserveScroll: true,
        });
    };

    const handleFilterChange = (updates) => {
        const nextFilters = {
            category: filterCategory,
            priority: filterPriority,
            target_audience: filterAudience,
            search: searchTerm,
            ...updates,
        };
        router.get("/admin/announcements", nextFilters, { preserveState: true });
    };

    const list = announcements?.data || [];

    return (
        <div className="page-content" style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "60px" }}>
            <Alert
                type={alert.type || (flash?.message ? "success" : "")}
                message={alert.message || flash?.message || ""}
            />

            {/* Header */}
            <div className="page-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div className="page-title">Department Announcements</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Manage notices, official communications, and cohort announcements
                    </div>
                </div>
                <button
                    type="button"
                    className="btn"
                    onClick={openCreateModal}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        padding: "9px 18px",
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        fontWeight: 600,
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New Announcement
                </button>
            </div>

            {/* Filter Controls */}
            <div
                style={{
                    width: "calc(11/12 * 100%)",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    padding: "16px 20px",
                    marginTop: "16px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {/* Search Bar */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search announcements by title or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleFilterChange({ search: searchTerm });
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: "9px 12px 9px 36px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                fontSize: "13px",
                                outline: "none",
                            }}
                        />
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)" }}
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => handleFilterChange({ search: searchTerm })}
                        style={{
                            padding: "9px 18px",
                            fontSize: "13px",
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            fontWeight: 600,
                        }}
                    >
                        Search
                    </button>
                </div>

                {/* Filter Dropdowns */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569" }}>
                        <span>Category:</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                handleFilterChange({ category: e.target.value });
                            }}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                fontSize: "12px",
                                backgroundColor: "#ffffff",
                                color: "#0f172a",
                            }}
                        >
                            <option value="all">All Categories</option>
                            <option value="general">General</option>
                            <option value="academic">Academic</option>
                            <option value="exam">Exams</option>
                            <option value="event">Event</option>
                            <option value="schedule">Schedule</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569" }}>
                        <span>Priority:</span>
                        <select
                            value={filterPriority}
                            onChange={(e) => {
                                setFilterPriority(e.target.value);
                                handleFilterChange({ priority: e.target.value });
                            }}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                fontSize: "12px",
                                backgroundColor: "#ffffff",
                                color: "#0f172a",
                            }}
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569" }}>
                        <span>Audience:</span>
                        <select
                            value={filterAudience}
                            onChange={(e) => {
                                setFilterAudience(e.target.value);
                                handleFilterChange({ target_audience: e.target.value });
                            }}
                            style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                fontSize: "12px",
                                backgroundColor: "#ffffff",
                                color: "#0f172a",
                            }}
                        >
                            <option value="all">All Audiences</option>
                            <option value="all">Department-Wide (All)</option>
                            <option value="students">Students</option>
                            <option value="teachers">Teachers</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Announcements Feed */}
            <div style={{ width: "calc(11/12 * 100%)", display: "flex", flexDirection: "column", gap: "16px" }}>
                {list.length === 0 ? (
                    <div
                        style={{
                            padding: "48px 24px",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                            color: "#64748b",
                        }}
                    >
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ margin: "0 auto 12px" }}
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <div style={{ fontWeight: 600, fontSize: "15px", color: "#0c4a6e" }}>No announcements found</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Click "New Announcement" above to publish a notice.</div>
                    </div>
                ) : (
                    list.map((item) => {
                        const prio = priorityConfig[item.priority] || priorityConfig.normal;
                        return (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "8px",
                                    border: item.is_pinned ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                                    boxShadow: item.is_pinned ? "0 2px 8px rgba(2, 132, 199, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.03)",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    position: "relative",
                                }}
                            >
                                {/* Top Row: Badges & Pin */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                        {/* Pinned Badge */}
                                        {item.is_pinned && (
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    fontWeight: 800,
                                                    padding: "3px 8px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#fef9c3",
                                                    color: "#854d0e",
                                                    border: "1px solid #fde047",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="17" x2="12" y2="22"></line>
                                                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                                </svg>
                                                PINNED
                                            </span>
                                        )}

                                        {/* Priority Badge */}
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: prio.bg,
                                                color: prio.text,
                                                border: `1px solid ${prio.border}`,
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {prio.label}
                                        </span>

                                        {/* Category Badge */}
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: "#f1f5f9",
                                                color: "#475569",
                                                border: "1px solid #e2e8f0",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {categoryLabels[item.category] || item.category}
                                        </span>

                                        {/* Target Audience Badge */}
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                backgroundColor: "#f8fafc",
                                                color: "#0369a1",
                                                border: "1px solid #bae6fd",
                                            }}
                                        >
                                            {item.target_audience === "all"
                                                ? "👥 Department-Wide"
                                                : item.target_audience === "teachers"
                                                ? "👨‍🏫 Teachers Only"
                                                : item.academic_level
                                                ? `🎓 Students (L${item.academic_level.level} ${item.academic_level.speciality?.speciality_name || ""})`
                                                : "🎓 All Students"}
                                        </span>
                                    </div>

                                    {/* Action Buttons: Pin, Edit, Delete */}
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePin(item.id)}
                                            title={item.is_pinned ? "Unpin notice" : "Pin notice to top"}
                                            style={{
                                                padding: "5px 9px",
                                                borderRadius: "4px",
                                                border: "1px solid #cbd5e1",
                                                backgroundColor: item.is_pinned ? "#fef9c3" : "#ffffff",
                                                color: item.is_pinned ? "#854d0e" : "#64748b",
                                                fontSize: "11px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                            </svg>
                                            {item.is_pinned ? "Pinned" : "Pin"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            style={{
                                                padding: "5px 12px",
                                                borderRadius: "4px",
                                                border: "1px solid #cbd5e1",
                                                backgroundColor: "#ffffff",
                                                color: "#0369a1",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "4px",
                                                border: "1px solid #fecaca",
                                                backgroundColor: "#fef2f2",
                                                color: "#dc2626",
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Title */}
                                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0c4a6e" }}>
                                    {item.title}
                                </div>

                                {/* Content */}
                                <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                    {item.content}
                                </div>

                                {/* Attachment section if present */}
                                {item.attachment_path && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "10px 14px",
                                            borderRadius: "6px",
                                            backgroundColor: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                            marginTop: "4px",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span
                                                style={{
                                                    fontSize: "10px",
                                                    fontWeight: 800,
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#0284c7",
                                                    color: "#ffffff",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {item.file_extension ? item.file_extension.toUpperCase() : "FILE"}
                                            </span>
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "#0c4a6e" }}>
                                                {item.attachment_name}
                                            </span>
                                            {item.formatted_size && (
                                                <span style={{ fontSize: "11px", color: "#64748b" }}>
                                                    ({item.formatted_size})
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {item.attachment_mime?.includes("pdf") && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewPdfUrl(`/admin/announcements/${item.id}/preview`)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        padding: "5px 12px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #0284c7",
                                                        backgroundColor: "#0284c7",
                                                        color: "#ffffff",
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    Preview
                                                </button>
                                            )}

                                            <a
                                                href={`/admin/announcements/${item.id}/download`}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    padding: "5px 12px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #0c4a6e",
                                                    backgroundColor: "#0c4a6e",
                                                    color: "#ffffff",
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Footer info */}
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                                    <div>
                                        Published by <strong>{item.author?.first_name} {item.author?.last_name || "Admin"}</strong>
                                    </div>
                                    <div>
                                        {new Date(item.published_at || item.created_at).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.55)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "16px",
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
                            width: "100%",
                            maxWidth: "760px",
                            maxHeight: "calc(100vh - 48px)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Pinned Modal Header */}
                        <div
                            style={{
                                padding: "16px 24px",
                                borderBottom: "1px solid #e2e8f0",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexShrink: 0,
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#0c4a6e" }}>
                                    {editingItem ? "Edit Announcement" : "Create New Announcement"}
                                </h3>
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                    Share department information, exam news, or cohort updates
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#94a3b8",
                                    lineHeight: 1,
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body Form */}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
                            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Title */}
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                        Title <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. End of Semester Exam Schedule (Semestre 1)"
                                        value={form.data.title}
                                        onChange={(e) => form.setData("title", e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            borderRadius: "6px",
                                            border: form.errors.title ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            outline: "none",
                                        }}
                                    />
                                    {form.errors.title && <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{form.errors.title}</div>}
                                </div>

                                {/* Target Audience & Academic Level row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                            Target Audience <span style={{ color: "#ef4444" }}>*</span>
                                        </label>
                                        <select
                                            value={form.data.target_audience}
                                            onChange={(e) => form.setData("target_audience", e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                            }}
                                        >
                                            <option value="all">Everyone (Department-Wide)</option>
                                            <option value="students">Students Only</option>
                                            <option value="teachers">Teachers Only</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                            Academic Cohort Level
                                        </label>
                                        <select
                                            disabled={form.data.target_audience !== "students"}
                                            value={form.data.academic_level_id}
                                            onChange={(e) => form.setData("academic_level_id", e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                backgroundColor: form.data.target_audience !== "students" ? "#f1f5f9" : "#ffffff",
                                                outline: "none",
                                                color: form.data.target_audience !== "students" ? "#94a3b8" : "#0f172a",
                                            }}
                                        >
                                            <option value="">All Academic Levels (General Students)</option>
                                            {academicLevels.map((lvl) => (
                                                <option key={lvl.id} value={lvl.id}>
                                                    Level {lvl.level} - {lvl.speciality?.speciality_name || `Speciality ${lvl.speciality_id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Priority & Category row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                            Priority Level <span style={{ color: "#ef4444" }}>*</span>
                                        </label>
                                        <select
                                            value={form.data.priority}
                                            onChange={(e) => form.setData("priority", e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                            }}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="high">High Priority</option>
                                            <option value="urgent">Urgent (Red Alert)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                            Category <span style={{ color: "#ef4444" }}>*</span>
                                        </label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) => form.setData("category", e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                            }}
                                        >
                                            <option value="general">General</option>
                                            <option value="academic">Academic & Courses</option>
                                            <option value="exam">Exams & Deliberations</option>
                                            <option value="schedule">Schedule & Rooms</option>
                                            <option value="event">Conferences & Events</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                        Announcement Content <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Write notice details, instructions, room assignments, or links..."
                                        value={form.data.content}
                                        onChange={(e) => form.setData("content", e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
                                            borderRadius: "6px",
                                            border: form.errors.content ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            fontFamily: "inherit",
                                            outline: "none",
                                            resize: "vertical",
                                        }}
                                    ></textarea>
                                    {form.errors.content && <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{form.errors.content}</div>}
                                </div>

                                {/* Attachment Upload & Options */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                                            Attach File (PDF, DOCX, Images, max 25MB)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => form.setData("attachment", e.target.files[0])}
                                            style={{
                                                fontSize: "12px",
                                                color: "#475569",
                                            }}
                                        />
                                        {form.errors.attachment && <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{form.errors.attachment}</div>}
                                    </div>

                                    {/* Pinned Checkbox */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                                        <input
                                            type="checkbox"
                                            id="is_pinned"
                                            checked={form.data.is_pinned}
                                            onChange={(e) => form.setData("is_pinned", e.target.checked)}
                                            style={{ width: "16px", height: "16px", accentColor: "#0284c7" }}
                                        />
                                        <label htmlFor="is_pinned" style={{ fontSize: "13px", fontWeight: 600, color: "#0c4a6e", cursor: "pointer" }}>
                                            Pin this announcement to top
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pinned Modal Footer */}
                            <div
                                style={{
                                    padding: "14px 24px",
                                    borderTop: "1px solid #e2e8f0",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                    backgroundColor: "#f8fafc",
                                    flexShrink: 0,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
                                        backgroundColor: "#ffffff",
                                        color: "#475569",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    style={{
                                        padding: "8px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#0284c7",
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: form.processing ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {form.processing ? "Saving..." : editingItem ? "Save Changes" : "Publish Notice"}
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
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>Document Preview</span>
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
                            title="Document Preview"
                            style={{ width: "100%", height: "100%", border: "none" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
