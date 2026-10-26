import React from 'react';

export default function Profile({ teacher, user, subjects = [], groups = [], weeklyClassesCount = 0 }) {
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
                {/* Page Header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: '#0c4a6e', letterSpacing: '-0.3px' }}>
                        Faculty Profile
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                        Department academic registration, faculty identity, and teaching assignments
                    </div>
                </div>

                {/* Department Lock Security Banner */}
                <div
                    style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        marginBottom: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderLeft: '5px solid #0c4a6e',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: '#e0f2fe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c4a6e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c4a6e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Department Managed Account (Read-Only)</span>
                            <span
                                style={{
                                    backgroundColor: '#e2e8f0',
                                    color: '#475569',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #cbd5e1',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Locked
                            </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: '1.45' }}>
                            Profile details, institutional email, and credentials are administered exclusively by the Computer Science Department Administration. Faculty members cannot modify profile data or reset passwords directly. For updates or credential re-issuance, please contact the department administrator.
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
                    {/* 1. Identity & Contact Details (Read-Only) */}
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
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Faculty Information</span>
                        </div>

                        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9' }}>
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e0f2fe',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '19px',
                                        color: '#0284c7',
                                        flexShrink: 0,
                                    }}
                                >
                                    {user.first_name ? user.first_name[0] : 'P'}{user.last_name ? user.last_name[0] : 'R'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0c4a6e' }}>
                                        Pr. {user.first_name} {user.last_name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                        {user.role} • Computer Science Department
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Username</span>
                                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginTop: '3px' }}>
                                        {user.username}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Account Status</span>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                                        Active Faculty
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Institutional Email</span>
                                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginTop: '3px' }}>
                                    {user.email}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Office / Location</span>
                                    <div style={{ fontSize: '14px', color: '#475569', marginTop: '3px' }}>
                                        {user.location || 'CS Faculty Building'}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Member Since</span>
                                    <div style={{ fontSize: '14px', color: '#475569', marginTop: '3px' }}>
                                        {user.created_at || 'Department Establishment'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Teaching Assignments & Academic Overview */}
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
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
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Teaching Assignments</span>
                        </div>

                        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Assigned Subjects</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                    {subjects.length > 0 ? (
                                        subjects.map((s) => (
                                            <span
                                                key={s.id}
                                                style={{
                                                    backgroundColor: '#e0f2fe',
                                                    color: '#0369a1',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    padding: '5px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #bae6fd',
                                                }}
                                            >
                                                {s.subject_name}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>No specific subjects assigned yet</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Assigned Student Groups</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                    {groups.length > 0 ? (
                                        groups.map((g) => (
                                            <span
                                                key={g.id}
                                                style={{
                                                    backgroundColor: '#f1f5f9',
                                                    color: '#334155',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    padding: '5px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                }}
                                            >
                                                Group {g.group_number} {g.academic_level?.speciality?.name ? `(${g.academic_level.speciality.name})` : ''}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Cohort-wide lectures</span>
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop: 'auto',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '10px',
                                    padding: '16px 18px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Scheduled Weekly Sessions</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0c4a6e', marginTop: '2px' }}>
                                        {weeklyClassesCount} Class Sessions
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#0284c7',
                                        backgroundColor: '#e0f2fe',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                    }}
                                >
                                    S1 Timetable
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
