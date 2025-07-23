import React, { useState } from 'react';
import { router } from '@inertiajs/react';

function Schedules({ schedules, subjects, groups, teachers, search }) {
    const [showDialogue, setShowDialogue] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        day: '',
        start_time: '',
        end_time: '',
        subject_id: '',
        group_id: '',
        teacher_id: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/schedules', { search: formData.get('search') }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSchedule) {
            router.put(`/admin/schedules/${editingSchedule.id}`, formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setEditingSchedule(null);
                    setFormData({ day: '', start_time: '', end_time: '', subject_id: '', group_id: '', teacher_id: '' });
                }
            });
        } else {
            router.post('/admin/schedules', formData, {
                onSuccess: () => {
                    setShowDialogue(false);
                    setFormData({ day: '', start_time: '', end_time: '', subject_id: '', group_id: '', teacher_id: '' });
                }
            });
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            day: schedule.day,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            subject_id: schedule.subject_id,
            group_id: schedule.group_id,
            teacher_id: schedule.teacher_id
        });
        setShowDialogue(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            router.delete(`/admin/schedules/${id}`);
        }
    };

    const openAddDialogue = () => {
        setEditingSchedule(null);
        setFormData({ day: '', start_time: '', end_time: '', subject_id: '', group_id: '', teacher_id: '' });
        setShowDialogue(true);
    };

    return (
        <div className="container">
            <div className="page-content">
                <div className="page-header">
                    <div className="page-title">Schedules</div>
                    <div className="page-actions">
                        <button className="btn" onClick={openAddDialogue}>Add Schedule</button>
                    </div>
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
                        
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Time</th>
                                        <th>Subject</th>
                                        <th>Group</th>
                                        <th>Teacher</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td>{schedule.day}</td>
                                            <td>{schedule.start_time} - {schedule.end_time}</td>
                                            <td>{schedule.subject_name}</td>
                                            <td>{schedule.group_number}</td>
                                            <td>{schedule.teacher_name}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary" 
                                                    onClick={() => handleEdit(schedule)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    onClick={() => handleDelete(schedule.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showDialogue && (
                <div id="dialogue" className="dialogue">
                    <div className="dialogue-inner">
                        <div className="dialogue-header">
                            <div className="dialogue-title">{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</div>
                            <div className="dialogue-close-btn" onClick={() => setShowDialogue(false)}>Close</div>
                        </div>
                        <div className="dialogue-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="day">Day:</label>
                                        <select 
                                            id="day" 
                                            name="day" 
                                            value={formData.day}
                                            onChange={(e) => setFormData({...formData, day: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Day</option>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                            <option value="Sunday">Sunday</option>
                                        </select>
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="start_time">Start Time:</label>
                                        <input 
                                            type="time" 
                                            id="start_time" 
                                            name="start_time" 
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="end_time">End Time:</label>
                                        <input 
                                            type="time" 
                                            id="end_time" 
                                            name="end_time" 
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="subject_id">Subject:</label>
                                        <select 
                                            id="subject_id" 
                                            name="subject_id" 
                                            value={formData.subject_id}
                                            onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-wrapper">
                                        <label htmlFor="group_id">Group:</label>
                                        <select 
                                            id="group_id" 
                                            name="group_id" 
                                            value={formData.group_id}
                                            onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Group</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>
                                                    Group {group.group_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-wrapper">
                                        <label htmlFor="teacher_id">Teacher:</label>
                                        <select 
                                            id="teacher_id" 
                                            name="teacher_id" 
                                            value={formData.teacher_id}
                                            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <div className="cancel-btn dialogue-close-btn" onClick={() => setShowDialogue(false)}>Cancel</div>
                                    <button type="submit" className="btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedules; 