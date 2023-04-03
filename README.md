# **Computer Science Department Management**


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

We need something that can identifier our users without the need for login again each time they use the app.
so we will not use php sessions. we will use a diffrent approche like giving the user a token that expires
at some late time. and the token must be hard coded and strong enough to avoid Brute Forcing atacks.
we can avoid storing the token in our database by using some KeyPair encryption but since this is a simple project
we will not doing it, instead we will generate some random uuid and store it in the database.

