import React from 'react';

export default function Profile({ student, user, enrolledSubjects = [], group, academicLevel }) {
    const specialityName = academicLevel?.speciality?.name || group?.academic_level?.speciality?.name || 'Computer Science';
    const levelNumber = academicLevel?.level || group?.academic_level?.level || '3';
    const groupNumber = group?.group_number || student?.group_id;

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
                        Student Academic Profile
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                        Official department academic enrollment, cohort assignments, and student identification
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
                            <span>Department Managed Student Account (Read-Only)</span>
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
                            Student enrollment records, group allocations, and login credentials are fixed and controlled exclusively by the Computer Science Department Administration. Students cannot modify personal information or self-reset passwords. If you require credentials recovery or have incorrect data, please contact the Department Secretariat.
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
                    {/* 1. Student Identity (Read-Only) */}
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
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Student Identification</span>
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
                                    {user.first_name ? user.first_name[0] : 'S'}{user.last_name ? user.last_name[0] : 'T'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0c4a6e' }}>
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                        Undergraduate Student • Registration #{student.id}
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
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Enrollment Status</span>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                                        Officially Enrolled
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
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Department</span>
                                    <div style={{ fontSize: '14px', color: '#475569', marginTop: '3px' }}>
                                        Computer Science
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Enrolled Since</span>
                                    <div style={{ fontSize: '14px', color: '#475569', marginTop: '3px' }}>
                                        {user.created_at || 'Academic Year Start'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Academic Enrollment & Cohort Details */}
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
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Academic Cohort & Classes</span>
                        </div>

                        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Level & Speciality</span>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c4a6e', marginTop: '3px' }}>
                                        L{levelNumber} {specialityName}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Assigned TD / TP Group</span>
                                    <div style={{ marginTop: '3px' }}>
                                        {groupNumber ? (
                                            <span
                                                style={{
                                                    backgroundColor: '#e0f2fe',
                                                    color: '#0369a1',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    padding: '4px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #bae6fd',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                Group {groupNumber}
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Unassigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Enrolled Course Subjects</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                    {enrolledSubjects.length > 0 ? (
                                        enrolledSubjects.map((subj) => (
                                            <span
                                                key={subj.id}
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
                                                {subj.subject_name}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Standard curriculum modules</span>
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
                                }}
                            >
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Credential Assistance
                                </div>
                                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.45' }}>
                                    If you lose access or require a password reset, request your assigned teacher or visit the Department Administration office with your Student Card.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
