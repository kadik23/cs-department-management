import random

specialities = [
    "Artificial intelligence",
    "Data science",
    "Foundations"
    "Game development",
    "Programming languages",
    "Security",
    "Software engineering",
    "Systems"
]

# create specialities
spec = open("acadimic_levels.sql", "a")
for s in specialities:
    q = "insert into specialities (speciality_name) values ('"+s+"');"
    spec.write(q)
    spec.write("\n")
    for i in range(1,4):
        q = "insert into acadimic_levels (speciality_id, level) values ((select id from specialities where speciality_name = '"+s+"'), "+str(i)+");"
        spec.write(q)
        spec.write("\n")
    spec.write("\n")
spec.close()

# create groups
groups = open("groups.sql", "a")
j = 1
l = 0
for i in range(0, 24):
    if(i % 3 == 0):
        l = (l % 3) + 1
    q = "insert into groups (group_number, acadimic_level_id) values ("+str((i % 3) + 1)+", "+str(l)+");"
    groups.write(q)
    groups.write("\n")
groups.close()

# create studetns
students = open("students.sql", "a")
s_i = 0
l_i = 1
for i in range(0, 576):
    if(l_i == 4):
        l_i = 1
        s_i += 1
    if(i != 0 and i % 24 == 0):
        l_i += 1
    query = "insert into users (first_name, last_name, username, email, password) values ('student_"+str(i)+"_fn','student_"+str(i)+"_ln', 'student_"+str(i)+"', 'student_"+str(i)+"@univ-medea.dz','$2y$10$R63bXYMeWgG4/pzJQacOdeVZIthlYSA3P4CNcA1mc3k4f7Ui4ockS');"
    students.write(query)
    students.write("\n")
    query = "insert into students (user_id, acadimic_level_id, group_id) values ((select users.id as user_id from users where username = 'student_"+str(i)+"') , "+str((i//24) + 1)+", "+str((i//24) + 1)+");"
    students.write(query)
    students.write("\n")
    students.write("\n")
students.close()

# create teachers
teachers = open("teachers.sql", "a")
for i in range(1, 25):
    query = "insert into users (first_name, last_name, username, email, password) values ('teacher_"+str(i)+"_fn','teacher_"+str(i)+"_ln', 'teacher_"+str(i)+"', 'teacher_"+str(i)+"@univ-medea.dz','$2y$10$R63bXYMeWgG4/pzJQacOdeVZIthlYSA3P4CNcA1mc3k4f7Ui4ockS');"
    teachers.write(query)
    teachers.write("\n")
    query = "insert into teachers (user_id) values ((select users.id as user_id from users where username = 'teacher_"+str(i)+"'));"
    teachers.write(query)
    teachers.write("\n")
    teachers.write("\n")
teachers.close()

# create resources
# resources_types = ["Amphi", "Sale", "Labo"]
resources = open("resources.sql", "a")

for i in range(1, 7):
    query = "insert into resources (resource_type, resource_number) values ('Labo', "+str(i)+");"
    resources.write(query)
    resources.write("\n")
resources.write("\n")

for i in range(1, 7):
    query = "insert into resources (resource_type, resource_number) values ('Amphi', "+str(i)+");"
    resources.write(query)
    resources.write("\n")
resources.write("\n")

for i in range(1, 13):
    query = "insert into resources (resource_type, resource_number) values ('Sale', "+str(i)+");"
    resources.write(query)
    resources.write("\n")
resources.write("\n")

resources.close()


# create subjects
subjects_list = [
    "Programming Fundamentals",
    "Data Structures and Algorithms",
    "Software Design and Architecture",
    "Database Systems",
    "Web Development",
    "Software Testing and Quality Assurance",
    "Software Project Management",
    "Operating Systems",
    "Software Engineering Ethics and Professionalism",

    "Operating Systems",
    "Distributed Systems",
    "Computer Networks",
    "System Design and Analysis",
    "Cloud Computing",
    "System Security",
    "Virtualization and Containerization",
    "High-Performance Computing",
    "Fault Tolerant Systems",

    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning",
    "Data Mining and Analytics",
    "AI Ethics and Responsible AI",
    "Knowledge Representation and Reasoning",
    "Neural Networks",

    "Statistics and Probability",
    "Data Mining",
    "Machine Learning",
    "Data Visualization",
    "Big Data Analytics",
    "Data Wrangling and Cleaning",
    "Predictive Analytics",
    "Statistical Modeling",
    "Data Ethics and Privacy",

    "Introduction to Game Development",
    "Game Design Principles",
    "Computer Graphics",
    "Game Physics and Simulations",
    "Game Engine Architecture",
    "Game AI (Artificial Intelligence)",
    "Game Audio and Sound Design",
    "Game Testing and Quality Assurance",
    "Game Project Management",

    "Programming Language Concepts",
    "Object-Oriented Programming",
    "Functional Programming",
    "Compiler Design and Implementation",
    "Language Semantics and Formal Methods",
    "Domain-Specific Languages",
    "Parallel and Concurrent Programming",
    "Scripting Languages",
    "Programming Language Paradigms",

    "Introduction to Cybersecurity",
    "Network Security",
    "Cryptography",
    "Secure Software Development",
    "Information Security Management",
    "Incident Response and Forensics",
    "Ethical Hacking and Penetration Testing",
    "Web and Mobile Application Security",
    "Security Policies and Risk Management"
]

subjects = open("subjects.sql", "a")
for s in subjects_list:
    q = "insert into subjects (subject_name, coefficient, credit) values ('"+s+"', "+str(random.randint(1, 6))+", "+str(random.randint(5, 10))+");"
    subjects.write(q)
    subjects.write("\n")
subjects.close()


# Create schedules
speciality = 0
day_of_week = 0
class_index = 0
class_room_id = 1
subject_id = 1
group_id = 1
teacher_id = 1

current_class_index = 0
schedules = open("schedules.sql", "a")
for i in range(0, 9):
    q = "insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values ("+str(class_room_id)+", "+str(subject_id)+", "+str(teacher_id)+", "+str(group_id)+", "+str(day_of_week)+", "+str(class_index)+");"
    schedules.write(q)
    schedules.write("\n")
    group_id += 1
    class_index += 1
    q = "insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values ("+str(class_room_id)+", "+str(subject_id)+", "+str(teacher_id)+", "+str(group_id)+", "+str(day_of_week)+", "+str(class_index)+");"
    schedules.write(q)
    schedules.write("\n")
    group_id += 1
    class_index += 1
    q = "insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values ("+str(class_room_id)+", "+str(subject_id)+", "+str(teacher_id)+", "+str(group_id)+", "+str(day_of_week)+", "+str(class_index)+");"
    schedules.write(q)
    schedules.write("\n")
    group_id = 1
    subject_id += 1
    teacher_id += 1
    if(day_of_week != 0 and (day_of_week % 5 == 0)):
        current_class_index += 1
        class_index = current_class_index
        day_of_week = 0
    else:
        class_index = current_class_index
        day_of_week += 1
schedules.close()
# create table if not exists schedules (
#     id int primary key not null AUTO_INCREMENT,
#     class_room_id int references resources(id),
#     subject_id int references subjects(id),
#     teacher_id int references teachers(id),
#     group_id int references groups(id),
#     day_of_week TINYINT CHECK (day_of_week BETWEEN 0 AND 6), /* NOTE: mapping int to days of week. */
#     class_index int
# );