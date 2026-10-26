import React, { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

const weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

function Lectures({ lectures, subjects, teachers, academicLevels, classRooms, settings, search }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingLecture, setEditingLecture] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();
    const [filterAcademicLevel, setFilterAcademicLevel] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm({
        subject_id: '',
        teacher_id: '',
        academic_level_id: '',
        class_room_id: '',
        day_of_week: '',
        class_index: '',
    });

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingLecture(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingLecture(null);
        form.reset();
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/lectures', { filter_academic_level_id: filterAcademicLevel }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingLecture) {
            form.put(`/admin/lectures/${editingLecture.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Lecture updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update lecture.' });
                },
            });
        } else {
            form.post('/admin/lectures', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Lecture created successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to create lecture.' });
                },
            });
        }
    };

    const handleEdit = (lecture) => {
        setEditingLecture(lecture);
        form.setData({
            subject_id: lecture.subject_id,
            teacher_id: lecture.teacher_id,
            academic_level_id: lecture.academic_level_id,
            class_room_id: lecture.class_room_id,
            day_of_week: lecture.day_of_week,
            class_index: lecture.class_index,
        });
        setIsFormOpen(true);
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <style>{`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 8mm;
                        }
                    }
                `}</style>

                {/* Official Print Header */}
                <div className="official-print-header print-only">
                    <div className="ministry-block" style={{ textAlign: "center" }}>
                        <div className="republic-title">People's Democratic Republic of Algeria</div>
                        <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600 }}>
                            Ministry of Higher Education and Scientific Research
                        </div>
                        <div className="dept-title">
                            Faculty of Exact Sciences • Department of Computer Science
                        </div>
                    </div>

                    <div className="doc-banner">
                        <div>
                            <div className="doc-name">Master Amphitheater Lectures Schedule</div>
                            <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                                Emploi du temps général des cours magistraux (Amphi)
                            </div>
                        </div>
                        <div className="doc-meta">
                            <div><strong>Academic Year:</strong> 2025 / 2026</div>
                            <div><strong>Generated:</strong> {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        </div>
                    </div>
                </div>

                <div className="page-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div className="page-title">Lectures</div>
                    <div className="page-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontWeight: "700",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                            title="Print or Export Lectures to PDF"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            <span>Print Lectures</span>
                        </button>
                        <button
                            id="open_create_spec"
                            className="btn"
                            ref={openBtnRef}
                            onClick={openForm}
                            style={{
                                opacity: isFormOpen ? 0 : 1,
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'opacity 0.5s',
                            }}
                        >Add New Lecture</button>
                    </div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
                        <form
                            method="POST"
                            id="target_form"
                            className="form-wrapper"
                            ref={formRef}
                            onSubmit={handleSubmit}
                            style={{
                                maxHeight: isFormOpen ? '1000px' : 0,
                                width: isFormOpen ? 'calc(100%*1/2)' : 0,
                                opacity: isFormOpen ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.5s ease-in-out',
                                position: 'relative',
                                marginBottom: isFormOpen ? '20px' : 0,
                            }}
                        >
                            <div className="input-wrapper">
                                <label htmlFor="subject_id">Subject:</label>
                                <select
                                    id="subject_id"
                                    name="subject_id"
                                    value={form.data.subject_id}
                                    onChange={e => form.setData('subject_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.subject_id && <div className="text-red-500 mt-2">{form.errors.subject_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="academic_level_id">Academic Level:</label>
                                <select
                                    id="academic_level_id"
                                    name="academic_level_id"
                                    value={form.data.academic_level_id}
                                    onChange={e => form.setData('academic_level_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Academic Level</option>
                                    {academicLevels.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            L{level.level} - {(level.speciality && level.speciality.name) || level.speciality_name || ''}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.academic_level_id && <div className="text-red-500 mt-2">{form.errors.academic_level_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="teacher_id">Teacher:</label>
                                <select
                                    id="teacher_id"
                                    name="teacher_id"
                                    value={form.data.teacher_id}
                                    onChange={e => form.setData('teacher_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.first_name} {teacher.last_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.teacher_id && <div className="text-red-500 mt-2">{form.errors.teacher_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_room_id">Class Room:</label>
                                <select
                                    id="class_room_id"
                                    name="class_room_id"
                                    value={form.data.class_room_id}
                                    onChange={e => form.setData('class_room_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Class Room</option>
                                    {classRooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {`${r.resource_type} ${r.resource_number}`}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.class_room_id && <div className="text-red-500 mt-2">{form.errors.class_room_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="day_of_week">Day of Week:</label>
                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={form.data.day_of_week}
                                    onChange={e => form.setData('day_of_week', e.target.value)}
                                    required
                                >
                                    <option value="">Select Day of Week</option>
                                    {weekDays.map((day, index) => (
                                        <option key={index} value={index}>{day}</option>
                                    ))}
                                </select>
                                {form.errors.day_of_week && <div className="text-red-500 mt-2">{form.errors.day_of_week}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_index">Start At:</label>
                                <select
                                    id="class_index"
                                    name="class_index"
                                    value={form.data.class_index !== '' ? form.data.class_index : ''}
                                    onChange={e => form.setData('class_index', e.target.value)}
                                    required
                                >
                                    <option value="">Select Start Time</option>
                                    {settings && (() => {
                                        const opts = [];
                                        const classDuration = settings.class_duration;
                                        const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10);
                                        let i = 0;
                                        while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) {
                                            const totalMinutes = i * classDuration;
                                            const hours = Math.floor(totalMinutes / 60) + firstClassStartAt;
                                            const minutes = totalMinutes % 60;
                                            const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                            opts.push(<option key={i} value={i}>{label}</option>);
                                            i += 1;
                                        }
                                        return opts;
                                    })()}
                                </select>
                                {form.errors.class_index && <div className="text-red-500 mt-2">{form.errors.class_index}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                    onClick={closeForm}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>{editingLecture ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                        <div className="list-control">
                            <form method="POST" className="input-group" style={{ marginRight: 10 }} onSubmit={handleFilter}>
                                <input style={{ backgroundColor: '#ebebeb', padding: '10px 20px' }} placeholder="Acadimic Level" type="text" className="selected_input" list="filter-acadimic_levels" value={filterAcademicLevel} onChange={e => setFilterAcademicLevel(e.target.value)} />
                                <input type="hidden" className="hidden_selected_input" list="filter-acadimic_levels" id="filter_academic_level_id" name="filter_academic_level_id" value={filterAcademicLevel} />
                                <datalist id="filter-acadimic_levels">
                                    {academicLevels.map(l => (
                                        <option key={l.id} value={`L${l.level} ${l.speciality_name}`}>{`L${l.level} ${l.speciality_name}`}</option>
                                    ))}
                                </datalist>
                                <button style={{ marginRight: 10, marginLeft: 10, backgroundColor: '#16a34a', border: 'none' }} className="btn" type="submit">Filter</button>
                            </form>
                        </div>
                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Class Room</div>
                                <div className="list-header-item">Day</div>
                                <div className="list-header-item" style={{ flex: 3 }}>Acadimic Level</div>
                                <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                                <div className="list-header-item" style={{ flex: 2 }}>Teacher</div>
                                <div className="list-header-item">Start At</div>
                                <div className="list-header-item">End At</div>
                            </div>
                            <div className="list-body">
                                {lectures.map((lecture) => (
                                    <div className="list-row" key={lecture.id}>
                                        <div className="list-item">{lecture.class_room} {lecture.class_room_number}</div>
                                        <div className="list-item">{weekDays[lecture.day_of_week]}</div>
                                        <div className="list-item" style={{ flex: 3 }}>{lecture.academic_level}</div>
                                        <div className="list-item" style={{ flex: 2 }}>{lecture.subject_name}</div>
                                        <div className="list-item" style={{ flex: 2 }}>{lecture.first_name} {lecture.last_name}</div>
                                        <div className="list-item">{lecture.start_time}</div>
                                        <div className="list-item">{lecture.end_time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lectures; 