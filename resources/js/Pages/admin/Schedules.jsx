import React, { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

const weekDays = [
    'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'
];

function Schedules({ schedules, subjects, groups, teachers, classRooms, settings, search, filter_group_id }) {
    const { errors, flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingSchedule, setEditingSchedule] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const form = useForm({
        class_room_id: '',
        group_id: '',
        teacher_id: '',
        subject_id: '',
        day_of_week: '',
        class_index: '',
    });
    const settingsForm = useForm({
        class_duration: settings?.class_duration || '',
        first_class_start_at: settings?.first_class_start_at || '',
    });
    const [editSettings, setEditSettings] = useState(false);
    const [settingsFormOpen, setSettingsFormOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingSchedule(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingSchedule(null);
        form.reset();
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        form.setData({
            class_room_id: schedule.class_room_id,
            group_id: schedule.group_id,
            teacher_id: schedule.teacher_id,
            subject_id: schedule.subject_id,
            day_of_week: schedule.day_of_week,
            class_index: schedule.class_index,
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(`/admin/schedules/${id}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSchedule) {
            form.put(`/admin/schedules/${editingSchedule.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Schedule updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update schedule.' });
                },
            });
        } else {
            form.post('/admin/schedules', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Schedule added successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to add schedule.' });
                },
            });
        }
    };

    const handleSettingsEdit = (e) => {
        e.preventDefault();
        setEditSettings(true);
    };
    const handleSettingsCancel = (e) => {
        e.preventDefault();
        setEditSettings(false);
        settingsForm.setData({
            class_duration: settings?.class_duration || '',
            first_class_start_at: settings?.first_class_start_at || '',
        });
    };
    const handleSettingsSave = (e) => {
        e.preventDefault();
        settingsForm.post('/admin/schedules/settings', {
            onSuccess: () => {
                setEditSettings(false);
                setAlert({ type: 'success', message: 'Scheduler settings updated successfully!' });
            },
            onError: () => {
                setAlert({ type: 'error', message: 'Failed to update scheduler settings.' });
            },
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
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Schedules</div>
                    <div className="page-actions">
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
                        >Add Schedule</button>
                    </div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
                        <form className="scheduler-settings-form" onSubmit={handleSettingsSave}>
                            <div>
                                <label htmlFor="first_class_start_at">First Class Start At: </label>
                                <input type="time" name="first_class_start_at" id="first_class_start_at"
                                    disabled={!editSettings}
                                    value={settingsForm.data.first_class_start_at}
                                    onChange={e => settingsForm.setData('first_class_start_at', e.target.value)}
                                />
                                {settingsForm.errors.first_class_start_at && <div className="text-red-500 mt-2">{settingsForm.errors.first_class_start_at}</div>}
                            </div>
                            <div>
                                <label htmlFor="class_duration">Class Duration: </label>
                                <input type="number" name="class_duration" id="class_duration"
                                    disabled={!editSettings}
                                    value={settingsForm.data.class_duration}
                                    onChange={e => settingsForm.setData('class_duration', e.target.value)}
                                />
                                {settingsForm.errors.class_duration && <div className="text-red-500 mt-2">{settingsForm.errors.class_duration}</div>}
                            </div>
                            <div>
                                {!editSettings ? (
                                    <button type="button" className="btn" onClick={handleSettingsEdit}>Edit</button>
                                ) : (
                                    <>
                                        <button type="button" className="cancel-btn" onClick={handleSettingsCancel} style={{ marginRight: 10 }}>Cancel</button>
                                        <button type="submit" className="btn" disabled={settingsForm.processing}>Save</button>
                                    </>
                                )}
                            </div>
                        </form>
                        {errors && errors.error && (
                            <Alert type="error" message={errors.error} />
                        )}
                        {flash && flash.success && (
                            <Alert type="success" message={flash.success} />
                        )}
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
                                <label>Class Room:</label>
                                <select
                                    id="class_room_id"
                                    name="class_room_id"
                                    value={form.data.class_room_id || ''}
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
                                <label htmlFor="group_id">Group:</label>
                                <select
                                    id="group_id"
                                    name="group_id"
                                    value={form.data.group_id}
                                    onChange={e => form.setData('group_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {`L${g.level} ${g.speciality_name} Group ${g.group_number}`}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.group_id && <div className="text-red-500 mt-2">{form.errors.group_id}</div>}
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
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {`${t.first_name} ${t.last_name}`}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.teacher_id && <div className="text-red-500 mt-2">{form.errors.teacher_id}</div>}
                            </div>
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
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name || s.subject_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.subject_id && <div className="text-red-500 mt-2">{form.errors.subject_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="day_of_week">Day:</label>
                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={form.data.day_of_week !== '' ? form.data.day_of_week : ''}
                                    onChange={e => form.setData('day_of_week', e.target.value)}
                                    required
                                >
                                    <option value="">Select Day</option>
                                    {weekDays.map((d, idx) => (
                                        <option key={idx} value={idx}>{d}</option>
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
                                <button type="submit" className="btn" disabled={form.processing}>{editingSchedule ? 'Save' : 'Add'}</button>
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