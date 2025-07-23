import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Resources({ resources, subjects, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file_path: '',
        subject_id: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/resources', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingResource) {
            router.put(`/admin/resources/${editingResource.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingResource(null);
                    setFormData({ title: '', description: '', file_path: '', subject_id: '' });
                }
            });
        } else {
            router.post('/admin/resources', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ title: '', description: '', file_path: '', subject_id: '' });
                }
            });
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            description: resource.description || '',
            file_path: resource.file_path,
            subject_id: resource.subject_id || ''
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            router.delete(`/admin/resources/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingResource(null);
        setFormData({ title: '', description: '', file_path: '', subject_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Resources</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Resource</button>
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
                                        <th>Description</th>
                                        <th>Subject</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resources.map((resource) => (
                                        <tr key={resource.id}>
                                            <td>{resource.title}</td>
                                            <td>{resource.description}</td>
                                            <td>{resource.subject_name}</td>
                                            <td>{resource.created_at}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(resource)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(resource.id)}
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
                            <div className="dialogue-title">{editingResource ? 'Edit Resource' : 'Add Resource'}</div>
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
                                        <label htmlFor="file_path">File Path:</label>
                                        <input 
                                            type="text" 
                                            id="file_path" 
                                            name="file_path" 
                                            value={formData.file_path}
                                            onChange={(e) => setFormData({...formData, file_path: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="description">Description:</label>
                                        <textarea 
                                            id="description" 
                                            name="description" 
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="subject_id">Subject:</label>
                                        <select 
                                            id="subject_id" 
                                            name="subject_id" 
                                            value={formData.subject_id}
                                            onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
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

export default Resources; 