import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import "@css/students.css"

function Students({ students, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/students', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const openDialogue = async (student) => {
        setSelectedStudent(student);
        setShowDialogue(true);
        
        try {
            const response = await fetch(`/admin/students/groups?academic_level_id=${student.academic_level_id}`);
            const groupsData = await response.json();
            setGroups(groupsData);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const assignGroup = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('student_id', selectedStudent.id);
        formData.append('group_id', selectedGroupId);
        
        router.post('/admin/students/assign-group', formData, {
            onSuccess: () => {
                setShowDialogue(false);
                setSelectedStudent(null);
                setSelectedGroupId('');
            }
        });
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Students</div>
                </div>
                <div className="section-wrapper">
                    <div className="section-content">
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
                        
                        <div className="card-boxes-wrapper">
                            {students.map((student) => (
                                <div key={student.id} className="card-box-outer">
                                    <div className="card-box">
                                        <div className="student-profile">
                                            <div className="student-image">
                                                <img src="/assets/images/student.jpg" alt="profile_image" />
                                            </div>
                                            <div className="student-info">
                                                <div className="student-name">{student.first_name} {student.last_name}</div>
                                                {student.group_number ? (
                                                    <div className="student-group">Group {student.group_number}</div>
                                                ) : (
                                                    <div 
                                                        className="small-btn open-dialogue-btn" 
                                                        onClick={() => openDialogue(student)}
                                                        style={{ alignSelf: 'self-start', marginBottom: '4px' }}
                                                    >
                                                        Assign Group
                                                    </div>
                                                )}
                                                <div className="student-grade">{student.current_grade}</div>
                                                <div className="student-absence">{student.absence} Absence</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showDialogue && (
                <div id="dialogue" className="dialogue">
                    <div className="dialogue-inner">
                        <div className="dialogue-header">
                            <div className="dialogue-title">Student Group:</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <div className="row" style={{ minWidth: '800px' }}>
                                <div className="dialogue-student-profile">
                                    <img src="/assets/images/student.jpg" alt="profile_image" />
                                    <div className="student-name" style={{ width: 'fit-content', marginTop: '10px' }}>
                                        {selectedStudent?.first_name} {selectedStudent?.last_name}
                                    </div>
                                </div>
                                <div className="student-group-select">
                                    <form id="assign-group-form" name="assign-group-form" onSubmit={assignGroup}>
                                        <div className="input-wrapper">
                                            <label htmlFor="group_id">Groups:</label>
                                            <input
                                                type="text"
                                                className="selected_input"
                                                list="groups-list"
                                                placeholder="group"
                                                value={groups.find(g => g.id === selectedGroupId) ? `L${groups.find(g => g.id === selectedGroupId).level} ${groups.find(g => g.id === selectedGroupId).speciality_name} Group ${groups.find(g => g.id === selectedGroupId).group_number}` : ''}
                                                onChange={e => {
                                                    // Find the group by display value
                                                    const val = e.target.value;
                                                    const found = groups.find(g => `L${g.level} ${g.speciality_name} Group ${g.group_number}` === val);
                                                    setSelectedGroupId(found ? found.id : '');
                                                }}
                                                required
                                            />
                                            <input
                                                type="hidden"
                                                className="hidden_selected_input"
                                                list="groups-list"
                                                id="group_id"
                                                name="group_id"
                                                value={selectedGroupId}
                                                readOnly
                                            />
                                            <datalist id="groups-list">
                                                {groups.map((group) => (
                                                    <option key={group.id} value={`L${group.level} ${group.speciality_name} Group ${group.group_number}`}></option>
                                                ))}
                                            </datalist>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: 'calc(11/12*100%)' }}>
                                            <div className="cancel-btn dialogue-close-btn" onClick={() => setShowDialogue(false)}>Cancel</div>
                                            <button form="assign-group-form" className="btn" type="submit" style={{ marginLeft: '10px' }}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Students; 