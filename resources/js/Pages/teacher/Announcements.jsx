import React, { useState } from "react";
import { router } from "@inertiajs/react";

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
        label: "ANNOUNCEMENT",
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
    teacher,
    announcements = { data: [] },
    filters = {},
}) {
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
    const [filterCategory, setFilterCategory] = useState(filters.category || "all");
    const [filterPriority, setFilterPriority] = useState(filters.priority || "all");
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleFilterChange = (updates) => {
        const nextFilters = {
            category: filterCategory,
            priority: filterPriority,
            search: searchTerm,
            ...updates,
        };
        router.get("/teacher/announcements", nextFilters, { preserveState: true });
    };

    const list = announcements?.data || [];

    return (
        <div className="page-content" style={{ maxWidth: "1150px", margin: "0 auto", paddingBottom: "60px" }}>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Department Announcements</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Official department communications, academic calendars, and faculty notices
                    </div>
                </div>
            </div>

            {/* Filter and Search Box */}
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
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Search notices by title or content..."
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
                            }}
                        >
                            <option value="all">All Categories</option>
                            <option value="general">General</option>
                            <option value="academic">Academic</option>
                            <option value="exam">Exams</option>
                            <option value="event">Events</option>
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
                            }}
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High Priority</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
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
                        <div style={{ fontWeight: 600, fontSize: "15px", color: "#0c4a6e" }}>No announcements available</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Check back later for department updates.</div>
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
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
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
                                            {item.target_audience === "all" ? "👥 Department-Wide" : "👨‍🏫 Faculty Notice"}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                                        {new Date(item.published_at || item.created_at).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>

                                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0c4a6e" }}>
                                    {item.title}
                                </div>

                                <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                                    {item.content}
                                </div>

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
                                                    onClick={() => setPreviewPdfUrl(`/teacher/announcements/${item.id}/preview`)}
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
                                                href={`/teacher/announcements/${item.id}/download`}
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

                                <div style={{ fontSize: "11px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                                    Posted by <strong>{item.author?.first_name} {item.author?.last_name || "Administration"}</strong>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

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
