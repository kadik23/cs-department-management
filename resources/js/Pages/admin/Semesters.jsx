import React, { useState, useRef } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Semesters({ semesters = [], search = '' }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingSemester, setEditingSemester] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm({
        semester_name: '',
        start_at: '',
        end_at: '',
    });

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingSemester(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingSemester(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSemester) {
            form.put(`/admin/semesters/${editingSemester.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Semester updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update semester.' });
                },
            });
        } else {
            form.post('/admin/semesters', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Semester added successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to add semester.' });
                },
            });
        }
    };

    const handleEdit = (semester) => {
        setEditingSemester(semester);
        form.setData({
            semester_name: semester.semester_name || '',
            start_at: semester.start_at || '',
            end_at: semester.end_at || '',
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this semester?')) {
            router.delete(`/admin/semesters/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Semester deleted successfully.' });
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to delete semester.' });
                }
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/semesters', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const activeSemester = semesters.find(s => s.is_active);

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Semesters</div>
                    <div className="page-actions">
                        <button
                            id="open_create_semester"
                            className="btn"
                            ref={openBtnRef}
                            onClick={openForm}
                            style={{
                                opacity: isFormOpen ? 0 : 1,
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'opacity 0.5s',
                            }}
                        >
                            Add Semester
                        </button>
                    </div>
                </div>

                <div className="row-wrapper" style={{ display: 'flex', gap: '20px', marginBottom: '20px', width: '100%' }}>
                    <div className="card-box" style={{ flex: 1 }}>
                        <div className="card-box-content">
                            <div className="card-box-title">Total Semesters</div>
                            <div className="card-box-value">{semesters.length}</div>
                        </div>
                    </div>
                    <div className="card-box" style={{ flex: 1 }}>
                        <div className="card-box-content">
                            <div className="card-box-title">Current Active Semester</div>
                            <div className="card-box-value" style={{ fontSize: '18px', color: activeSemester ? '#0284c7' : '#64748b' }}>
                                {activeSemester ? activeSemester.semester_name : 'No Active Semester'}
                            </div>
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
                                <label htmlFor="semester_name">Semester Name:</label>
                                <input
                                    type="text"
                                    name="semester_name"
                                    id="semester_name"
                                    placeholder="e.g. Semester 1 (2026/2027)"
                                    value={form.data.semester_name}
                                    onChange={e => form.setData('semester_name', e.target.value)}
                                    required
                                />
                                {form.errors.semester_name && (
                                    <div className="text-red-500 mt-2">{form.errors.semester_name}</div>
                                )}
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="start_at">Start Date:</label>
                                <input
                                    type="date"
                                    name="start_at"
                                    id="start_at"
                                    value={form.data.start_at}
                                    onChange={e => form.setData('start_at', e.target.value)}
                                    required
                                />
                                {form.errors.start_at && (
                                    <div className="text-red-500 mt-2">{form.errors.start_at}</div>
                                )}
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="end_at">End Date:</label>
                                <input
                                    type="date"
                                    name="end_at"
                                    id="end_at"
                                    value={form.data.end_at}
                                    onChange={e => form.setData('end_at', e.target.value)}
                                    required
                                />
                                {form.errors.end_at && (
                                    <div className="text-red-500 mt-2">{form.errors.end_at}</div>
                                )}
                            </div>

                            <div className="flex item-center gap-4">
                                <button
                                    id="close_create_semester"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={form.processing}>
                                    {editingSemester ? 'Save' : 'Add'}
                                </button>
                            </div>
                        </form>

                        <div className="list-control">
                            <form method="POST" className="search" onSubmit={handleSearch}>
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="search semesters..." 
                                    defaultValue={search}
                                />
                                <div className="search-icon">
                                    <img src="/assets/icons/search.svg" alt="search-icon" />
                                </div>
                            </form>
                        </div>

                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Semester Name</div>
                                <div className="list-header-item">Start Date</div>
                                <div className="list-header-item">End Date</div>
                                <div className="list-header-item">Status</div>
                                <div className="list-header-item">Linked Grades</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {semesters.length === 0 ? (
                                    <div className="list-row" style={{ justifyContent: 'center', color: '#64748b' }}>
                                        No semesters found.
                                    </div>
                                ) : (
                                    semesters.map((semester) => (
                                        <div className="list-row" key={semester.id}>
                                            <div className="list-item" style={{ fontWeight: 600, color: '#0c4a6e' }}>
                                                {semester.semester_name}
                                            </div>
                                            <div className="list-item">{semester.start_at || '—'}</div>
                                            <div className="list-item">{semester.end_at || '—'}</div>
                                            <div className="list-item">
                                                <span
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '9999px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.05em',
                                                        textTransform: 'uppercase',
                                                        display: 'inline-block',
                                                        backgroundColor:
                                                            semester.status === 'Active'
                                                                ? '#ccfbf1'
                                                                : semester.status === 'Upcoming'
                                                                ? '#e0f2fe'
                                                                : '#f1f5f9',
                                                        color:
                                                            semester.status === 'Active'
                                                                ? '#0f766e'
                                                                : semester.status === 'Upcoming'
                                                                ? '#0369a1'
                                                                : '#64748b',
                                                        border: `1px solid ${
                                                            semester.status === 'Active'
                                                                ? '#99f6e4'
                                                                : semester.status === 'Upcoming'
                                                                ? '#bae6fd'
                                                                : '#e2e8f0'
                                                        }`
                                                    }}
                                                >
                                                    {semester.status}
                                                </span>
                                            </div>
                                            <div className="list-item">
                                                {semester.grades_count} grades
                                            </div>
                                            <div className="list-item">
                                                <button 
                                                    className="btn btn-secondary small-btn" 
                                                    onClick={() => handleEdit(semester)}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger small-btn" 
                                                    onClick={() => handleDelete(semester.id)}
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

export default Semesters;
