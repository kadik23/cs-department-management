import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const weekDays = [
    'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'
];

function Schedules({ schedules, subjects, groups, teachers, classRooms, settings, search, filter_group_id }) {
    const { errors, flash } = usePage().props;
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        class_room_id: '',
        group_id: '',
        teacher_id: '',
        subject_id: '',
        day_of_week: '',
        class_index: '',
    });
    const [editSettings, setEditSettings] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        class_duration: settings?.class_duration || '',
        first_class_start_at: settings?.first_class_start_at || '',
    });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    useEffect(() => {
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
            setEditingSchedule(null);
            setFormData({ class_room_id: '', group_id: '', teacher_id: '', subject_id: '', day_of_week: '', class_index: '' });
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
                setEditingSchedule(null);
                setFormData({ class_room_id: '', group_id: '', teacher_id: '', subject_id: '', day_of_week: '', class_index: '' });
            }, 500);
        };
        if (openBtn) openBtn.addEventListener('click', openHandler);
        if (closeBtnRef.current) closeBtnRef.current.addEventListener('click', closeHandler);
        return () => {
            if (openBtn) openBtn.removeEventListener('click', openHandler);
            if (closeBtnRef.current) closeBtnRef.current.removeEventListener('click', closeHandler);
        };
    }, []);

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            class_room_id: schedule.class_room_id,
            group_id: schedule.group_id,
            teacher_id: schedule.teacher_id,
            subject_id: schedule.subject_id,
            day_of_week: schedule.day_of_week,
            class_index: schedule.class_index,
        });
        // Open the form
        if (formRef.current && openBtnRef.current) {
            openBtnRef.current.style.opacity = '0';
            formRef.current.style.maxHeight = '1000px';
            formRef.current.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                formRef.current.style.opacity = '1';
            }, 500);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(`/admin/schedules/${id}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSchedule) {
            router.put(`/admin/schedules/${editingSchedule.id}`, formData, {
                onSuccess: () => {
                    setEditingSchedule(null);
                    setFormData({ class_room_id: '', group_id: '', teacher_id: '', subject_id: '', day_of_week: '', class_index: '' });
                    // Collapse form
                    if (formRef.current && openBtnRef.current) {
                        formRef.current.style.opacity = '0';
                        setTimeout(() => {
                            formRef.current.style.maxHeight = '0';
                            formRef.current.style.width = '0';
                            openBtnRef.current.style.opacity = '1';
                        }, 500);
                    }
                }
            });
        } else {
            router.post('/admin/schedules', formData, {
                onSuccess: () => {
                    setFormData({ class_room_id: '', group_id: '', teacher_id: '', subject_id: '', day_of_week: '', class_index: '' });
                    // Collapse form
                    if (formRef.current && openBtnRef.current) {
                        formRef.current.style.opacity = '0';
                        setTimeout(() => {
                            formRef.current.style.maxHeight = '0';
                            formRef.current.style.width = '0';
                            openBtnRef.current.style.opacity = '1';
                        }, 500);
                    }
                }
            });
        }
    };

    const [settingsFormOpen, setSettingsFormOpen] = useState(false);
    const handleSettingsEdit = (e) => {
        e.preventDefault();
        setEditSettings(true);
    };
    const handleSettingsCancel = (e) => {
        e.preventDefault();
        setEditSettings(false);
        setSettingsForm({
            class_duration: settings?.class_duration || '',
            first_class_start_at: settings?.first_class_start_at || '',
        });
    };
    const handleSettingsSave = (e) => {
        e.preventDefault();
        router.post('/admin/schedules/settings', settingsForm, {
            onSuccess: () => setEditSettings(false)
        });
    };

    // Helper to calculate time from class_index
    function calcTime(classIndex, classDuration, firstClassStartAt) {
        if (!classDuration || !firstClassStartAt) return '';
        const [h, m] = firstClassStartAt.split(':').map(Number);
        const totalMinutes = h * 60 + m + classIndex * classDuration;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/schedules', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Schedules</div>
                    <div className="page-actions">
                        <button id="open_create_spec" className="btn" ref={openBtnRef} style={{ opacity: 1, transition: 'opacity 0.5s' }}>Add Schedule</button>
                    </div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
                        <form className="scheduler-settings-form" onSubmit={handleSettingsSave}>
                            <div>
                                <label htmlFor="first_class_start_at">First Class Start At: </label>
                                <input type="time" name="first_class_start_at" id="first_class_start_at"
                                    disabled={!editSettings}
                                    value={settingsForm.first_class_start_at}
                                    onChange={e => setSettingsForm({ ...settingsForm, first_class_start_at: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="class_duration">Class Duration: </label>
                                <input type="number" name="class_duration" id="class_duration"
                                    disabled={!editSettings}
                                    value={settingsForm.class_duration}
                                    onChange={e => setSettingsForm({ ...settingsForm, class_duration: e.target.value })}
                                />
                            </div>
                            <div>
                                {!editSettings ? (
                                    <button type="button" className="btn" onClick={handleSettingsEdit}>Edit</button>
                                ) : (
                                    <>
                                        <button type="button" className="cancel-btn" onClick={handleSettingsCancel} style={{ marginRight: 10 }}>Cancel</button>
                                        <button type="submit" className="btn">Save</button>
                                    </>
                                )}
                            </div>
                        </form>
                        {errors && errors.error && (
                            <div className="alert alert-danger">{errors.error}</div>
                        )}
                        {flash && flash.success && (
                            <div className="alert alert-success">{flash.success}</div>
                        )}
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
                                marginBottom: '20px',
                            }}
                        >
                            <div className="input-wrapper">
                                <label>Class Room:</label>
                                <input type="text" className="selected_input" list="class_rooms" placeholder="class room" value={classRooms.find(r => r.id === formData.class_room_id) ? `${classRooms.find(r => r.id === formData.class_room_id).resource_type} ${classRooms.find(r => r.id === formData.class_room_id).resource_number}` : ''} onChange={e => {
                                    const val = e.target.value;
                                    const found = classRooms.find(r => `${r.resource_type} ${r.resource_number}` === val || r.id.toString() === val);
                                    setFormData(f => ({ ...f, class_room_id: found ? found.id : '' }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="class_rooms" id="class_room_id" name="class_room_id" value={formData.class_room_id} readOnly />
                                <datalist id="class_rooms">
                                    {classRooms.map(r => (
                                        <option key={r.id} value={`${r.resource_type} ${r.resource_number}`}>{`${r.resource_type} ${r.resource_number}`}</option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-wrapper">
                                <label>Group:</label>
                                <input type="text" className="selected_input" list="groups" placeholder="group" value={groups.find(g => g.id === formData.group_id) ? `L${groups.find(g => g.id === formData.group_id).level} ${groups.find(g => g.id === formData.group_id).speciality_name} Group ${groups.find(g => g.id === formData.group_id).group_number}` : ''} onChange={e => {
                                    const val = e.target.value;
                                    const found = groups.find(g => `L${g.level} ${g.speciality_name} Group ${g.group_number}` === val || g.id.toString() === val);
                                    setFormData(f => ({ ...f, group_id: found ? found.id : '' }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="groups" id="group_id" name="group_id" value={formData.group_id} readOnly />
                                <datalist id="groups">
                                    {groups.map(g => (
                                        <option key={g.id} value={`L${g.level} ${g.speciality_name} Group ${g.group_number}`}>{`L${g.level} ${g.speciality_name} Group ${g.group_number}`}</option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-wrapper">
                                <label>Teacher:</label>
                                <input type="text" className="selected_input" list="teachers" placeholder="teacher" value={teachers.find(t => t.id === formData.teacher_id) ? `${teachers.find(t => t.id === formData.teacher_id).first_name} ${teachers.find(t => t.id === formData.teacher_id).last_name}` : ''} onChange={e => {
                                    const val = e.target.value;
                                    const found = teachers.find(t => `${t.first_name} ${t.last_name}` === val || t.id.toString() === val);
                                    setFormData(f => ({ ...f, teacher_id: found ? found.id : '' }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="teachers" id="teacher_id" name="teacher_id" value={formData.teacher_id} readOnly />
                                <datalist id="teachers">
                                    {teachers.map(t => (
                                        <option key={t.id} value={`${t.first_name} ${t.last_name}`}>{`${t.first_name} ${t.last_name}`}</option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-wrapper">
                                <label>Subject:</label>
                                <input type="text" className="selected_input" list="subjects" placeholder="subject" value={subjects.find(s => s.id === formData.subject_id) ? subjects.find(s => s.id === formData.subject_id).subject_name : ''} onChange={e => {
                                    const val = e.target.value;
                                    const found = subjects.find(s => s.subject_name === val || s.id.toString() === val);
                                    setFormData(f => ({ ...f, subject_id: found ? found.id : '' }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="subjects" id="subject_id" name="subject_id" value={formData.subject_id} readOnly />
                                <datalist id="subjects">
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.subject_name}>{s.subject_name}</option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-wrapper">
                                <label>Day:</label>
                                <input type="text" className="selected_input" list="days_of_week" value={formData.day_of_week !== '' ? weekDays[formData.day_of_week] : ''} onChange={e => {
                                    const val = e.target.value;
                                    const found = weekDays.findIndex(d => d === val);
                                    setFormData(f => ({ ...f, day_of_week: found !== -1 ? found : '' }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="days_of_week" id="day_of_week" name="day_of_week" value={formData.day_of_week} readOnly />
                                <datalist id="days_of_week">
                                    {weekDays.map((d, idx) => (
                                        <option key={idx} value={d}>{d}</option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-wrapper">
                                <label>Start At:</label>
                                <input type="text" className="selected_input" list="class_indexes" value={formData.class_index !== '' && settings ? (() => { const classDuration = settings.class_duration; const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10); const opt = (() => { let i = 0, label = ''; while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) { if (i.toString() === formData.class_index.toString()) { const totalMinutes = i * classDuration; const hours = Math.floor(totalMinutes / 60) + firstClassStartAt; const minutes = totalMinutes % 60; label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`; break; } i += 1; } return label; })(); return opt; })() : ''} onChange={e => {
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
                                    setFormData(f => ({ ...f, class_index: found }));
                                }} />
                                <input type="hidden" className="hidden_selected_input" list="class_indexes" id="class_index" name="class_index" value={formData.class_index} readOnly />
                                <datalist id="class_indexes">
                                    {settings && (() => { const opts = []; const classDuration = settings.class_duration; const firstClassStartAt = parseInt(settings.first_class_start_at?.split(':')[0] || '8', 10); let i = 0; while ((i * classDuration) < ((18 - firstClassStartAt) * 60)) { const totalMinutes = i * classDuration; const hours = Math.floor(totalMinutes / 60) + firstClassStartAt; const minutes = totalMinutes % 60; opts.push(<option key={i} value={`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}</option>); i += 1; } return opts; })()}
                                </datalist>
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn">{editingSchedule ? 'Save' : 'Add'}</button>
                            </div>
                        </form>
                        <div className="list-control">
                            <form method="POST" className="search" onSubmit={handleSearch}>
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="search..." 
                                    defaultValue={search}
                                />
                                <div className="search-icon">
                                    <img src="/assets/icons/search.svg" alt="search-icon" />
                                </div>
                            </form>
                        </div>
                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Room</div>
                                <div className="list-header-item">Day</div>
                                <div className="list-header-item">Group</div>
                                <div className="list-header-item">Start At</div>
                                <div className="list-header-item">End At</div>
                                <div className="list-header-item">Subject</div>
                                <div className="list-header-item">Teacher</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {schedules.map((schedule) => (
                                    <div className="list-row" key={schedule.id}>
                                        <div className="list-item">{schedule.class_room} {schedule.class_room_number}</div>
                                        <div className="list-item">{weekDays[schedule.day_of_week]}</div>
                                        <div className="list-item">L{schedule.level} {schedule.speciality_name} G{schedule.group_number}</div>
                                        <div className="list-item">{calcTime(schedule.class_index, settings.class_duration, settings.first_class_start_at)}</div>
                                        <div className="list-item">{calcTime(Number(schedule.class_index) + 1, settings.class_duration, settings.first_class_start_at)}</div>
                                        <div className="list-item">{schedule.subject_name}</div>
                                        <div className="list-item">{schedule.teacher_first_name} {schedule.teacher_last_name}</div>
                                        <div className="list-item">
                                            <button className="btn btn-secondary" onClick={() => handleEdit(schedule)} style={{ marginRight: '10px' }}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(schedule.id)}>Delete</button>
                                        </div>
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

export default Schedules; 