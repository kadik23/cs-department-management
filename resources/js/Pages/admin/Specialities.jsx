import React, { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Specialities({ specialities, search }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingSpeciality, setEditingSpeciality] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm({
        speciality_name: '',
    });

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingSpeciality(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingSpeciality(null);
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSpeciality) {
            form.put(`/admin/specialities/${editingSpeciality.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Speciality updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update speciality.' });
                },
            });
        } else {
            form.post('/admin/specialities', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Speciality added successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to add speciality.' });
                },
            });
        }
    };

    const handleEdit = (speciality) => {
        setEditingSpeciality(speciality);
        form.setData({
            speciality_name: speciality.speciality_name,
        });
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this speciality?')) {
            router.delete(`/admin/specialities/${id}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/specialities', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Specialities</div>
                    <div className="page-actions">
                        <button
                            id="open_create_spec"
                            className="btn"
                            ref={openBtnRef}
                            onClick={openForm}
                            style={{
                                opacity: isFormOpen ? 0 : 1,
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'opacity 0.5s',
                            }}
                        >Add Speciality</button>
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
                                <label htmlFor="speciality_name">Name:</label>
                                <input
                                    type="text"
                                    name="speciality_name"
                                    id="speciality_name"
                                    placeholder="name"
                                    value={form.data.speciality_name}
                                    onChange={e => form.setData('speciality_name', e.target.value)}
                                    required
                                />
                                {form.errors.speciality_name && <div className="text-red-500 mt-2">{form.errors.speciality_name}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                    onClick={closeForm}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>{editingSpeciality ? 'Save' : 'Add'}</button>
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
                                <div className="list-header-item">Name</div>
                                <div className="list-header-item">Created</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {specialities.map((speciality) => (
                                    <div className="list-row" key={speciality.id}>
                                        <div className="list-item">{speciality.speciality_name}</div>
                                        <div className="list-item">{speciality.created_at}</div>
                                        <div className="list-item">
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

export default Specialities; 