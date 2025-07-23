import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Subjects({ subjects, teachers, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        credits: '',
        teacher_id: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/subjects', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSubject) {
            router.put(`/admin/subjects/${editingSubject.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingSubject(null);
                    setFormData({ name: '', code: '', credits: '', teacher_id: '' });
                }
            });
        } else {
            router.post('/admin/subjects', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ name: '', code: '', credits: '', teacher_id: '' });
                }
            });
        }
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            teacher_id: subject.teacher_id || ''
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this subject?')) {
            router.delete(`/admin/subjects/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingSubject(null);
        setFormData({ name: '', code: '', credits: '', teacher_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Subjects</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Subject</button>
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
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Credits</th>
                                        <th>Teacher</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject) => (
                                        <tr key={subject.id}>
                                            <td>{subject.name}</td>
                                            <td>{subject.code}</td>
                                            <td>{subject.credits}</td>
                                            <td>{subject.teacher_name}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(subject)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(subject.id)}
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
                            <div className="dialogue-title">{editingSubject ? 'Edit Subject' : 'Add Subject'}</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="name">Name:</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="code">Code:</label>
                                        <input 
                                            type="text" 
                                            id="code" 
                                            name="code" 
                                            value={formData.code}
                                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="credits">Credits:</label>
                                        <input 
                                            type="number" 
                                            id="credits" 
                                            name="credits" 
                                            value={formData.credits}
                                            onChange={(e) => setFormData({...formData, credits: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="teacher_id">Teacher:</label>
                                        <select 
                                            id="teacher_id" 
                                            name="teacher_id" 
                                            value={formData.teacher_id}
                                            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
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

export default Subjects; 