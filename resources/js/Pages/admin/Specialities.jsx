import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Specialities({ specialities, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingSpeciality, setEditingSpeciality] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/specialities', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSpeciality) {
            router.put(`/admin/specialities/${editingSpeciality.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingSpeciality(null);
                    setFormData({ name: '', description: '' });
                }
            });
        } else {
            router.post('/admin/specialities', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ name: '', description: '' });
                }
            });
        }
    };

    const handleEdit = (speciality) => {
        setEditingSpeciality(speciality);
        setFormData({
            name: speciality.name,
            description: speciality.description || ''
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this speciality?')) {
            router.delete(`/admin/specialities/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingSpeciality(null);
        setFormData({ name: '', description: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Specialities</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Speciality</button>
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
                                        <th>Description</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specialities.map((speciality) => (
                                        <tr key={speciality.id}>
                                            <td>{speciality.name}</td>
                                            <td>{speciality.description}</td>
                                            <td>{speciality.created_at}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(speciality)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(speciality.id)}
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
                            <div className="dialogue-title">{editingSpeciality ? 'Edit Speciality' : 'Add Speciality'}</div>
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

export default Specialities; 