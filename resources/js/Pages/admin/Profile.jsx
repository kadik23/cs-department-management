import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Alert from '@/components/Alert';

export default function Profile({ adminUser }) {
    const { flash = {} } = usePage().props;
    const [alert, setAlert] = useState({ type: '', message: '' });

    // Profile Details Form (Editable for Admin)
    const profileForm = useForm({
        first_name: adminUser?.first_name || '',
        last_name: adminUser?.last_name || '',
        username: adminUser?.username || '',
        email: adminUser?.email || '',
        phone_number: adminUser?.phone_number || '',
        location: adminUser?.location || '',
    });

    // Password Update Form (Editable for Admin)
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/admin/profile', {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Profile information updated successfully!' });
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                setAlert({ type: 'error', message: first || 'Failed to update profile.' });
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Administrator password updated successfully!' });
                passwordForm.reset();
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                setAlert({ type: 'error', message: first || 'Failed to update password.' });
            },
        });
    };

    return (
        <div
            className="page-content"
            style={{
                width: '100%',
                flex: 1,
                minWidth: 0,
                padding: '36px 48px 60px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc',
            }}
        >
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <Alert type="success" message={flash.success} />
                <Alert type="error" message={flash.error} />
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert({})} />

                {/* Page Header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: '#0c4a6e', letterSpacing: '-0.3px' }}>
                        Admin Profile & Settings
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                        Manage department administrator credentials, personal details, and security settings
                    </div>
                </div>

                {/* Department Master Control Banner */}
                <div
                    style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        marginBottom: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c4a6e' }}>
                            Master Department Control
                        </div>
                        <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: '1.45' }}>
                            As Department Administrator, you have full edit authority over your account and administrative rights to reset credentials and manage accounts across all faculty and student cohorts.
                        </div>
                    </div>
                </div>

                {/* Sections Grid with generous space */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
                        gap: '32px',
                        alignItems: 'start',
                    }}
                >
                    {/* 1. Profile Information Card (Editable) */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '18px 24px',
                                backgroundColor: '#0c4a6e',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Personal Information</span>
                        </div>

                        <form
                            onSubmit={handleProfileSubmit}
                            style={{
                                padding: '28px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: '20px',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            {/* First & Last Name */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                        First Name <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.first_name}
                                        onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '14px',
                                            color: '#1e293b',
                                            backgroundColor: '#ffffff',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            margin: 0,
                                        }}
                                        required
                                    />
                                    {profileForm.errors.first_name && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.first_name}</div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                        Last Name <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.last_name}
                                        onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '14px',
                                            color: '#1e293b',
                                            backgroundColor: '#ffffff',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            margin: 0,
                                        }}
                                        required
                                    />
                                    {profileForm.errors.last_name && (
                                        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.last_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Username */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                    Username <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.username}
                                    onChange={(e) => profileForm.setData('username', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        backgroundColor: '#ffffff',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                    }}
                                    required
                                />
                                {profileForm.errors.username && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.username}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        backgroundColor: '#ffffff',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                    }}
                                    required
                                />
                                {profileForm.errors.email && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{profileForm.errors.email}</div>
                                )}
                            </div>

                            {/* Phone & Location */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+213..."
                                        value={profileForm.data.phone_number}
                                        onChange={(e) => profileForm.setData('phone_number', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '14px',
                                            color: '#1e293b',
                                            backgroundColor: '#ffffff',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            margin: 0,
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                        Office / Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Block B, Office 12"
                                        value={profileForm.data.location}
                                        onChange={(e) => profileForm.setData('location', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '11px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #cbd5e1',
                                            fontSize: '14px',
                                            color: '#1e293b',
                                            backgroundColor: '#ffffff',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            margin: 0,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ paddingTop: '8px' }}>
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: '#0284c7',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '11px 22px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: profileForm.processing ? 'not-allowed' : 'pointer',
                                        opacity: profileForm.processing ? 0.7 : 1,
                                        transition: 'background-color 0.15s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>{profileForm.processing ? 'Saving...' : 'Save Profile Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Security & Password Update Card (Editable for Admin) */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '18px 24px',
                                backgroundColor: '#0c4a6e',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Change Administrator Password</span>
                        </div>

                        <form
                            onSubmit={handlePasswordSubmit}
                            style={{
                                padding: '28px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: '20px',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                    Current Password <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        backgroundColor: '#ffffff',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                    }}
                                    required
                                />
                                {passwordForm.errors.current_password && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.current_password}</div>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                    New Password (min. 6 characters) <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        backgroundColor: '#ffffff',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                    }}
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{passwordForm.errors.password}</div>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px', margin: '0 0 8px 0', padding: 0, textAlign: 'left', width: '100%' }}>
                                    Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Re-type new password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        color: '#1e293b',
                                        backgroundColor: '#ffffff',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        margin: 0,
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ paddingTop: '8px' }}>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: '#0c4a6e',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '11px 22px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: passwordForm.processing ? 'not-allowed' : 'pointer',
                                        opacity: passwordForm.processing ? 0.7 : 1,
                                        transition: 'background-color 0.15s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#075985')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0c4a6e')}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span>{passwordForm.processing ? 'Updating...' : 'Update Password'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
