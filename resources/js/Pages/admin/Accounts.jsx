import React, { useRef, useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Accounts({ users, search, groups = [] }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const form = useForm({
        username: '',
        email: '',
        password: '',
        role: 'student',
        first_name: '',
        last_name: '',
        academic_level_id: '',
        group_id: '',
    });

    useEffect(() => {
        // Set initial collapsed styles
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
        router.get('/admin/accounts', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/accounts', {
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Account created successfully!' });
                form.reset();
            },
            onError: () => {
                setAlert({ type: 'error', message: 'Failed to create account.' });
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this account?')) {
            router.delete(`/admin/accounts/${id}`);
        }
    };

    return (
        <div className="container">
            <Alert type="success" message={flash.success} />
            <Alert type="error" message={flash.error} />
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Accounts</div>
                    <div className="page-actions">
                        <button
                            id="open_create_spec"
                            className="btn"
                            ref={openBtnRef}
                            style={{ opacity: 1, transition: 'opacity 0.5s' }}
                        >Add Account</button>
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
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={form.data.username}
                                    onChange={e => form.setData('username', e.target.value)}
                                    required
                                />
                                {form.errors.username && <div className="text-red-500 mt-2">{form.errors.username}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    required
                                />
                                {form.errors.email && <div className="text-red-500 mt-2">{form.errors.email}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={form.data.password}
                                    onChange={e => form.setData('password', e.target.value)}
                                    required
                                />
                                {form.errors.password && <div className="text-red-500 mt-2">{form.errors.password}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="role">Role:</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={form.data.role}
                                    onChange={e => form.setData('role', e.target.value)}
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="administrator">Administrator</option>
                                </select>
                                {form.errors.role && <div className="text-red-500 mt-2">{form.errors.role}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="first_name">First Name:</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={form.data.first_name}
                                    onChange={e => form.setData('first_name', e.target.value)}
                                    required
                                />
                                {form.errors.first_name && <div className="text-red-500 mt-2">{form.errors.first_name}</div>}
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="last_name">Last Name:</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={form.data.last_name}
                                    onChange={e => form.setData('last_name', e.target.value)}
                                    required
                                />
                                {form.errors.last_name && <div className="text-red-500 mt-2">{form.errors.last_name}</div>}
                            </div>
                            {form.data.role === 'student' && (
                                <>
                                    <div className="input-wrapper">
                                        <label htmlFor="group_id">Group:</label>
                                        <select
                                            id="group_id"
                                            name="group_id"
                                            value={form.data.group_id}
                                            onChange={e => {
                                                const groupId = e.target.value;
                                                const group = groups.find(g => String(g.id) === groupId);
                                                form.setData('group_id', groupId);
                                                form.setData('academic_level_id', group ? group.academic_level_id : '');
                                            }}
                                            required
                                        >
                                            <option value="">Select Group</option>
                                            {groups.length > 0 ? (
                                                groups.map(g => (
                                                    <option key={g.id} value={g.id}>
                                                        {`L${g.level} ${g.speciality_name} Group ${g.group_number}`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No groups available</option>
                                            )}
                                        </select>
                                        {form.errors.group_id && <div className="text-red-500 mt-2">{form.errors.group_id}</div>}
                                    </div>
                                    {/* Hidden academic_level_id input */}
                                    <input
                                        type="hidden"
                                        id="academic_level_id"
                                        name="academic_level_id"
                                        value={form.data.academic_level_id}
                                        readOnly
                                        required
                                    />
                                </>
                            )}
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                >Cancel</button>
                                <button type="submit" className="btn" disabled={form.processing}>Create</button>
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
                                <div className="list-header-item">Username</div>
                                <div className="list-header-item">Email</div>
                                <div className="list-header-item">Role</div>
                                <div className="list-header-item">Created</div>
                                <div className="list-header-item">Actions</div>
                            </div>
                            <div className="list-body">
                                {users.map((user) => (
                                    <div className="list-row" key={user.id}>
                                        <div className="list-item">{user.username}</div>
                                        <div className="list-item">{user.email}</div>
                                        <div className="list-item">{user.role}</div>
                                        <div className="list-item">{user.created_at}</div>
                                        <div className="list-item">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(user.id)}
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

export default Accounts; 