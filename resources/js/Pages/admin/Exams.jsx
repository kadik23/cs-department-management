import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Exams({ exams, subjects, groups, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [formData, setFormData] = useState({
        exam_type: '',
        date: '',
        start_time: '',
        end_time: '',
        subject_id: '',
        group_id: ''
    });

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
                    setShowDialogue(false);
                    setEditingExam(null);
                    setFormData({ exam_type: '', date: '', start_time: '', end_time: '', subject_id: '', group_id: '' });
                }
            });
        } else {
            router.post('/admin/exams', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ exam_type: '', date: '', start_time: '', end_time: '', subject_id: '', group_id: '' });
                }
            });
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setFormData({
            exam_type: exam.exam_type,
            date: exam.date,
            start_time: exam.start_time,
            end_time: exam.end_time,
            subject_id: exam.subject_id,
            group_id: exam.group_id
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this exam schedule?')) {
            router.delete(`/admin/exams/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingExam(null);
        setFormData({ exam_type: '', date: '', start_time: '', end_time: '', subject_id: '', group_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Exams Schedules</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Exam</button>
                    </div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
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
                        
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Exam Type</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Subject</th>
                                        <th>Group</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((exam) => (
                                        <tr key={exam.id}>
                                            <td>{exam.exam_type}</td>
                                            <td>{exam.date}</td>
                                            <td>{exam.start_time} - {exam.end_time}</td>
                                            <td>{exam.subject_name}</td>
                                            <td>{exam.group_number}</td>
                                            <td>
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showDialogue && (
                <div id="dialogue" className="dialogue">
                    <div className="dialogue-inner">
                        <div className="dialogue-header">
                            <div className="dialogue-title">{editingExam ? 'Edit Exam' : 'Add Exam'}</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="exam_type">Exam Type:</label>
                                        <input 
                                            type="text" 
                                            id="exam_type" 
                                            name="exam_type" 
                                            value={formData.exam_type}
                                            onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="date">Date:</label>
                                        <input 
                                            type="date" 
                                            id="date" 
                                            name="date" 
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="start_time">Start Time:</label>
                                        <input 
                                            type="time" 
                                            id="start_time" 
                                            name="start_time" 
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="end_time">End Time:</label>
                                        <input 
                                            type="time" 
                                            id="end_time" 
                                            name="end_time" 
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="subject_id">Subject:</label>
                                        <select 
                                            id="subject_id" 
                                            name="subject_id" 
                                            value={formData.subject_id}
                                            onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
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
                                            onChange={(e) => setFormData({...formData, group_id: e.target.value})}
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
                                </div>
                                <div className="form-actions">
                                    <div className="cancel-btn dialogue-close-btn" onClick={() => setShowDialogue(false)}>Cancel</div>
                                    <button type="submit" className="btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exams; 