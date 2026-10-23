import React, { useState, useRef } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function AcademicLevels({ academicLevels = [], specialities = [], search = '' }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingLevel, setEditingLevel] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm({
        speciality_id: '',
        level: '',
    });

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingLevel(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingLevel(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingLevel) {
            form.put(`/admin/academic-levels/${editingLevel.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Academic level updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update academic level.' });
                },
            });
        } else {
            form.post('/admin/academic-levels', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Academic level added successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to add academic level.' });
                },
            });
        }
    };

    const handleEdit = (level) => {
        setEditingLevel(level);
        form.setData({
            speciality_id: level.speciality_id || '',
            level: level.level || '',
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this academic level?')) {
            router.delete(`/admin/academic-levels/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Academic level deleted successfully.' });
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to delete academic level.' });
                }
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/academic-levels', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const uniqueSpecialitiesCovered = new Set(academicLevels.map(l => l.speciality_id)).size;

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Academic Levels</div>
                    <div className="page-actions">
                        <button
                            id="open_create_level"
                            className="btn"
                            ref={openBtnRef}
                            onClick={openForm}
                            style={{
                                opacity: isFormOpen ? 0 : 1,
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'opacity 0.5s',
                            }}
                        >
                            Add Academic Level
                        </button>
                    </div>
                </div>

                <div className="row-wrapper" style={{ display: 'flex', gap: '20px', marginBottom: '20px', width: '100%' }}>
                    <div className="card-box" style={{ flex: 1 }}>
                        <div className="card-box-content">
                            <div className="card-box-title">Total Academic Levels</div>
                            <div className="card-box-value">{academicLevels.length}</div>
                        </div>
                    </div>
                    <div className="card-box" style={{ flex: 1 }}>
                        <div className="card-box-content">
                            <div className="card-box-title">Specialities Configured</div>
                            <div className="card-box-value">{uniqueSpecialitiesCovered} of {specialities.length}</div>
                        </div>
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
                                <label htmlFor="speciality_id">Speciality:</label>
                                <select
                                    id="speciality_id"
                                    name="speciality_id"
                                    value={form.data.speciality_id}
                                    onChange={e => form.setData('speciality_id', e.target.value)}
                                    required
                                    style={{
                                        width: 'calc(100%*11/12)',
                                        padding: '8px 16px',
                                        backgroundColor: '#e0f2fe',
                                        color: '#0c4a6e',
                                        borderRadius: '7px',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">Select Speciality</option>
                                    {specialities.map((speciality) => (
                                        <option key={speciality.id} value={speciality.id}>
                                            {speciality.speciality_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.speciality_id && (
                                    <div className="text-red-500 mt-2">{form.errors.speciality_id}</div>
                                )}
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="level">Level Number (Year):</label>
                                <input
                                    type="number"
                                    name="level"
                                    id="level"
                                    min="1"
                                    max="10"
                                    placeholder="e.g. 1 (for L1), 2 (for L2), 3 (for L3)"
                                    value={form.data.level}
                                    onChange={e => form.setData('level', e.target.value)}
                                    required
                                />
                                {form.errors.level && (
                                    <div className="text-red-500 mt-2">{form.errors.level}</div>
                                )}
                            </div>

                            <div className="flex item-center gap-4">
                                <button
                                    id="close_create_level"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={form.processing}>
                                    {editingLevel ? 'Save' : 'Add'}
                                </button>
                            </div>
                        </form>

                        <div className="list-control">
                            <form method="POST" className="search" onSubmit={handleSearch}>
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="search levels or specialities..." 
                                    defaultValue={search}
                                />
                                <div className="search-icon">
                                    <img src="/assets/icons/search.svg" alt="search-icon" />
                                </div>
                            </form>
                        </div>

                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Level</div>
                                <div className="list-header-item">Speciality</div>
                                <div className="list-header-item">Groups</div>
                                <div className="list-header-item">Students</div>
                                <div className="list-header-item">Lectures</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {academicLevels.length === 0 ? (
                                    <div className="list-row" style={{ justifyContent: 'center', color: '#64748b' }}>
                                        No academic levels found.
                                    </div>
                                ) : (
                                    academicLevels.map((lvl) => (
                                        <div className="list-row" key={lvl.id}>
                                            <div className="list-item" style={{ fontWeight: 700, color: '#0c4a6e' }}>
                                                L{lvl.level}
                                                <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px', fontWeight: 'normal' }}>
                                                    (Year {lvl.level})
                                                </span>
                                            </div>
                                            <div className="list-item" style={{ fontWeight: 600 }}>
                                                {lvl.speciality_name}
                                            </div>
                                            <div className="list-item">
                                                {lvl.groups_count} {lvl.groups_count === 1 ? 'group' : 'groups'}
                                            </div>
                                            <div className="list-item">
                                                {lvl.students_count} {lvl.students_count === 1 ? 'student' : 'students'}
                                            </div>
                                            <div className="list-item">
                                                {lvl.lectures_count} {lvl.lectures_count === 1 ? 'lecture' : 'lectures'}
                                            </div>
                                            <div className="list-item">
                                                <button 
                                                    className="btn btn-secondary small-btn" 
                                                    onClick={() => handleEdit(lvl)}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger small-btn" 
                                                    onClick={() => handleDelete(lvl.id)}
                                                    style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcademicLevels;
