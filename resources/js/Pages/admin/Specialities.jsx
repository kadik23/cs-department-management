import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

function Specialities({ specialities, search }) {
    const [editingSpeciality, setEditingSpeciality] = useState(null);
    const [formData, setFormData] = useState({
        speciality_name: '',
    });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    useEffect(() => {
        const form = formRef.current;
        const openBtn = openBtnRef.current;
        if (form && openBtn) {
            form.style.maxHeight = '0';
            form.style.width = '0';
            form.style.opacity = '0';
            openBtn.style.opacity = '1';
        }
        // Open form logic
        const openHandler = (ev) => {
            ev.preventDefault();
            setEditingSpeciality(null);
            setFormData({ speciality_name: '' });
            openBtn.style.opacity = '0';
            form.style.maxHeight = '1000px';
            form.style.width = 'calc(100%*1/2)';
            setTimeout(() => {
                form.style.opacity = '1';
            }, 500);
        };
        // Close form logic
        const closeHandler = (ev) => {
            ev.preventDefault();
            form.style.opacity = '0';
            setTimeout(() => {
                form.style.maxHeight = '0';
                form.style.width = '0';
                openBtn.style.opacity = '1';
                setEditingSpeciality(null);
                setFormData({ speciality_name: '' });
            }, 500);
        };
        if (openBtn) openBtn.addEventListener('click', openHandler);
        if (closeBtnRef.current) closeBtnRef.current.addEventListener('click', closeHandler);
        return () => {
            if (openBtn) openBtn.removeEventListener('click', openHandler);
            if (closeBtnRef.current) closeBtnRef.current.removeEventListener('click', closeHandler);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSpeciality) {
            router.put(`/admin/specialities/${editingSpeciality.id}`, formData, {
                onSuccess: () => {
                    setEditingSpeciality(null);
                    setFormData({ speciality_name: '' });
                    // Collapse form
                    if (formRef.current && openBtnRef.current) {
                        formRef.current.style.opacity = '0';
                        setTimeout(() => {
                            formRef.current.style.maxHeight = '0';
                            formRef.current.style.width = '0';
                            openBtnRef.current.style.opacity = '1';
                        }, 500);
                    }
                }
            });
        } else {
            router.post('/admin/specialities', formData, {
                onSuccess: () => {
                    setFormData({ speciality_name: '' });
                    // Collapse form
                    if (formRef.current && openBtnRef.current) {
                        formRef.current.style.opacity = '0';
                        setTimeout(() => {
                            formRef.current.style.maxHeight = '0';
                            formRef.current.style.width = '0';
                            openBtnRef.current.style.opacity = '1';
                        }, 500);
                    }
                }
            });
        }
    };

    const handleEdit = (speciality) => {
        setEditingSpeciality(speciality);
        setFormData({
            speciality_name: speciality.speciality_name,
        });
        // Open the form
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
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Specialities</div>
                    <div className="page-actions">
                        <button id="open_create_spec" className="btn" ref={openBtnRef} style={{ opacity: 1, transition: 'opacity 0.5s' }}>Add Speciality</button>
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
                                <label htmlFor="speciality_name">Name:</label>
                                <input
                                    type="text"
                                    name="speciality_name"
                                    id="speciality_name"
                                    placeholder="name"
                                    value={formData.speciality_name}
                                    onChange={e => setFormData({ ...formData, speciality_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn">{editingSpeciality ? 'Save' : 'Add'}</button>
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
                                        <div className="list-item">{speciality.name}</div>
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