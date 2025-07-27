import React, { useRef, useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Exams({ exams, subjects, groups, settings, search, classRooms = [] }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingExam, setEditingExam] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const form = useForm({
        date: '',
        subject_id: '',
        group_id: '',
        class_room_id: '',
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
            setEditingExam(null);
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
                setEditingExam(null);
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

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/exams', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingExam) {
            form.put(`/admin/exams/${editingExam.id}`, form.data, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Exam updated successfully!' });
                    setEditingExam(null);
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to update exam.' });
                },
            });
        } else {
            form.post('/admin/exams', {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Exam created successfully!' });
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to create exam.' });
                },
            });
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        form.setData({
            date: exam.date,
            subject_id: exam.subject_id,
            group_id: exam.group_id,
            class_room_id: exam.class_room_id || '',
            class_index: exam.class_index || '',
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

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this exam schedule?')) {
            router.delete(`/admin/exams/${id}`);
        }
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Exams Schedules</div>
                    <div className="page-actions">
                        <button
                            id="open_create_spec"
                            className="btn"
                            ref={openBtnRef}
                            style={{ opacity: 1, transition: 'opacity 0.5s' }}
                        >Add Exam</button>
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
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={form.data.date}
                                    onChange={e => form.setData('date', e.target.value)}
                                    required
                                />
                                {form.errors.date && <div className="text-red-500 mt-2">{form.errors.date}</div>}
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
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name || subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.subject_id && <div className="text-red-500 mt-2">{form.errors.subject_id}</div>}
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
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            Group {group.group_number}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.group_id && <div className="text-red-500 mt-2">{form.errors.group_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_room_id">Class Room:</label>
                                <select
                                    id="class_room_id"
                                    name="class_room_id"
                                    value={form.data.class_room_id || ''}
                                    onChange={e => form.setData('class_room_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Class Room</option>
                                    {classRooms && classRooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {`${r.resource_type} ${r.resource_number}`}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.class_room_id && <div className="text-red-500 mt-2">{form.errors.class_room_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_index">Start At:</label>
                                <select
                                    id="class_index"
                                    name="class_index"
                                    value={form.data.class_index || ''}
                                    onChange={e => form.setData('class_index', e.target.value)}
                                    required
                                >
                                    <option value="">Select Start Time</option>
                                    {(() => {
                                        if (!settings) return null;
                                        const classDuration = settings.exam_duration; // Use exam_duration
                                        const firstClassStartAt = parseInt(settings.first_exam_start_at?.split(':')[0] || '8', 10);
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
                                {form.errors.class_index && <div className="text-red-500 mt-2">{form.errors.class_index}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>{editingExam ? 'Save' : 'Create'}</button>
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
                                <div className="list-header-item">Date</div>
                                <div className="list-header-item">Start At</div>
                                <div className="list-header-item">End At</div>
                                <div className="list-header-item" style={{ flex: 2 }}>Subject</div>
                                <div className="list-header-item">Group</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {exams.map((exam) => (
                                    <div className="list-row" key={exam.id}>
                                        <div className="list-item">{exam.date}</div>
                                        <div className="list-item">{exam.start_time}</div>
                                        <div className="list-item">{exam.end_time}</div>
                                        <div className="list-item" style={{ flex: 2 }}>{exam.subject_name}</div>
                                        <div className="list-item">Group {exam.group_number}</div>
                                        <div className="list-item">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleEdit(exam)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(exam.id)}
                                            >
                                                Delete
                                            </button>
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

export default Exams; 