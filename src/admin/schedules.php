<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $class_rooms_r = $mysqli->query("select * from resources where resource_type='Sale' or resource_type='Labo';");
    $groups_r = $mysqli->query("select groups.id as id, group_number,level, speciality_name from groups join acadimic_levels on groups.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
    $teachers_r = $mysqli->query("select teachers.id as id, first_name, last_name from users join teachers on teachers.user_id = users.id;");
    $subjects_r = $mysqli->query("select id, subject_name from subjects;");

    $class_room_id = $_POST["class_room_id"];
    $group_id = $_POST["group_id"];
    $teacher_id = $_POST["teacher_id"];
    $subject_id = $_POST["subject_id"];
    $start_at = $_POST["start_at"];
    $end_at = $_POST["end_at"];

    if(isset($class_room_id) && isset($group_id) && isset($teacher_id) && isset($subject_id) && isset($start_at) && isset($end_at)){
        $schedule_r = $mysqli->execute_query("insert into schedules (class_room_id, group_id, teacher_id, subject_id, start_at, end_at) values (?,?,?,?,?,?);", [$class_room_id, $group_id, $teacher_id, $subject_id, $start_at, $end_at]);
        // TODO: Handle schedule_r query result.
    }

    $schedules_r = $mysqli->query("select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, group_number, level, speciality_name, start_at, end_at from schedules join resources on schedules.class_room_id = resources.id join subjects on schedules.subject_id = subjects.id join teachers on schedules.teacher_id = teachers.id join users on users.id = teachers.user_id join groups on schedules.group_id = groups.id join acadimic_levels on groups.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Computer Science Departement</title>
    <link rel="stylesheet" href="/styles/admin.css">
    <link rel="stylesheet" href="/styles/aside.css">
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/dialogue.css">
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/forms.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Schedules";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Schedules</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <button id="open-dialogue-btn" class="btn">Add</button>
                    </div>
                    <div class="list-control">
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Room Number</div>
                            <div class="list-header-item" style="flex: 2;">Group</div>
                            <div class="list-header-item">From</div>
                            <div class="list-header-item">To</div>
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($schedules_r){
                                    while($row = $schedules_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item" style="flex: 2;">L'.$row["level"].' '.$row["speciality_name"].' G'.$row["group_number"].'</div>
                                                <div class="list-item">'.substr($row["start_at"], 0, -3).'</div>
                                                <div class="list-item">'.substr($row["end_at"], 0, -3).'</div>
                                                <div class="list-item" style="flex: 2;">'.$row["subject_name"].'</div>
                                             </div>';
                                    }   
                                }
                            ?>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="dialogue" class="dialogue">
        <div class="dialogue-inner">
            <div class="dialogue-header">
                <div class="dialogue-title">Add New Schedule</div>
                <div class="dialogue-close-btn" id="dialogue-close-btn">Close</div>
            </div>
            <div class="dialogue-body">
                <form method="POST" class="form">
                    <div class="input-group">
                        <label for="class_room_id">Class Room:</label>
                        <input list="class_rooms" id="class_room_id" name="class_room_id" />
                        <datalist id="class_rooms">
                            <?php 
                                if($class_rooms_r){
                                    while($row = $class_rooms_r->fetch_assoc()){
                                        echo '<option value="'.$row["id"].'">'.$row["resource_type"].' '.$row["resource_number"].'</option>';
                                    }
                                }
                            ?>
                        </datalist>
                    </div>
                    <div class="input-group">
                        <label for="group_id">Group:</label>
                        <input list="groups" id="group_id" name="group_id" />
                        <datalist id="groups">
                            <?php 
                                if($groups_r){
                                    while($row = $groups_r->fetch_assoc()){
                                        echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].' Group '.$row["group_number"].'</option>';
                                    }
                                }
                            ?>
                        </datalist>
                    </div>
                    <div class="input-group">
                        <label for="teacher_id">Teacher:</label>
                        <input list="teachers" id="teacher_id" name="teacher_id" />
                        <datalist id="teachers">
                            <?php 
                                if($teachers_r){
                                    while($row = $teachers_r->fetch_assoc()){
                                        echo '<option value="'.$row["id"].'">'.$row["first_name"].' '.$row["last_name"].'</option>';
                                    }
                                }
                            ?>
                        </datalist>
                    </div>
                    <div class="input-group">
                        <label for="subject_id">Subject:</label>
                        <input list="subjects" id="subject_id" name="subject_id" />
                        <datalist id="subjects">
                            <?php 
                                if($subjects_r){
                                    while($row = $subjects_r->fetch_assoc()){
                                        echo '<option value="'.$row["id"].'">'.$row["subject_name"].'</option>';
                                    }
                                }
                            ?>
                        </datalist>
                    </div>
                    <div class="input-group">
                        <label for="start_at">Start at:</label>
                        <input type="time" id="start_at" name="start_at" min="08:00" max="18:00" step="300" />
                    </div>
                    <div class="input-group">
                        <label for="end_at">End at:</label>
                        <input type="time" id="end_at" name="end_at" min="08:00" max="18:00" step="300" />
                    </div>
                    <button class="btn" type="submit">Add</button>
                </form>
            </div>
        </div>
    </div>
    <script src="/assets/js/dialogue.js"></script>
</body>
</html>