insert into resources (resource_type, resource_number) values ('Sale', 1);
insert into resources (resource_type, resource_number) values ('Sale', 2);
insert into resources (resource_type, resource_number) values ('Sale', 3);
insert into resources (resource_type, resource_number) values ('Sale', 4);
insert into resources (resource_type, resource_number) values ('Sale', 5);
insert into resources (resource_type, resource_number) values ('Sale', 6);

insert into subjects (subject_name, coefficient, credit) values ('Operating System 1', 3, 15);
insert into subjects (subject_name, coefficient, credit) values ('Operating System 2', 3, 15);
insert into subjects (subject_name, coefficient, credit) values ('Operating System 3', 3, 15);


insert into specialities (speciality_name) values ('Software Engineer');


insert into acadimic_levels (speciality_id, level) values (1,1);
insert into acadimic_levels (speciality_id, level) values (1,2);
insert into acadimic_levels (speciality_id, level) values (1,3);

insert into groups (group_number, acadimic_level_id) values (1,1);
insert into groups (group_number, acadimic_level_id) values (3,2);
insert into groups (group_number, acadimic_level_id) values (2,3);

insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values (1,1,1,1,0,0);
insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values (1,2,1,2,0,2);
insert into schedules (class_room_id, subject_id, teacher_id, group_id, day_of_week, class_index) values (1,3,1,3,1,2);