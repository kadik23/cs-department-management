import React, { useState } from "react";
import TeacherLayout from "@/layout/teacher/TeacherLayout";
import { useForm, router } from "@inertiajs/react";

const weekDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

function formatSlotTime(classIndex, duration = 60, firstHour = 8) {
    if (classIndex == null) return "N/A";
    const startMin = classIndex * duration;
    const endMin = (classIndex + 1) * duration;
    const startH = Math.floor(startMin / 60) + firstHour;
    const startM = startMin % 60;
    const endH = Math.floor(endMin / 60) + firstHour;
    const endM = endMin % 60;
    const s = `${startH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}`;
    const e = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
    return `${s} - ${e} (Slot ${classIndex + 1})`;
}

function getGroupLabel(group) {
    if (!group) return "N/A";
    const level = group.academic_level || group.academicLevel;
    const spec = level?.speciality?.speciality_name || "";
    const lvl = level?.level ? `L${level.level}` : "";
    const grp = group.group_number ? `G${group.group_number}` : "";
    return [spec, lvl, grp].filter(Boolean).join(" - ") || `Group #${group.id}`;
}

function getLevelLabel(levelObj) {
    if (!levelObj) return "All Levels";
    const spec = levelObj.speciality?.speciality_name || "";
    const lvl = levelObj.level ? `Level ${levelObj.level}` : "";
    return [spec, lvl].filter(Boolean).join(" - ") || `Level #${levelObj.id}`;
}

export default function Courses({
    schedules = [],
    lectures = [],
    materials = [],
    teacherSubjects = [],
    academicLevels = [],
    groups = [],
}) {
    const [scheduleSearch, setScheduleSearch] = useState("");
    const [lectureSearch, setLectureSearch] = useState("");
    const [materialSearch, setMaterialSearch] = useState("");
    const [materialTypeFilter, setMaterialTypeFilter] = useState("all");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Upload form
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject_id: teacherSubjects[0]?.id || "",
        type: "cours",
        chapter_title: "",
        description: "",
        academic_level_id: "",
        group_id: "",
        file: null,
    });

    const uniqueSubjects = new Set([
        ...schedules.map((s) => s.subject?.subject_name).filter(Boolean),
        ...lectures.map((l) => l.subject?.subject_name).filter(Boolean),
        ...materials.map((m) => m.subject?.subject_name).filter(Boolean),
    ]).size;

    // Filtered lists
    const filteredMaterials = materials.filter((mat) => {
        if (materialTypeFilter !== "all" && mat.type !== materialTypeFilter) {
            return false;
        }
        if (!materialSearch.trim()) return true;
        const q = materialSearch.toLowerCase();
        const title = (mat.chapter_title || "").toLowerCase();
        const fname = (mat.file_name || "").toLowerCase();
        const sname = (mat.subject?.subject_name || "").toLowerCase();
        return title.includes(q) || fname.includes(q) || sname.includes(q);
    });

    const filteredSchedules = schedules.filter((schedule) => {
        if (!scheduleSearch.trim()) return true;
        const query = scheduleSearch.toLowerCase();
        const subject = schedule.subject?.subject_name?.toLowerCase() || "";
        const day = weekDays[schedule.day_of_week]?.toLowerCase() || "";
        const group = getGroupLabel(schedule.group).toLowerCase();
        const room = `${schedule.class_room?.resource_type || ""} ${schedule.class_room?.resource_number || ""}`.toLowerCase();
        return subject.includes(query) || day.includes(query) || group.includes(query) || room.includes(query);
    });

    const filteredLectures = lectures.filter((lecture) => {
        if (!lectureSearch.trim()) return true;
        const query = lectureSearch.toLowerCase();
        const subject = lecture.subject?.subject_name?.toLowerCase() || "";
        const level = getLevelLabel(lecture.academic_level || lecture.academicLevel).toLowerCase();
        const day = weekDays[lecture.day_of_week]?.toLowerCase() || "";
        const room = `${lecture.class_room?.resource_type || ""} ${lecture.class_room?.resource_number || ""}`.toLowerCase();
        return subject.includes(query) || level.includes(query) || day.includes(query) || room.includes(query);
    });

    // Groups filtered by selected academic level in modal
    const modalFilteredGroups = data.academic_level_id
        ? groups.filter((g) => String(g.academic_level_id) === String(data.academic_level_id))
        : groups;

    const handleOpenModal = () => {
        reset();
        clearErrors();
        if (teacherSubjects.length > 0) {
            setData("subject_id", teacherSubjects[0].id);
        }
        setIsUploadModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUploadModalOpen(false);
        reset();
        clearErrors();
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        post("/teacher/courses/materials", {
            forceFormData: true,
            onSuccess: () => {
                handleCloseModal();
            },
        });
    };

    const handleDeleteMaterial = (material) => {
        if (confirm(`Are you sure you want to delete "${material.chapter_title}"?`)) {
            router.delete(`/teacher/courses/materials/${material.id}`);
        }
    };

    // Category badge styling
    const getTypeBadge = (type) => {
        switch (type) {
            case "cours":
                return { label: "Cours (Lecture)", bg: "#e0f2fe", color: "#0369a1" };
            case "tp":
                return { label: "TP (Lab)", bg: "#dcfce7", color: "#15803d" };
            case "td":
                return { label: "TD (Tutorial)", bg: "#fef3c7", color: "#b45309" };
            case "exam":
                return { label: "Exam / Sol", bg: "#f3e8ff", color: "#7e22ce" };
            default:
                return { label: type, bg: "#f1f5f9", color: "#475569" };
        }
    };

    return (
        <div className="page-content">
            <div className="page-header" style={{ justifyContent: "space-between" }}>
                <div className="page-title">My Courses</div>
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="btn"
                    style={{
                        fontSize: "13px",
                        padding: "8px 18px",
                        backgroundColor: "#0284c7",
                        borderColor: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Upload Course Material
                </button>
            </div>

            {/* Stat Cards */}
            <div className="row-wrapper">
                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/teacher.svg" alt="card-bg" />
                        <div className="card-title">Schedules</div>
                        <div className="card-content">{schedules.length}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/students.svg" alt="card-bg" />
                        <div className="card-title">Lectures</div>
                        <div className="card-content">{lectures.length}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/college.svg" alt="card-bg" />
                        <div className="card-title">Materials Shared</div>
                        <div className="card-content">{materials.length}</div>
                    </div>
                </div>

                <div className="card-box-wrapper">
                    <div className="card-box">
                        <img className="card-box-bg" src="/assets/icons/users.svg" alt="card-bg" />
                        <div className="card-title">Subjects</div>
                        <div className="card-content">{uniqueSubjects}</div>
                    </div>
                </div>
            </div>

            {/* SECTION 1: Course Materials & Sharing */}
            <div className="section-wrapper">
                <div className="section-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div className="section-title">Shared Course Materials (Lecture Notes, TP, TD, Exams)</div>
                </div>

                <div className="section-content">
                    <div className="list-control" style={{ flexWrap: "wrap", gap: "10px" }}>
                        <div className="search" style={{ flex: "1 1 250px" }}>
                            <input
                                type="text"
                                placeholder="search materials by title, subject, file..."
                                value={materialSearch}
                                onChange={(e) => setMaterialSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>

                        {/* Filter by Category */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <select
                                value={materialTypeFilter}
                                onChange={(e) => setMaterialTypeFilter(e.target.value)}
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
                                <option value="all">All Types</option>
                                <option value="cours">Cours (Lecture)</option>
                                <option value="tp">TP (Practical Lab)</option>
                                <option value="td">TD (Tutorial)</option>
                                <option value="exam">Exam & Solution</option>
                            </select>
                        </div>

                        {(materialSearch || materialTypeFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMaterialSearch("");
                                    setMaterialTypeFilter("all");
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
                                Reset Filters
                            </button>
                        )}
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Title / Chapter</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Subject</div>
                            <div className="list-header-item">Type</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>File / Size</div>
                            <div className="list-header-item">Audience</div>
                            <div className="list-header-item">Downloads</div>
                            <div className="list-header-item" style={{ textAlign: "center" }}>Actions</div>
                        </div>

                        <div className="list-body">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((mat) => {
                                    const badge = getTypeBadge(mat.type);
                                    const audience = mat.group
                                        ? `Group ${mat.group.group_number}`
                                        : mat.academic_level
                                        ? `${mat.academic_level.speciality?.speciality_name || ""} L${mat.academic_level.level} (All)`
                                        : "All Levels";

                                    return (
                                        <div className="list-row" key={mat.id}>
                                            <div className="list-item" style={{ flex: 2, fontWeight: 700, color: "#0c4a6e" }}>
                                                <div>{mat.chapter_title}</div>
                                                {mat.description && (
                                                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 400, marginTop: "2px" }}>
                                                        {mat.description}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="list-item" style={{ flex: 1.5 }}>
                                                {mat.subject?.subject_name || "N/A"}
                                            </div>

                                            <div className="list-item">
                                                <span
                                                    style={{
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        backgroundColor: badge.bg,
                                                        color: badge.color,
                                                    }}
                                                >
                                                    {badge.label}
                                                </span>
                                            </div>

                                            <div className="list-item" style={{ flex: 1.5, fontSize: "12px" }}>
                                                <span style={{ fontWeight: 600, color: "#334155" }}>
                                                    {mat.file_name}
                                                </span>
                                                <span style={{ color: "#94a3b8", marginLeft: "6px" }}>
                                                    ({mat.formatted_size})
                                                </span>
                                            </div>

                                            <div className="list-item" style={{ fontSize: "12px", color: "#475569" }}>
                                                {audience}
                                            </div>

                                            <div className="list-item" style={{ fontWeight: 600, color: "#0284c7" }}>
                                                {mat.download_count ?? 0}
                                            </div>

                                            <div className="list-item" style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                <a
                                                    href={`/teacher/courses/materials/${mat.id}/download`}
                                                    download
                                                    title="Download File"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "5px 8px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "#e0f2fe",
                                                        color: "#0284c7",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </a>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteMaterial(mat)}
                                                    title="Delete Material"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "5px 8px",
                                                        borderRadius: "5px",
                                                        backgroundColor: "#fee2e2",
                                                        color: "#dc2626",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: "28px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No course materials uploaded yet. Click "Upload Course Material" to share notes with students.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Schedules Section */}
            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">Teaching Schedule</div>
                </div>
                <div className="section-content">
                    <div className="list-control">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="search schedules..."
                                value={scheduleSearch}
                                onChange={(e) => setScheduleSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item">Day</div>
                            <div className="list-header-item">Time</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Group</div>
                            <div className="list-header-item">Classroom</div>
                        </div>
                        <div className="list-body">
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule, idx) => (
                                    <div className="list-row" key={idx}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600 }}>
                                            {schedule.subject?.subject_name}
                                        </div>
                                        <div className="list-item">
                                            {weekDays[schedule.day_of_week] || `Day ${schedule.day_of_week}`}
                                        </div>
                                        <div className="list-item" style={{ fontSize: "12px", color: "#0369a1", fontWeight: 600 }}>
                                            {formatSlotTime(schedule.class_index)}
                                        </div>
                                        <div className="list-item" style={{ flex: 1.5, fontWeight: 600, color: "#0c4a6e" }}>
                                            {getGroupLabel(schedule.group)}
                                        </div>
                                        <div className="list-item">
                                            {schedule.class_room?.resource_type} {schedule.class_room?.resource_number}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No teaching schedules found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: Lectures Section */}
            <div className="section-wrapper">
                <div className="section-header">
                    <div className="section-title">My Lectures</div>
                </div>
                <div className="section-content">
                    <div className="list-control">
                        <div className="search">
                            <input
                                type="text"
                                placeholder="search lectures..."
                                value={lectureSearch}
                                onChange={(e) => setLectureSearch(e.target.value)}
                            />
                            <div className="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="list">
                        <div className="list-header">
                            <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                            <div className="list-header-item" style={{ flex: 1.5 }}>Academic Level</div>
                            <div className="list-header-item">Day</div>
                            <div className="list-header-item">Time</div>
                            <div className="list-header-item">Classroom</div>
                        </div>
                        <div className="list-body">
                            {filteredLectures.length > 0 ? (
                                filteredLectures.map((lecture, idx) => (
                                    <div className="list-row" key={idx}>
                                        <div className="list-item" style={{ flex: 2, fontWeight: 600 }}>
                                            {lecture.subject?.subject_name}
                                        </div>
                                        <div className="list-item" style={{ flex: 1.5, fontWeight: 600, color: "#0c4a6e" }}>
                                            {getLevelLabel(lecture.academic_level || lecture.academicLevel)}
                                        </div>
                                        <div className="list-item">
                                            {weekDays[lecture.day_of_week] || `Day ${lecture.day_of_week}`}
                                        </div>
                                        <div className="list-item" style={{ fontSize: "12px", color: "#0369a1", fontWeight: 600 }}>
                                            {formatSlotTime(lecture.class_index)}
                                        </div>
                                        <div className="list-item">
                                            {lecture.class_room?.resource_type} {lecture.class_room?.resource_number}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "20px", color: "#64748b", textAlign: "center", width: "100%" }}>
                                    No lectures found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* UPLOAD MATERIAL MODAL */}
            {isUploadModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "24px 16px",
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "760px",
                            maxHeight: "calc(100vh - 48px)",
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                        }}
                    >
                        {/* Modal Header (Fixed / Top) */}
                        <div
                            style={{
                                flexShrink: 0,
                                padding: "18px 28px",
                                backgroundColor: "#0c4a6e",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #075985",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        backgroundColor: "#0284c7",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 700, fontSize: "16px", display: "block" }}>Upload Course Material</span>
                                    <span style={{ fontSize: "12px", color: "#bae6fd" }}>Share lecture slides, labs, tutorials or exam solutions</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: "#ffffff",
                                    fontSize: "22px",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    lineHeight: 1,
                                    opacity: 0.85,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleUploadSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                overflow: "hidden",
                                minHeight: 0,
                            }}
                        >
                            {/* Scrollable Form Body with comfortable margins and gap */}
                            <div
                                style={{
                                    padding: "24px 28px",
                                    overflowY: "auto",
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "18px",
                                }}
                            >
                                {/* Row 1: Subject & Type */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                            Subject *
                                        </label>
                                        <select
                                            value={data.subject_id}
                                            onChange={(e) => setData("subject_id", e.target.value)}
                                            required
                                            style={{
                                                width: "100%",
                                                height: "42px",
                                                padding: "0 12px",
                                                borderRadius: "7px",
                                                border: errors.subject_id ? "1px solid #dc2626" : "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                color: "#0f172a",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">Select Subject</option>
                                            {teacherSubjects.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.subject_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subject_id && <div style={{ color: "#dc2626", fontSize: "11px", marginTop: "4px" }}>{errors.subject_id}</div>}
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                            Material Type *
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData("type", e.target.value)}
                                            required
                                            style={{
                                                width: "100%",
                                                height: "42px",
                                                padding: "0 12px",
                                                borderRadius: "7px",
                                                border: errors.type ? "1px solid #dc2626" : "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                color: "#0f172a",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="cours">Cours (Lecture Notes)</option>
                                            <option value="tp">TP (Practical Lab)</option>
                                            <option value="td">TD (Tutorial)</option>
                                            <option value="exam">Exam & Solution</option>
                                        </select>
                                        {errors.type && <div style={{ color: "#dc2626", fontSize: "11px", marginTop: "4px" }}>{errors.type}</div>}
                                    </div>
                                </div>

                                {/* Row 2: Title / Chapter */}
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                        Chapter / Topic Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Chapter 2: Binary Search Trees or TP 1: Lexical Analysis"
                                        value={data.chapter_title}
                                        onChange={(e) => setData("chapter_title", e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            height: "42px",
                                            padding: "0 14px",
                                            borderRadius: "7px",
                                            border: errors.chapter_title ? "1px solid #dc2626" : "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            color: "#0f172a",
                                            outline: "none",
                                            backgroundColor: "#ffffff",
                                        }}
                                    />
                                    {errors.chapter_title && <div style={{ color: "#dc2626", fontSize: "11px", marginTop: "4px" }}>{errors.chapter_title}</div>}
                                </div>

                                {/* Row 3: Academic Level & Group */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                            Target Academic Level (Optional)
                                        </label>
                                        <select
                                            value={data.academic_level_id}
                                            onChange={(e) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    academic_level_id: e.target.value,
                                                    group_id: "",
                                                }));
                                            }}
                                            style={{
                                                width: "100%",
                                                height: "42px",
                                                padding: "0 12px",
                                                borderRadius: "7px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                color: "#0f172a",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">All Academic Levels</option>
                                            {academicLevels.map((lvl) => (
                                                <option key={lvl.id} value={lvl.id}>
                                                    {lvl.speciality?.speciality_name || "Speciality"} - Level {lvl.level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                            Target Group (Optional)
                                        </label>
                                        <select
                                            value={data.group_id}
                                            onChange={(e) => setData("group_id", e.target.value)}
                                            style={{
                                                width: "100%",
                                                height: "42px",
                                                padding: "0 12px",
                                                borderRadius: "7px",
                                                border: "1px solid #cbd5e1",
                                                fontSize: "13px",
                                                color: "#0f172a",
                                                backgroundColor: "#ffffff",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">All Groups</option>
                                            {modalFilteredGroups.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.academic_level?.speciality?.speciality_name} L{g.academic_level?.level} - Group {g.group_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Row 4: Description */}
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                        Description / Instructions (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Optional instructions for students, reading references, submission deadlines..."
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        style={{
                                            width: "100%",
                                            minHeight: "75px",
                                            padding: "10px 14px",
                                            borderRadius: "7px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            color: "#0f172a",
                                            outline: "none",
                                            fontFamily: "inherit",
                                            resize: "vertical",
                                        }}
                                    />
                                </div>

                                {/* Row 5: File Attachment Box */}
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "6px" }}>
                                        File Attachment *
                                    </label>
                                    <div
                                        style={{
                                            border: errors.file ? "1px dashed #dc2626" : "1px dashed #0284c7",
                                            borderRadius: "8px",
                                            padding: "16px 20px",
                                            backgroundColor: errors.file ? "#fef2f2" : "#f8fafc",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }}
                                    >
                                        <input
                                            type="file"
                                            required
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setData("file", file);
                                            }}
                                            style={{
                                                fontSize: "13px",
                                                cursor: "pointer",
                                                color: "#0f172a",
                                            }}
                                        />

                                        {data.file && (
                                            <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span>📎 Selected: {data.file.name}</span>
                                                <span style={{ color: "#64748b" }}>({(data.file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                            </div>
                                        )}

                                        {errors.file && (
                                            <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: 600, marginTop: "2px" }}>
                                                {errors.file}
                                            </div>
                                        )}

                                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                                            Supported: PDF, ZIP, RAR, 7Z, DOCX, PPTX, Source Code (C, Java, Python). Max: 50MB.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer (Pinned / Never clipped) */}
                            <div
                                style={{
                                    flexShrink: 0,
                                    padding: "16px 28px",
                                    backgroundColor: "#f8fafc",
                                    borderTop: "1px solid #e2e8f0",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={processing}
                                    style={{
                                        padding: "9px 20px",
                                        borderRadius: "6px",
                                        backgroundColor: "transparent",
                                        color: "#64748b",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        padding: "9px 24px",
                                        borderRadius: "6px",
                                        backgroundColor: "#0284c7",
                                        color: "#ffffff",
                                        border: "none",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        cursor: processing ? "not-allowed" : "pointer",
                                        opacity: processing ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        boxShadow: "0 2px 4px rgba(2, 132, 199, 0.2)",
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {processing ? "Uploading..." : "Upload & Share"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

Courses.layout = (page) => <TeacherLayout>{page}</TeacherLayout>;