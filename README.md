# **Computer Science Department Management**

**Preview:** [https://cs-departement-management.000webhostapp.com](https://cs-departement-management.000webhostapp.com)

## **Web application to manage the computer science department:**
	
	- managing teachers.
	- managing students.
	- managing courses.
	- managing resources.


## **Notes:**

	Management: (create, edit, delete, search).


### Our users will be:
	
1. **The administration members:**

    - Accounts management. (Teachers and Students accounts).
    - Schedules management. (Teachers and Students will have a diffrent UI).
    - Plan courses.
    - Track student progress.
    - Manage resources such as classrooms, computer labs and equipment.
    - Manage Course registration, Exam results and student grades.		

2. **The teachers:**

    - Submit students attendance.
    - Submit students notes.
    - Upload course document for students.
    - View schudeler.

3. **The students:**

    - View notes.
    - View schudeler.


4. **Data:**
	- Admin
	- Teacher
	- Student
	- Schedules
	- Course
	- Student Progress
	- Resources
	- Exams
	- Grades
	- Documents

`This is not the acctual database`

```
Users:
	id, first_name, last_name, type

Schedules:
	id, teacher, module, start_time, end_time, group, year

Course:
	id, module

Resources:
	id, name, category

Exams:
	id, module, document

Grades:
	id, student, note, module

Document:
	id, path_or_name
```


## System Design:

Comming Soon.

## Authentication:

Comming Soon.
