import React, { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Resources({ resources, search }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [editingResource, setEditingResource] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const form = useForm({
        resource_type: '',
        resource_number: ''
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
            setEditingResource(null);
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
                setEditingResource(null);
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

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/resources', { filter_resource_type: filterType }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingResource) {
            form.put(`/admin/resources/${editingResource.id}`, form.data, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Resource updated successfully!' });
                    setEditingResource(null);
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to update resource.' });
                },
            });
        } else {
            form.post('/admin/resources', {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Resource created successfully!' });
                    form.reset();
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Failed to create resource.' });
                },
            });
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        form.setData({
            resource_type: resource.resource_type,
            resource_number: resource.resource_number
        });
        if (formRef.current && openBtnRef.current) {
            openBtnRef.current.style.opacity = '0';
            formRef.current.style.maxHeight = '1000px';
            formRef.current.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                formRef.current.style.opacity = '1';
            }, 500);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            router.delete(`/admin/resources/${id}`);
        }
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Resources</div>
                    <div className="page-actions">
                        <button id="open_create_spec" className="btn" ref={openBtnRef} style={{ opacity: 1, transition: 'opacity 0.5s' }}>Add Resource</button>
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
                                marginBottom: '20px',
                            }}
                        >
                            <div className="input-wrapper">
                                <label htmlFor="resource_type">Resource Type:</label>
                                <input
                                    type="text"
                                    name="resource_type"
                                    id="resource_type"
                                    placeholder="Resource type"
                                    value={form.data.resource_type}
                                    onChange={e => form.setData('resource_type', e.target.value)}
                                    required
                                />
                                {form.errors.resource_type && <div className="text-red-500 mt-2">{form.errors.resource_type}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="resource_number">Resource Number/Reference:</label>
                                <input
                                    type="number"
                                    name="resource_number"
                                    id="resource_number"
                                    placeholder="Resource number"
                                    value={form.data.resource_number}
                                    onChange={e => form.setData('resource_number', e.target.value)}
                                    required
                                />
                                {form.errors.resource_number && <div className="text-red-500 mt-2">{form.errors.resource_number}</div>}
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>{editingResource ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                        <div className="list-control">
                            <form method="POST" className="input-group" style={{ marginRight: 10 }} onSubmit={handleFilter}>
                                <input style={{ backgroundColor: '#ebebeb', padding: '10px 20px' }} placeholder="Resource Type" type="text" className="selected_input" list="filter-resource-types" value={filterType} onChange={e => setFilterType(e.target.value)} />
                                <input type="hidden" className="hidden_selected_input" id="filter_resource_type" name="filter_resource_type" value={filterType} />
                                <datalist id="filter-resource-types">
                                    <option value="All">All</option>
                                    <option value="Amphi">Amphi</option>
                                    <option value="Sale">Sale</option>
                                    <option value="Labo">Labo</option>
                                </datalist>
                                <button style={{ marginRight: 10, marginLeft: 10, backgroundColor: '#16a34a', border: 'none' }} className="btn" type="submit">Filter</button>
                            </form>
                        </div>
                        <div className="list">
                            <div className="list-header">
                                <div className="list-header-item">Resource Id</div>
                                <div className="list-header-item" style={{ flex: 2 }}>Resource Type</div>
                                <div className="list-header-item">Resource Number/Reference</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {resources.map((resource) => (
                                    <div className="list-row" key={resource.id}>
                                        <div className="list-item">{resource.id}</div>
                                        <div className="list-item" style={{ flex: 2 }}>{resource.resource_type}</div>
                                        <div className="list-item">{resource.resource_number}</div>
                                        <div className="list-item">
                                            <button className="btn btn-secondary" onClick={() => handleEdit(resource)} style={{ marginRight: '10px' }}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(resource.id)}>Delete</button>
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

export default Resources; 