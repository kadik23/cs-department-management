import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

function Subjects({ subjects, search }) {
    const [formData, setFormData] = useState({
        subject_name: '',
        coefficient: '',
        credit: ''
    });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    useEffect(() => {
        // Set initial collapsed styles
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
        router.get('/admin/subjects', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/subjects', formData, {
            onSuccess: () => {
                setFormData({ subject_name: '', coefficient: '', credit: '' });
            }
        });
    };

    return (
        <div className="container">
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
                                    maxHeight: 0,
                                    width: 0,
                                    opacity: 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.5s',
                                    position: 'relative',
                                }}
                            >
                                <div className="input-wrapper">
                                    <label>Subject Name:</label>
                                    <input
                                        type="text"
                                        name="subject_name"
                                        id="subject_name"
                                        placeholder="Subject name"
                                        value={formData.subject_name}
                                        onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label>Coefficient:</label>
                                    <input
                                        type="number"
                                        name="coefficient"
                                        id="coefficient"
                                        placeholder="coefficient"
                                        value={formData.coefficient}
                                        onChange={e => setFormData({ ...formData, coefficient: e.target.value })}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label>Credit:</label>
                                    <input
                                        type="number"
                                        name="credit"
                                        id="credit"
                                        placeholder="credit"
                                        value={formData.credit}
                                        onChange={e => setFormData({ ...formData, credit: e.target.value })}
                                    />
                                </div>
                                <div className='flex item-center gap-4 '>
                                    <button
                                        id="close_create_spec"
                                        className="cancel-btn btn"
                                        type="button"
                                        ref={closeBtnRef}
                                    >Cancel</button>
                                    <button type="submit" className="btn">Create</button>
                                </div>
                            </form>
                            <button
                                id="open_create_spec"
                                className="btn"
                                ref={openBtnRef}
                                style={{ opacity: 1, transition: 'opacity 0.5s' }}
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
                            </div>
                            <div className="list-body">
                                {subjects.map(row => (
                                    <div className="list-row" key={row.id}>
                                        <div className="list-item">{row.id}</div>
                                        <div className="list-item" style={{ flex: 3 }}>{row.subject_name}</div>
                                        <div className="list-item">{row.coefficient}</div>
                                        <div className="list-item">{row.credit}</div>
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