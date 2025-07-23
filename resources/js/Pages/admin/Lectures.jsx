import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Lectures({ lectures, subjects, groups, teachers, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: '',
        subject_id: '',
        group_id: '',
        teacher_id: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/lectures', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingLecture) {
            router.put(`/admin/lectures/${editingLecture.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingLecture(null);
                    setFormData({ title: '', content: '', date: '', subject_id: '', group_id: '', teacher_id: '' });
                }
            });
        } else {
            router.post('/admin/lectures', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ title: '', content: '', date: '', subject_id: '', group_id: '', teacher_id: '' });
                }
            });
        }
    };

    const handleEdit = (lecture) => {
        setEditingLecture(lecture);
        setFormData({
            title: lecture.title,
            content: lecture.content,
            date: lecture.date,
            subject_id: lecture.subject_id,
            group_id: lecture.group_id,
            teacher_id: lecture.teacher_id
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            router.delete(`/admin/lectures/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingLecture(null);
        setFormData({ title: '', content: '', date: '', subject_id: '', group_id: '', teacher_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Lectures</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Lecture</button>
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
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th>Date</th>
                                        <th>Subject</th>
                                        <th>Group</th>
                                        <th>Teacher</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.map((lecture) => (
                                        <tr key={lecture.id}>
                                            <td>{lecture.title}</td>
                                            <td>{lecture.content.substring(0, 50)}...</td>
                                            <td>{lecture.date}</td>
                                            <td>{lecture.subject_name}</td>
                                            <td>{lecture.group_number}</td>
                                            <td>{lecture.teacher_name}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(lecture)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(lecture.id)}
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
                            <div className="dialogue-title">{editingLecture ? 'Edit Lecture' : 'Add Lecture'}</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="title">Title:</label>
                                        <input 
                                            type="text" 
                                            id="title" 
                                            name="title" 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                                        <label htmlFor="content">Content:</label>
                                        <textarea 
                                            id="content" 
                                            name="content" 
                                            value={formData.content}
                                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                                            rows="4"
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
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="teacher_id">Teacher:</label>
                                        <select 
                                            id="teacher_id" 
                                            name="teacher_id" 
                                            value={formData.teacher_id}
                                            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
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

export default Lectures; 