import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

const weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

function Lectures({ lectures, subjects, teachers, academicLevels, classRooms, settings, search }) {
    const [editingLecture, setEditingLecture] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();
    const [formData, setFormData] = useState({
        subject_id: '',
        teacher_id: '',
        academic_level_id: '',
        class_room_id: '',
        day_of_week: '',
        class_index: '',
    });
    const [filterAcademicLevel, setFilterAcademicLevel] = useState('');
    
    useEffect(() => {
        // Set initial collapsed styles
        const form = formRef.current;
        const openBtn = openBtnRef.current;
        if (form && openBtn) {
            form.style.maxHeight = '0';
            form.style.width = '0';
            form.style.opacity = '0';
            openBtn.style.opacity = '1';
        }
        // Open form logic
        const openHandler = (ev) => {
            ev.preventDefault();
            setEditingLecture(null);
            setFormData({ subject_id: '', teacher_id: '', academic_level_id: '', class_room_id: '', day_of_week: '', class_index: '' });
            openBtn.style.opacity = '0';
            form.style.maxHeight = '1000px';
            form.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                form.style.opacity = '1';
            }, 500);
        };
        // Close form logic
        const closeHandler = (ev) => {
            ev.preventDefault();
            form.style.opacity = '0';
            setTimeout(() => {
                form.style.maxHeight = '0';
                form.style.width = '0';
                openBtn.style.opacity = '1';
                setEditingLecture(null);
                setFormData({ subject_id: '', teacher_id: '', academic_level_id: '', class_room_id: '', day_of_week: '', class_index: '' });
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
            router.put(`/admin/lectures/${editingLecture.id}`, formData, {
                onSuccess: () => {
                    setEditingLecture(null);
                    setFormData({ subject_id: '', teacher_id: '', academic_level_id: '', class_room_id: '', day_of_week: '', class_index: '' });
                }
            });
        } else {
            router.post('/admin/lectures', formData, {
                onSuccess: () => {
                    setFormData({ subject_id: '', teacher_id: '', academic_level_id: '', class_room_id: '', day_of_week: '', class_index: '' });
                }
            });
        }
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Lectures</div>
                    <div className="page-actions">
                        <button id="open_create_spec" className="btn" ref={openBtnRef}style={{ opacity: 1, transition: 'opacity 0.5s' }}>Add New Lecture</button>
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
                                    value={formData.subject_id}
                                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="academic_level_id">Academic Level:</label>
                                <select
                                    id="academic_level_id"
                                    name="academic_level_id"
                                    value={formData.academic_level_id}
                                    onChange={(e) => setFormData({ ...formData, academic_level_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Academic Level</option>
                                    {academicLevels.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            L{level.level} - {(level.speciality && level.speciality.name) || level.speciality_name || ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="teacher_id">Teacher:</label>
                                <select
                                    id="teacher_id"
                                    name="teacher_id"
                                    value={formData.teacher_id}
                                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.first_name} {teacher.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_room_id">Class Room:</label>
                                <select
                                    id="class_room_id"
                                    name="class_room_id"
                                    value={formData.class_room_id}
                                    onChange={e => setFormData({ ...formData, class_room_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class Room</option>
                                    {classRooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {`${r.resource_type} ${r.resource_number}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="day_of_week">Day of Week:</label>
                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={formData.day_of_week}
                                    onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                                    required
                                >
                                    <option value="">Select Day of Week</option>
                                    {weekDays.map((day, index) => (
                                        <option key={index} value={index}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_index">Class Index:</label>
                                <select
                                    id="class_index"
                                    name="class_index"
                                    value={formData.class_index}
                                    onChange={e => setFormData({ ...formData, class_index: e.target.value })}
                                    required
                                >
                                    <option value="">Select Start Time</option>
                                    {(() => {
                                        if (!settings) return null;
                                        const classDuration = settings.class_duration;
                                        const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10);
                                        let i = 0;
                                        const options = [];
                                        while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) {
                                            const totalMinutes = i * classDuration;
                                            const hours = Math.floor(totalMinutes / 60) + firstClassStartAt;
                                            const minutes = totalMinutes % 60;
                                            const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                            options.push(<option key={i} value={i}>{label}</option>);
                                            i += 1;
                                        }
                                        return options;
                                    })()}
                                </select>
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn">{editingLecture ? 'Save' : 'Create'}</button>
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