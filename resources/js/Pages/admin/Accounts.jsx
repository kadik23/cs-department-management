import React, { useRef, useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Alert from '@/components/Alert';

function Accounts({ users, search, groups = [] }) {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });
    const formRef = useRef();
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetUser, setResetUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [resetProcessing, setResetProcessing] = useState(false);
    const [resetError, setResetError] = useState('');

    const openResetModal = (targetUser) => {
        setResetUser(targetUser);
        setNewPassword('');
        setResetError('');
        setShowNewPassword(false);
        setResetModalOpen(true);
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
        let pass = '';
        for (let i = 0; i < 10; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(pass);
        setShowNewPassword(true);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setResetError('Password must be at least 6 characters.');
            return;
        }
        setResetProcessing(true);
        router.post(`/admin/accounts/${resetUser.id}/reset-password`, {
            password: newPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: `Password for ${resetUser.username} was reset successfully!` });
                setResetModalOpen(false);
                setResetUser(null);
                setNewPassword('');
                setResetProcessing(false);
            },
            onError: (errs) => {
                const msg = Object.values(errs)[0] || 'Failed to reset password.';
                setResetError(msg);
                setResetProcessing(false);
            }
        });
    };

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

    const openForm = (ev) => {
        if (ev) ev.preventDefault();
        form.reset();
        setIsFormOpen(true);
    };

    const closeForm = (ev) => {
        if (ev) ev.preventDefault();
        setIsFormOpen(false);
        form.reset();
    };

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
            preserveScroll: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Account created successfully!' });
                closeForm();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                setAlert({ type: 'error', message: firstError || 'Failed to create account.' });
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
                            onClick={openForm}
                            style={{
                                opacity: isFormOpen ? 0 : 1,
                                pointerEvents: isFormOpen ? 'none' : 'auto',
                                transition: 'opacity 0.5s',
                            }}
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
                                maxHeight: isFormOpen ? '1500px' : 0,
                                width: isFormOpen ? 'calc(100%*1/2)' : 0,
                                opacity: isFormOpen ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.5s ease-in-out',
                                position: 'relative',
                                marginBottom: isFormOpen ? '20px' : 0,
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
                                                form.setData(data => ({
                                                    ...data,
                                                    group_id: groupId,
                                                    academic_level_id: group ? group.academic_level_id : ''
                                                }));
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
                                        {form.errors.academic_level_id && <div className="text-red-500 mt-2">{form.errors.academic_level_id}</div>}
                                    </div>
                                </>
                            )}
                            <div className='flex item-center gap-4 '>
                                <button
                                    id="close_create_spec"
                                    className="cancel-btn btn"
                                    type="button"
                                    ref={closeBtnRef}
                                    onClick={closeForm}
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
                                        <div className="list-item" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => openResetModal(user)}
                                                style={{
                                                    backgroundColor: '#0284c7',
                                                    color: '#ffffff',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '6px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)',
                                                    transition: 'background-color 0.15s ease',
                                                }}
                                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
                                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                                <span>Reset Password</span>
                                            </button>
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

            {/* Admin Password Reset Modal */}
            {resetModalOpen && resetUser && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '16px',
                    }}
                    onClick={() => !resetProcessing && setResetModalOpen(false)}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            maxWidth: '480px',
                            width: '100%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                            overflow: 'hidden',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: '16px 20px',
                                backgroundColor: '#0c4a6e',
                                color: '#ffffff',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span style={{ fontWeight: 700, fontSize: '15px' }}>Department Password Reset</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => !resetProcessing && setResetModalOpen(false)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#ffffff',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleResetPassword} style={{ padding: '20px' }}>
                            {/* Target User Info Card */}
                            <div
                                style={{
                                    backgroundColor: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    marginBottom: '16px',
                                }}
                            >
                                <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Target Account
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e' }}>
                                    {resetUser.first_name ? `${resetUser.first_name} ${resetUser.last_name}` : resetUser.username}
                                </div>
                                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                                    Username: <strong>{resetUser.username}</strong> • Role: <strong>{resetUser.role}</strong>
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    Email: {resetUser.email}
                                </div>
                            </div>

                            {/* Department Security Notice */}
                            <div
                                style={{
                                    backgroundColor: '#fef3c7',
                                    border: '1px solid #fde68a',
                                    color: '#92400e',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    fontSize: '12px',
                                    lineHeight: '1.4',
                                    marginBottom: '16px',
                                }}
                            >
                                <strong>Department Lock Notice:</strong> Students and teachers cannot reset passwords themselves. Please communicate the newly assigned password securely to the user.
                            </div>

                            {/* New Password Input */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        New Password <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#0284c7',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Auto-Generate
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Minimum 6 characters"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setResetError('');
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '10px 40px 10px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '13px',
                                            color: '#1e293b',
                                            boxSizing: 'border-box',
                                        }}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#64748b',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showNewPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {resetError && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                                        {resetError}
                                    </div>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => setResetModalOpen(false)}
                                    disabled={resetProcessing}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        color: '#475569',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetProcessing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#0284c7',
                                        color: '#ffffff',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: resetProcessing ? 'not-allowed' : 'pointer',
                                        opacity: resetProcessing ? 0.7 : 1,
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>{resetProcessing ? 'Saving...' : 'Set Password'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Accounts; 