create database if not exists `cs-departement-management`;

use `cs-departement-management`;

create table if not exists users (
    id int primary key not null AUTO_INCREMENT,
    first_name varchar(255),
    last_name varchar(255),
    username varchar(255),
    email varchar(255),
    phone_number varchar(255),
    location varchar(255),
    password varchar(255)
);


create table if not exists specialities (
    id int primary key not null AUTO_INCREMENT,
    speciality_name varchar(255)
);

create table if not exists acadimic_levels (
    id int primary key not null AUTO_INCREMENT,
    speciality_id int references specialities(id),
    level int not null
);

create table if not exists groups (
    id int primary key not null AUTO_INCREMENT,
    group_number int not null,
    responsible int references users(id),
    acadimic_level_id int references acadimic_levels(id)
);

create table if not exists students (
    id int primary key not null AUTO_INCREMENT,
    user_id int references users(id),
    acadimic_level_id int references acadimic_levels(id),
    group_id int references groups(id)
);

create table if not exists teachers (
    id int primary key not null AUTO_INCREMENT,
    user_id int references users(id)
);

create table if not exists subjects (
    id int primary key not null AUTO_INCREMENT,
    subject_name varchar(255) not null,
    coefficient int not null,
    credit int not null
);

create table if not exists resources (
    id int primary key not null AUTO_INCREMENT,
    resource_type varchar(255) not null, /* { room, lab, lecture_hall, computer } */
	resource_number int not null
);

create table if not exists schedules (
    id int primary key not null AUTO_INCREMENT,
    class_room_id int references resources(id),
    subject_id int references subjects(id),
    teacher_id int references teachers(id),
    group_id int references groups(id),
    day_of_week TINYINT CHECK (day_of_week BETWEEN 0 AND 6), /* NOTE: mapping int to days of week. */
    class_index int
);

-- Using a SQL database for a single row of application settings may seem like overkill --
create table if not exists scheduler_settings (
    id int primary key not null AUTO_INCREMENT,
    class_duration int, -- In Minutes --
    first_class_start_at time
);
/* Insert default values for scheduler_settings. */
insert into scheduler_settings (class_duration, first_class_start_at) values (60, '08:00');


create table if not exists administraters (
    id int primary key not null AUTO_INCREMENT,
    user_id int references users(id)
);

create table if not exists semesters (
    id int primary key not null AUTO_INCREMENT,
    semester_name varchar(255),
    start_at date,
    end_at date
);

create table if not exists grades (
    id int primary key not null AUTO_INCREMENT,
    student_id int references students(id),
    semester_id int references semesters(id),
    subject_id int references subjects(id),
    control_note float,
    exam_note float
);

create table if not exists attendance (
    id int primary key not null AUTO_INCREMENT,
    student_id int references students(id),
    subject_id int references subjects(id),
    student_state varchar(255),
    date date
);

create table if not exists lectures (
    id int primary key not null AUTO_INCREMENT,
    class_room_id int references resources(id),
    subject_id int references subjects(id),
    teacher_id int references teachers(id),
    acadimic_level_id int references acadimic_levels(id),
    day_of_week TINYINT CHECK (day_of_week BETWEEN 0 AND 6), /* NOTE: mapping int to days of week. */
    class_index int
);

create table if not exists exams_schedules (
    id int primary key not null AUTO_INCREMENT,
    class_room_id int references resources(id),
    subject_id int references subjects(id),
    group_id int references groups(id),
    day_of_week TINYINT CHECK (day_of_week BETWEEN 0 AND 6), /* NOTE: mapping int to days of week. */
    class_index int
);

-- Using a SQL database for a single row of application settings may seem like overkill --
create table if not exists exams_scheduler_settings (
    id int primary key not null AUTO_INCREMENT,
    exam_duration int, -- In Minutes --
    first_exam_start_at time
);
/* Insert default values for scheduler_settings. */
insert into exams_scheduler_settings (exam_duration, first_exam_start_at) values (90, '08:30');


-- NOTE: In the futur we will have a install.php file to initiate the admin users. --
insert into users (first_name, last_name, username, email, password) values ('admin','admin', 'admin', 'admin@univ-medea.dz','$2y$10$R63bXYMeWgG4/pzJQacOdeVZIthlYSA3P4CNcA1mc3k4f7Ui4ockS');
insert into administraters (user_id) values (1);