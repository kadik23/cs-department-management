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

    const form = useForm({
        subject_id: '',
        teacher_id: '',
        academic_level_id: '',
        class_room_id: '',
        day_of_week: '',
        class_index: '',
    });

    useEffect(() => {
        const formEl = formRef.current;
        const openBtn = openBtnRef.current;
        if (formEl && openBtn) {
            formEl.style.maxHeight = '0';
            formEl.style.width = '0';
            formEl.style.opacity = '0';
            openBtn.style.opacity = '1';
        }
        const openHandler = (ev) => {
            ev.preventDefault();
            setEditingLecture(null);
            form.reset();
            openBtn.style.opacity = '0';
            formEl.style.maxHeight = '1000px';
            formEl.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                formEl.style.opacity = '1';
            }, 500);
        };
        const closeHandler = (ev) => {
            ev.preventDefault();
            formEl.style.opacity = '0';
            setTimeout(() => {
                formEl.style.maxHeight = '0';
                formEl.style.width = '0';
                openBtn.style.opacity = '1';
                setEditingLecture(null);
                form.reset();
            }, 500);
        };
        if (openBtn) openBtn.addEventListener('click', openHandler);
        if (closeBtnRef.current) closeBtnRef.current.addEventListener('click', closeHandler);
        return () => {
            if (openBtn) openBtn.removeEventListener('click', openHandler);
            if (closeBtnRef.current) closeBtnRef.current.removeEventListener('click', closeHandler);
        };
    }, []);

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
            form.put(`/admin/lectures/${editingLecture.id}`, form.data, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Lecture updated successfully!' });
                    setEditingLecture(null);
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to update lecture.' });
                },
            });
        } else {
            form.post('/admin/lectures', {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Lecture created successfully!' });
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to create lecture.' });
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
        const formEl = formRef.current;
        const openBtn = openBtnRef.current;
        openBtn.style.opacity = '0';
        formEl.style.maxHeight = '1000px';
        formEl.style.width = 'calc(100%*1/2)';
        setTimeout(() => {
            formEl.style.opacity = '1';
        }, 500);
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Lectures</div>
                    <div className="page-actions">
                        <button id="open_create_spec" className="btn" ref={openBtnRef} style={{ opacity: 1, transition: 'opacity 0.5s' }}>Add New Lecture</button>
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
                                maxHeight: 0,
                                width: 0,
                                opacity: 0,
                                overflow: 'hidden',
                                transition: 'all 0.5s',
                                position: 'relative',
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
                                <label>Start At:</label>
                                <input type="text" className="selected_input" list="class_indexes" value={form.data.class_index !== '' && settings ? (() => { const classDuration = settings.class_duration; const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10); const opt = (() => { let i = 0, label = ''; while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) { if (i.toString() === form.data.class_index.toString()) { const totalMinutes = i * classDuration; const hours = Math.floor(totalMinutes / 60) + firstClassStartAt; const minutes = totalMinutes % 60; label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; break; } i += 1; } return label; })(); return opt; })() : ''} onChange={e => {
                                    const val = e.target.value;
                                    if (!settings) return;
                                    const classDuration = settings.class_duration;
                                    const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10);
                                    let i = 0, found = '';
                                    while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) {
                                        const totalMinutes = i * classDuration;
                                        const hours = Math.floor(totalMinutes / 60) + firstClassStartAt;
                                        const minutes = totalMinutes % 60;
                                        const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                        if (label === val || i.toString() === val) { found = i; break; }
                                        i += 1;
                                    }
                                    form.setData('class_index', found);
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="class_indexes" id="class_index" name="class_index" value={form.data.class_index} readOnly />
                                <datalist id="class_indexes">
                                    {settings && (() => { const opts = []; const classDuration = settings.class_duration; const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10); let i = 0; while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) { const totalMinutes = i * classDuration; const hours = Math.floor(totalMinutes / 60) + firstClassStartAt; const minutes = totalMinutes % 60; opts.push(<option key={i} value={`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}</option>); i += 1; } return opts; })()}
                                </datalist>
                                {form.errors.class_index && <div className="text-red-500 mt-2">{form.errors.class_index}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
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