import React, { useRef, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

function Exams({ exams, subjects, groups, settings, search, classRooms = [] }) {
    const [editingExam, setEditingExam] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        subject_id: '',
        group_id: '',
        class_room_id: '', // <-- add this
    });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

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
            setEditingExam(null);
            setFormData({ date: '', subject_id: '', group_id: '', class_room_id: '' });
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
                setEditingExam(null);
                setFormData({ date: '', subject_id: '', group_id: '', class_room_id: '' });
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
            router.put(`/admin/exams/${editingExam.id}`, formData, {
                onSuccess: () => {
                    setEditingExam(null);
                    setFormData({ date: '', subject_id: '', group_id: '', class_room_id: '' });
                }
            });
        } else {
            router.post('/admin/exams', formData, {
                onSuccess: () => {
                    setFormData({ date: '', subject_id: '', group_id: '', class_room_id: '' });
                }
            });
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setFormData({
            date: exam.date,
            subject_id: exam.subject_id,
            group_id: exam.group_id,
            class_room_id: exam.class_room_id || '',
        });
        // Open the form
        const form = formRef.current;
        const openBtn = openBtnRef.current;
        openBtn.style.opacity = '0';
        form.style.maxHeight = '1000px';
        form.style.width = 'calc(100%*1/2)';
        setTimeout(() => {
            form.style.opacity = '1';
        }, 500);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this exam schedule?')) {
            router.delete(`/admin/exams/${id}`);
        }
    };

    return (
        <div className="container">
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
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
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
                                            {subject.name || subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="group_id">Group:</label>
                                <select
                                    id="group_id"
                                    name="group_id"
                                    value={formData.group_id}
                                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            Group {group.group_number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="class_room_id">Class Room:</label>
                                <select
                                    id="class_room_id"
                                    name="class_room_id"
                                    value={formData.class_room_id || ''}
                                    onChange={e => setFormData({ ...formData, class_room_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class Room</option>
                                    {classRooms && classRooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {`${r.resource_type} ${r.resource_number}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn">{editingExam ? 'Save' : 'Create'}</button>
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