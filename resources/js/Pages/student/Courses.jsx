import React, { useState, useMemo } from "react";
import StudentLayout from "@/layout/student/StudentLayout";

export default function Courses({ student, semester, materials = [], subjects = [] }) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [openSubjects, setOpenSubjects] = useState({});
    const [openCategories, setOpenCategories] = useState({});
    const [previewFile, setPreviewFile] = useState(null);

    // Group materials by subject ID
    const materialsBySubject = useMemo(() => {
        const map = {};
        materials.forEach((mat) => {
            const sId = mat.subject_id;
            if (!map[sId]) {
                map[sId] = [];
            }
            map[sId].push(mat);
        });
        return map;
    }, [materials]);

    // Filtered materials
    const isMatchingSearch = (mat, query) => {
        if (!query) return true;
        const q = query.toLowerCase();
        const title = (mat.chapter_title || "").toLowerCase();
        const desc = (mat.description || "").toLowerCase();
        const fname = (mat.file_name || "").toLowerCase();
        const sname = (mat.subject?.subject_name || "").toLowerCase();
        const tname = `${mat.teacher?.user?.first_name || ""} ${mat.teacher?.user?.last_name || ""}`.toLowerCase();
        return title.includes(q) || desc.includes(q) || fname.includes(q) || sname.includes(q) || tname.includes(q);
    };

    // Filtered subjects that match search or category
    const filteredSubjects = useMemo(() => {
        return subjects.filter((subj) => {
            const subjectMats = materialsBySubject[subj.id] || [];
            if (!search && categoryFilter === "all") return true;

            // Check if subject name matches search
            if (search && subj.subject_name.toLowerCase().includes(search.toLowerCase())) {
                return true;
            }

            // Check if any material inside matches
            return subjectMats.some((mat) => {
                const matchesCat = categoryFilter === "all" || mat.type === categoryFilter;
                const matchesSearch = isMatchingSearch(mat, search);
                return matchesCat && matchesSearch;
            });
        });
    }, [subjects, materialsBySubject, search, categoryFilter]);

    // Total stats
    const totalMaterials = materials.length;
    const totalCours = materials.filter((m) => m.type === "cours").length;
    const totalTP = materials.filter((m) => m.type === "tp").length;
    const totalTD = materials.filter((m) => m.type === "td").length;

    // Toggle subject accordion
    const toggleSubject = (subjectId) => {
        setOpenSubjects((prev) => ({
            ...prev,
            [subjectId]: !prev[subjectId],
        }));
    };

    // Toggle category accordion inside a subject
    const toggleCategory = (subjectId, catKey) => {
        const key = `${subjectId}_${catKey}`;
        setOpenCategories((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Expand all / collapse all
    const handleExpandAll = () => {
        const nextSubj = {};
        const nextCat = {};
        filteredSubjects.forEach((s) => {
            nextSubj[s.id] = true;
            ["cours", "tp", "td", "exam"].forEach((c) => {
                nextCat[`${s.id}_${c}`] = true;
            });
        });
        setOpenSubjects(nextSubj);
        setOpenCategories(nextCat);
    };

    const handleCollapseAll = () => {
        setOpenSubjects({});
        setOpenCategories({});
    };

    // Helper for file type icons & colors
    const getFileBadge = (fileName, mime) => {
        const ext = (fileName || "").split(".").pop().toLowerCase();
        if (ext === "pdf" || mime?.includes("pdf")) {
            return {
                label: "PDF",
                bg: "#fee2e2",
                color: "#b91c1c",
                borderColor: "#fca5a5",
            };
        }
        if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
            return {
                label: ext.toUpperCase(),
                bg: "#fef3c7",
                color: "#b45309",
                borderColor: "#fde68a",
            };
        }
        if (["doc", "docx"].includes(ext)) {
            return {
                label: "DOC",
                bg: "#dbeafe",
                color: "#1d4ed8",
                borderColor: "#bfdbfe",
            };
        }
        if (["ppt", "pptx"].includes(ext)) {
            return {
                label: "PPT",
                bg: "#ffedd5",
                color: "#c2410c",
                borderColor: "#fed7aa",
            };
        }
        return {
            label: ext ? ext.toUpperCase() : "FILE",
            bg: "#f1f5f9",
            color: "#475569",
            borderColor: "#cbd5e1",
        };
    };

    const categoryMeta = {
        cours: { label: "Lecture Notes (Cours)", iconColor: "#0284c7" },
        tp: { label: "Practical Labs (TP)", iconColor: "#16a34a" },
        td: { label: "Tutorials (TD)", iconColor: "#d97706" },
        exam: { label: "Exams & Solutions", iconColor: "#9333ea" },
    };

    return (
        <div className="page-content">
            {/* Header */}
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div>
                    <div className="page-title">Course Materials</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        {student?.academic_level?.speciality?.speciality_name || "Academic"} - Level {student?.academic_level?.level || ""} (Group {student?.group?.group_number || "N/A"})
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        type="button"
                        onClick={handleExpandAll}
                        className="btn"
                        style={{
                            fontSize: "12px",
                            padding: "6px 14px",
                            backgroundColor: "#0284c7",
                            borderColor: "#0284c7",
                            cursor: "pointer",
                        }}
                    >
                        Expand All
                    </button>
                    <button
                        type="button"
                        onClick={handleCollapseAll}
                        className="btn"
                        style={{
                            fontSize: "12px",
                            padding: "6px 14px",
                            backgroundColor: "transparent",
                            color: "#64748b",
                            border: "1px solid #cbd5e1",
                            cursor: "pointer",
                        }}
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/college.svg" alt="card-bg" />
                        <div className="card-title">Enrolled Subjects</div>
                        <div className="card-content">{subjects.length}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/teacher.svg" alt="card-bg" />
                        <div className="card-title">Total Files</div>
                        <div className="card-content">{totalMaterials}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/students.svg" alt="card-bg" />
                        <div className="card-title">Lectures (Cours)</div>
                        <div className="card-content">{totalCours}</div>
                    </div>
                </div>
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/users.svg" alt="card-bg" />
                        <div className="card-title">Labs & TDs</div>
                        <div className="card-content">{totalTP + totalTD}</div>
                    </div>
                </div>
            </div>

            {/* Main Course Accordion Section */}
            <div className="section-wrapper">
                <div className="section-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div className="section-title">Course Files Library</div>
                </div>

                <div className="section-content">
                    {/* Controls & Filter Bar */}
                    <div className="list-control" style={{ flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                        <div className="search" style={{ flex: "1 1 250px" }}>
                            <input
                                type="text"
                                placeholder="Search by topic, file name, subject, teacher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <img src="/assets/icons/search.svg" alt="search-icon" />
                        </div>

                        {/* Category Dropdown Filter */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{
                                    height: "40px",
                                    padding: "0 14px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "7px",
                                    color: "#0c4a6e",
                                    fontFamily: "monospace",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="all">All Material Types</option>
                                <option value="cours">Lectures (Cours)</option>
                                <option value="tp">Practical Labs (TP)</option>
                                <option value="td">Tutorials (TD)</option>
                                <option value="exam">Exams & Solutions</option>
                            </select>
                        </div>

                        {(search || categoryFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setCategoryFilter("all");
                                }}
                                style={{
                                    height: "40px",
                                    padding: "0 14px",
                                    backgroundColor: "transparent",
                                    border: "1px dashed #94a3b8",
                                    borderRadius: "7px",
                                    color: "#64748b",
                                    fontFamily: "monospace",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {/* Nested Accordion List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subj) => {
                                const allSubjMats = materialsBySubject[subj.id] || [];
                                const visibleMats = allSubjMats.filter((m) => {
                                    const matchCat = categoryFilter === "all" || m.type === categoryFilter;
                                    const matchSearch = isMatchingSearch(m, search);
                                    return matchCat && matchSearch;
                                });

                                const isOpen = search.trim() ? true : !!openSubjects[subj.id];
                                const coursCount = allSubjMats.filter((m) => m.type === "cours").length;
                                const tpCount = allSubjMats.filter((m) => m.type === "tp").length;
                                const tdCount = allSubjMats.filter((m) => m.type === "td").length;
                                const examCount = allSubjMats.filter((m) => m.type === "exam").length;

                                return (
                                    <div
                                        key={subj.id}
                                        style={{
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            backgroundColor: "#ffffff",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        {/* Level 1: Root Subject Accordion Header */}
                                        <div
                                            onClick={() => toggleSubject(subj.id)}
                                            style={{
                                                padding: "14px 18px",
                                                backgroundColor: isOpen ? "#0c4a6e" : "#f8fafc",
                                                color: isOpen ? "#ffffff" : "#0c4a6e",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                transition: "background-color 0.2s",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div
                                                    style={{
                                                        width: "28px",
                                                        height: "28px",
                                                        borderRadius: "6px",
                                                        backgroundColor: isOpen ? "#0284c7" : "#e0f2fe",
                                                        color: isOpen ? "#ffffff" : "#0284c7",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 700,
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {isOpen ? "−" : "+"}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "15px", fontWeight: 700 }}>
                                                        {subj.subject_name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: isOpen ? "#bae6fd" : "#64748b",
                                                            marginTop: "2px",
                                                        }}
                                                    >
                                                        Coefficient: {subj.coefficient ?? 1} | Credit: {subj.credit ?? 1}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary Badges on Header */}
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                                {coursCount > 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            padding: "3px 8px",
                                                            borderRadius: "4px",
                                                            backgroundColor: isOpen ? "rgba(255,255,255,0.2)" : "#e0f2fe",
                                                            color: isOpen ? "#ffffff" : "#0284c7",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {coursCount} Cours
                                                    </span>
                                                )}
                                                {tpCount > 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            padding: "3px 8px",
                                                            borderRadius: "4px",
                                                            backgroundColor: isOpen ? "rgba(255,255,255,0.2)" : "#dcfce7",
                                                            color: isOpen ? "#ffffff" : "#15803d",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {tpCount} TP
                                                    </span>
                                                )}
                                                {tdCount > 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            padding: "3px 8px",
                                                            borderRadius: "4px",
                                                            backgroundColor: isOpen ? "rgba(255,255,255,0.2)" : "#fef3c7",
                                                            color: isOpen ? "#ffffff" : "#b45309",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {tdCount} TD
                                                    </span>
                                                )}
                                                {examCount > 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            padding: "3px 8px",
                                                            borderRadius: "4px",
                                                            backgroundColor: isOpen ? "rgba(255,255,255,0.2)" : "#f3e8ff",
                                                            color: isOpen ? "#ffffff" : "#7e22ce",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {examCount} Exams
                                                    </span>
                                                )}
                                                {allSubjMats.length === 0 && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            padding: "3px 8px",
                                                            borderRadius: "4px",
                                                            backgroundColor: isOpen ? "rgba(255,255,255,0.15)" : "#f1f5f9",
                                                            color: isOpen ? "#bae6fd" : "#94a3b8",
                                                        }}
                                                    >
                                                        No files yet
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Level 2: Nested Content */}
                                        {isOpen && (
                                            <div style={{ padding: "16px", backgroundColor: "#ffffff" }}>
                                                {allSubjMats.length === 0 ? (
                                                    <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                                                        No materials uploaded for this subject yet.
                                                    </div>
                                                ) : visibleMats.length === 0 ? (
                                                    <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                                                        No materials match the active search or category filter.
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                        {["cours", "tp", "td", "exam"].map((catKey) => {
                                                            const catMats = visibleMats.filter((m) => m.type === catKey);
                                                            if (catMats.length === 0) return null;

                                                            const isCatOpen = search.trim() ? true : (openCategories[`${subj.id}_${catKey}`] ?? true);
                                                            const meta = categoryMeta[catKey];

                                                            return (
                                                                <div
                                                                    key={catKey}
                                                                    style={{
                                                                        border: "1px solid #e2e8f0",
                                                                        borderRadius: "6px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                >
                                                                    {/* Level 2 Header: Category Accordion */}
                                                                    <div
                                                                        onClick={() => toggleCategory(subj.id, catKey)}
                                                                        style={{
                                                                            padding: "10px 14px",
                                                                            backgroundColor: "#f1f5f9",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between",
                                                                            cursor: "pointer",
                                                                            userSelect: "none",
                                                                        }}
                                                                    >
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                                                                                {isCatOpen ? "▼" : "►"}
                                                                            </span>
                                                                            <span style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>
                                                                                {meta.label}
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    fontSize: "11px",
                                                                                    backgroundColor: "#cbd5e1",
                                                                                    color: "#334155",
                                                                                    borderRadius: "10px",
                                                                                    padding: "1px 7px",
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                {catMats.length}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Level 3: Leaf Items - File Cards */}
                                                                    {isCatOpen && (
                                                                        <div style={{ display: "flex", flexDirection: "column", divideY: "1px solid #e2e8f0" }}>
                                                                            {catMats.map((mat) => {
                                                                                const badge = getFileBadge(mat.file_name, mat.file_mime);
                                                                                const teacherName = mat.teacher?.user
                                                                                    ? `${mat.teacher.user.first_name} ${mat.teacher.user.last_name}`
                                                                                    : "Department Teacher";
                                                                                const dateStr = mat.created_at ? mat.created_at.substring(0, 10) : "";
                                                                                const isPdf = mat.file_extension === "pdf" || mat.file_mime?.includes("pdf");

                                                                                return (
                                                                                    <div
                                                                                        key={mat.id}
                                                                                        style={{
                                                                                            padding: "12px 14px",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "space-between",
                                                                                            gap: "12px",
                                                                                            borderTop: "1px solid #f1f5f9",
                                                                                            flexWrap: "wrap",
                                                                                        }}
                                                                                    >
                                                                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "220px" }}>
                                                                                            {/* File Type Pill */}
                                                                                            <div
                                                                                                style={{
                                                                                                    padding: "6px 8px",
                                                                                                    borderRadius: "6px",
                                                                                                    fontSize: "11px",
                                                                                                    fontWeight: 800,
                                                                                                    backgroundColor: badge.bg,
                                                                                                    color: badge.color,
                                                                                                    border: `1px solid ${badge.borderColor}`,
                                                                                                    minWidth: "42px",
                                                                                                    textAlign: "center",
                                                                                                    fontFamily: "monospace",
                                                                                                }}
                                                                                            >
                                                                                                {badge.label}
                                                                                            </div>

                                                                                            <div>
                                                                                                <div style={{ fontWeight: 700, fontSize: "14px", color: "#0c4a6e" }}>
                                                                                                    {mat.chapter_title}
                                                                                                </div>
                                                                                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                                    <span>📄 {mat.file_name}</span>
                                                                                                    <span>💾 {mat.formatted_size}</span>
                                                                                                    <span>👨‍🏫 {teacherName}</span>
                                                                                                    {dateStr && <span>📅 {dateStr}</span>}
                                                                                                    {mat.group && (
                                                                                                        <span style={{ color: "#d97706", fontWeight: 600 }}>
                                                                                                            👥 Group {mat.group.group_number} only
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                {mat.description && (
                                                                                                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px", fontStyle: "italic" }}>
                                                                                                        {mat.description}
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Action Buttons */}
                                                                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                                                            {isPdf && (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => setPreviewFile(mat)}
                                                                                                    style={{
                                                                                                        padding: "6px 12px",
                                                                                                        borderRadius: "6px",
                                                                                                        fontSize: "12px",
                                                                                                        fontWeight: 600,
                                                                                                        backgroundColor: "transparent",
                                                                                                        color: "#0284c7",
                                                                                                        border: "1px solid #0284c7",
                                                                                                        cursor: "pointer",
                                                                                                        display: "flex",
                                                                                                        alignItems: "center",
                                                                                                        gap: "4px",
                                                                                                    }}
                                                                                                >
                                                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                                                        <circle cx="12" cy="12" r="3" />
                                                                                                    </svg>
                                                                                                    Preview
                                                                                                </button>
                                                                                            )}

                                                                                            <a
                                                                                                href={`/student/courses/${mat.id}/download`}
                                                                                                download
                                                                                                style={{
                                                                                                    padding: "6px 14px",
                                                                                                    borderRadius: "6px",
                                                                                                    fontSize: "12px",
                                                                                                    fontWeight: 600,
                                                                                                    backgroundColor: "#0284c7",
                                                                                                    color: "#ffffff",
                                                                                                    textDecoration: "none",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    gap: "6px",
                                                                                                }}
                                                                                            >
                                                                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                                                    <polyline points="7 10 12 15 17 10" />
                                                                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                                                                </svg>
                                                                                                Download
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                No subjects or course materials found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* In-Browser PDF Preview Modal */}
            {previewFile && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "90%",
                            maxWidth: "1000px",
                            height: "85vh",
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: "14px 20px",
                                backgroundColor: "#0c4a6e",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                                        {previewFile.chapter_title}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#bae6fd" }}>
                                        {previewFile.file_name} ({previewFile.formatted_size})
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <a
                                    href={`/student/courses/${previewFile.id}/download`}
                                    download
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        backgroundColor: "#0284c7",
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download PDF
                                </a>

                                <button
                                    type="button"
                                    onClick={() => setPreviewFile(null)}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "#ffffff",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        padding: "4px 8px",
                                        lineHeight: 1,
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body / Embedded PDF */}
                        <div style={{ flex: 1, backgroundColor: "#f8fafc" }}>
                            <iframe
                                src={`/student/courses/${previewFile.id}/preview`}
                                title="File Preview"
                                style={{ width: "100%", height: "100%", border: "none" }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
Courses.layout = (page) => <StudentLayout children={page} />;
