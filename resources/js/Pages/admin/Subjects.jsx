import React, { useEffect, useRef, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Subjects({ subjects, search }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingSubject, setEditingSubject] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm({
        subject_name: '',
        coefficient: '',
        credit: ''
    });

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        setEditingSubject(null);
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        setEditingSubject(null);
        form.reset();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/subjects', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        form.setData({
            subject_name: subject.subject_name,
            coefficient: subject.coefficient,
            credit: subject.credit,
        });
        setIsFormOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSubject) {
            form.put(`/admin/subjects/${editingSubject.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Subject updated successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to update subject.' });
                },
            });
        } else {
            form.post('/admin/subjects', {
                preserveScroll: true,
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Subject created successfully!' });
                    closeForm();
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    setAlert({ type: 'error', message: firstError || 'Failed to create subject.' });
                },
            });
        }
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Subjects</div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
                        <div className="row">
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
                                    <label>Subject Name:</label>
                                    <input
                                        type="text"
                                        name="subject_name"
                                        id="subject_name"
                                        placeholder="Subject name"
                                        value={form.data.subject_name}
                                        onChange={e => form.setData('subject_name', e.target.value)}
                                    />
                                    {form.errors.subject_name && <div className="text-red-500 mt-2">{form.errors.subject_name}</div>}
                                </div>
                                <div className="input-wrapper">
                                    <label>Coefficient:</label>
                                    <input
                                        type="number"
                                        name="coefficient"
                                        id="coefficient"
                                        placeholder="coefficient"
                                        value={form.data.coefficient}
                                        onChange={e => form.setData('coefficient', e.target.value)}
                                    />
                                    {form.errors.coefficient && <div className="text-red-500 mt-2">{form.errors.coefficient}</div>}
                                </div>
                                <div className="input-wrapper">
                                    <label>Credit:</label>
                                    <input
                                        type="number"
                                        name="credit"
                                        id="credit"
                                        placeholder="credit"
                                        value={form.data.credit}
                                        onChange={e => form.setData('credit', e.target.value)}
                                    />
                                    {form.errors.credit && <div className="text-red-500 mt-2">{form.errors.credit}</div>}
                                </div>
                                <div className='flex item-center gap-4 '>
                                    <button
                                        id="close_create_spec"
                                        className="cancel-btn btn"
                                        type="button"
                                        ref={closeBtnRef}
                                        onClick={closeForm}
                                    >Cancel</button>
                                    <button type="submit" className="btn" disabled={form.processing}>{editingSubject ? 'Save' : 'Create'}</button>
                                </div>
                            </form>
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
                            >Create Subject</button>
                        </div>
                        <div className="list-control">
                            <form method="POST" className="search" onSubmit={handleSearch}>
                                <input type="text" name="search" placeholder="search..." defaultValue={search} />
                                <div className="search-icon">
                                    <img src="/assets/icons/search.svg" alt="search-icon" />
                                </div>
                            </form>
                        </div>
                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Id</div>
                                <div className="list-header-item" style={{ flex: 3 }}>Subject Name</div>
                                <div className="list-header-item">Coefficient</div>
                                <div className="list-header-item">Credit</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {subjects.map(row => (
                                    <div className="list-row" key={row.id}>
                                        <div className="list-item">{row.id}</div>
                                        <div className="list-item" style={{ flex: 3 }}>{row.subject_name}</div>
                                        <div className="list-item">{row.coefficient}</div>
                                        <div className="list-item">{row.credit}</div>
                                        <div className="list-item">
                                            <button className="btn btn-secondary" onClick={() => handleEdit(row)} style={{ marginRight: '10px' }}>Edit</button>
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

export default Subjects; 