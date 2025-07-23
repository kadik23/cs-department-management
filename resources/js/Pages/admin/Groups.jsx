import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Groups({ groups, academicLevels, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [formData, setFormData] = useState({
        group_number: '',
        academic_level_id: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/groups', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingGroup) {
            router.put(`/admin/groups/${editingGroup.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingGroup(null);
                    setFormData({ group_number: '', academic_level_id: '' });
                }
            });
        } else {
            router.post('/admin/groups', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ group_number: '', academic_level_id: '' });
                }
            });
        }
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        setFormData({
            group_number: group.group_number,
            academic_level_id: group.academic_level_id
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this group?')) {
            router.delete(`/admin/groups/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingGroup(null);
        setFormData({ group_number: '', academic_level_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Groups</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Group</button>
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
                                        <th>Group Number</th>
                                        <th>Level</th>
                                        <th>Speciality</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group) => (
                                        <tr key={group.id}>
                                            <td>{group.group_number}</td>
                                            <td>L{group.level}</td>
                                            <td>{group.speciality_name}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(group)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(group.id)}
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
                            <div className="dialogue-title">{editingGroup ? 'Edit Group' : 'Add Group'}</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="group_number">Group Number:</label>
                                        <input 
                                            type="number" 
                                            id="group_number" 
                                            name="group_number" 
                                            value={formData.group_number}
                                            onChange={(e) => setFormData({...formData, group_number: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="academic_level_id">Academic Level:</label>
                                        <select 
                                            id="academic_level_id" 
                                            name="academic_level_id" 
                                            value={formData.academic_level_id}
                                            onChange={(e) => setFormData({...formData, academic_level_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Academic Level</option>
                                            {academicLevels.map((level) => (
                                                <option key={level.id} value={level.id}>
                                                    L{level.level} - {level.speciality.name}
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

export default Groups; 