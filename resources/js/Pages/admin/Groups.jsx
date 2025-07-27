import React, { useRef, useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Groups({ groups, academicLevels, search, responsibles = [] }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingGroup, setEditingGroup] = useState(null);
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const form = useForm({
        group_number: '',
        academic_level_id: '',
        responsible: '',
    });

    useEffect(() => {
        const formEl = formRef.current;
        const openBtn = openBtnRef.current;
        if (formEl && openBtn) {
            formEl.style.maxHeight = '0';
            formEl.style.width = '0';
            formEl.style.opacity = '0';
            openBtn.style.opacity = '1';
        }
        const openHandler = (ev) => {
            ev.preventDefault();
            setEditingGroup(null);
            form.reset();
            openBtn.style.opacity = '0';
            formEl.style.maxHeight = '1000px';
            formEl.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                formEl.style.opacity = '1';
            }, 500);
        };
        const closeHandler = (ev) => {
            ev.preventDefault();
            formEl.style.opacity = '0';
            setTimeout(() => {
                formEl.style.maxHeight = '0';
                formEl.style.width = '0';
                openBtn.style.opacity = '1';
                setEditingGroup(null);
                form.reset();
            }, 500);
        };
        if (openBtn) openBtn.addEventListener('click', openHandler);
        if (closeBtnRef.current) closeBtnRef.current.addEventListener('click', closeHandler);
        return () => {
            if (openBtn) openBtn.removeEventListener('click', openHandler);
            if (closeBtnRef.current) closeBtnRef.current.removeEventListener('click', closeHandler);
        };
    }, []);

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
            form.put(`/admin/groups/${editingGroup.id}`, form.data, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Group updated successfully!' });
                    setEditingGroup(null);
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to update group.' });
                },
            });
        } else {
            form.post('/admin/groups', {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Group created successfully!' });
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to create group.' });
                },
            });
        }
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        form.setData({
            group_number: group.group_number,
            academic_level_id: group.academic_level_id,
            responsible: group.responsible || '',
        });
        const formEl = formRef.current;
        const openBtn = openBtnRef.current;
        openBtn.style.opacity = '0';
        formEl.style.maxHeight = '1000px';
        formEl.style.width = 'calc(100%*1/2)';
        setTimeout(() => {
            formEl.style.opacity = '1';
        }, 500);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this group?')) {
            router.delete(`/admin/groups/${id}`);
        }
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Groups</div>
                    <div className="page-actions">
                        <button
                            id="open_create_spec"
                            className="btn"
                            ref={openBtnRef}
                            style={{ opacity: 1, transition: 'opacity 0.5s' }}
                        >Add Group</button>
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
                                maxHeight: 0,
                                width: 0,
                                opacity: 0,
                                overflow: 'hidden',
                                transition: 'all 0.5s',
                                position: 'relative',
                            }}
                        >
                            <div className="input-wrapper">
                                <label htmlFor="group_number">Group Number:</label>
                                <input
                                    type="number"
                                    id="group_number"
                                    name="group_number"
                                    value={form.data.group_number}
                                    onChange={e => form.setData('group_number', e.target.value)}
                                    required
                                />
                                {form.errors.group_number && <div className="text-red-500 mt-2">{form.errors.group_number}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="academic_level_id">Academic Level:</label>
                                <select
                                    id="academic_level_id"
                                    name="academic_level_id"
                                    value={form.data.academic_level_id}
                                    onChange={e => form.setData('academic_level_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Academic Level</option>
                                    {academicLevels.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            L{level.level} - {level.speciality.name || level.speciality_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.academic_level_id && <div className="text-red-500 mt-2">{form.errors.academic_level_id}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="responsible">Responsible:</label>
                                <select
                                    id="responsible"
                                    name="responsible"
                                    value={form.data.responsible}
                                    onChange={e => form.setData('responsible', e.target.value)}
                                    required
                                >
                                    <option value="">Select Responsible</option>
                                    {responsibles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {form.errors.responsible && <div className="text-red-500 mt-2">{form.errors.responsible}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>{editingGroup ? 'Save' : 'Create'}</button>
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
                                <div className="list-header-item">Group Id</div>
                                <div className="list-header-item">Group Number</div>
                                <div className="list-header-item">Speciality</div>
                                <div className="list-header-item">Responsable</div>
                                <div className="list-header-item">Total Students</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {groups.map((group) => (
                                    <div className="list-row" key={group.id}>
                                        <div className="list-item">{group.id}</div>
                                        <div className="list-item">{group.group_number}</div>
                                        <div className="list-item">{group.speciality_name}</div>
                                        <div className="list-item">{group.responsable}</div>
                                        <div className="list-item">{group.total_students}</div>
                                        <div className="list-item">
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

export default Groups; 