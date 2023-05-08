<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    if(isset($_POST["first_class_start_at"]) && isset($_POST["class_duration"])){
        $update_scheduler_settings_r = $mysqli->execute_query("update scheduler_settings set class_duration = ?, first_class_start_at = ?;", [$_POST["class_duration"], $_POST["first_class_start_at"]]);
    }

    $schudeler_settings_r = $mysqli->query("select class_duration, first_class_start_at from scheduler_settings;");
    $class_rooms_r = $mysqli->query("select * from resources where resource_type='Sale' or resource_type='Labo';");
    $groups_r = $mysqli->query("select `groups`.id as id, group_number,level, speciality_name from `groups` join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
    $teachers_r = $mysqli->query("select teachers.id as id, first_name, last_name from users join teachers on teachers.user_id = users.id;");
    $subjects_r = $mysqli->query("select id, subject_name from subjects;");

    if(!$schudeler_settings_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $schudeler_settings = $schudeler_settings_r->fetch_assoc();

    $class_room_id = $_POST["class_room_id"];
    $group_id = $_POST["group_id"];
    $teacher_id = $_POST["teacher_id"];
    $subject_id = $_POST["subject_id"];
    $day_of_week = $_POST["day_of_week"];
    $class_index = $_POST["class_index"];

    if(isset($class_room_id) && isset($group_id) && isset($teacher_id) && isset($subject_id) && isset($day_of_week) && isset($class_index)){
        $schedule_r = $mysqli->execute_query("insert into schedules (class_room_id, group_id, teacher_id, subject_id, day_of_week, class_index) values (?,?,?,?,?,?);", [$class_room_id, $group_id, $teacher_id, $subject_id, $day_of_week, $class_index]);
        // TODO: Handle schedule_r query result.
    }

    $schedules_r = $mysqli->query("select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, group_number, level, speciality_name, day_of_week, class_index from schedules join resources on schedules.class_room_id = resources.id join subjects on schedules.subject_id = subjects.id join teachers on schedules.teacher_id = teachers.id join users on users.id = teachers.user_id join `groups` on schedules.group_id = `groups`.id join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");



    function parseTime($time){
        $hours = $time / 60;
        $minutes = $time % 60;
        return [$hours, $minutes];
    }
    $first_class_start_at = intval(substr($schudeler_settings["first_class_start_at"],0,2));
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
    <style>
        .scheduler-settings-form {
            width: calc(1/3*100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            align-self: start;
            margin-bottom: 10px;
        }

        .scheduler-settings-form div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-bottom: 5px;
        }

        .scheduler-settings-form label {
            flex: 1;
            font-weight: 500;
        }
        
        .scheduler-settings-form input {
            flex: 1;
            border: none;
            background-color: #ebebeb;
            border-radius: 7px;
            margin-bottom: 5px;
            padding-left: 10px;
            padding-top: 5px;
            padding-bottom: 5px;
        }
    </style>
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
                    <form class="scheduler-settings-form" method="POST">
                        <div>
                            <label for="first_class_start_at">First Class Start At: </label>
                            <input type="time" name="first_class_start_at" id="first_class_start_at" disabled value="<?= $schudeler_settings["first_class_start_at"] ?>"/>
                        </div>
                        <div>
                            <label for="class_duration">Class Duration: </label>
                            <input type="number" name="class_duration" id="class_duration" disabled value="<?= $schudeler_settings["class_duration"] ?>" />
                        </div>
                        <div>
                            <button type="button" id="cancel-scheduler-settings-edit" class="cancel-btn" style="width: fit-content; margin-right: 10px; opacity: 0; transition: 0.5s;">cancel</button>
                            <button type="button" id="scheduler-settings-edit" class="btn" style="width: fit-content;">Edit</button>
                        </div>
                    </form>
                    <div class="row">
                        <button class="open-dialogue-btn btn">Add</button>
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
                            <div class="list-header-item">Day</div>
                            <div class="list-header-item" style="flex: 2;">Group</div>
                            <div class="list-header-item">Start At</div>
                            <div class="list-header-item">End At</div>
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($schedules_r){
                                    $days_map = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                    while($row = $schedules_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item">'.$days_map[$row["day_of_week"]].'</div>
                                                <div class="list-item" style="flex: 2;">L'.$row["level"].' '.$row["speciality_name"].' G'.$row["group_number"].'</div>
                                                <div class="list-item">';
                                        printf('%02d',parseTime($row["class_index"] * $schudeler_settings["class_duration"])[0] + $first_class_start_at);
                                        echo ":";
                                        printf('%02d',parseTime($row["class_index"] * $schudeler_settings["class_duration"])[1]);
                                        echo '</div>
                                                <div class="list-item">';
                                        printf('%02d',parseTime(($row["class_index"] + 1) * $schudeler_settings["class_duration"])[0] + $first_class_start_at);
                                        echo ":";
                                        printf('%02d',parseTime(($row["class_index"] + 1) * $schudeler_settings["class_duration"])[1]);
                                
                                        echo '</div>
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
                        <input type="text" class="selected_input" list="class_rooms" />
                        <input type="hidden" class="hidden_selected_input" list="class_rooms" id="class_room_id" name="class_room_id" />
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
                        <input type="text" class="selected_input" list="groups" />
                        <input type="hidden" class="hidden_selected_input" list="groups" id="group_id" name="group_id" />
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
                        <input type="text" class="selected_input" list="teachers" />
                        <input type="hidden" class="hidden_selected_input" list="teachers" id="teacher_id" name="teacher_id" />
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
                        <input type="text" class="selected_input" list="subjects" />
                        <input type="hidden" class="hidden_selected_input" list="subjects" id="subject_id" name="subject_id" />
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
                        <label for="day_of_week">Day:</label>
                        <input type="text" class="selected_input" list="days_of_week" />
                        <input type="hidden" class="hidden_selected_input" list="days_of_week" id="day_of_week" name="day_of_week" />
                        <datalist id="days_of_week">
                            <?php 
                                $days = [0,1,2,3,4,5,6]; 
                                $days_map = [
                                    "0" => "Sunday",
                                    "1" => "Monday",
                                    "2" => "Tuesday",
                                    "3" => "Wednesday",
                                    "4" => "Thursday",
                                    "5" => "Friday",
                                    "6" => "Saturday"
                                ];
                                foreach($days as $day){
                                    echo '<option value="'.$day.'">'.$days_map[$day].'</option>';
                                }
                            ?>
                        </datalist>
                    </div>

                    <div class="input-group">
                        <label for="class_index">Start At:</label>
                        <input type="text" class="selected_input" list="class_indexes" />
                        <input type="hidden" class="hidden_selected_input" list="class_indexes" id="class_index" name="class_index" />
                        <datalist id="class_indexes">
                            <?php 
                                $i = 0;
                                while(($i * $schudeler_settings["class_duration"]) < ((18-$first_class_start_at)*60)){
                                    echo "<option value='".$i."'>";
                                    printf('%02d',parseTime($i * $schudeler_settings["class_duration"])[0] + $first_class_start_at);
                                    echo ":";
                                    printf('%02d',parseTime($i * $schudeler_settings["class_duration"])[1]);
                                    echo "</option>";
                                    $i += 1;
                                }
                            ?>
                        </datalist>
                    </div>
                    <button class="btn" type="submit">Add</button>
                </form>
            </div>
        </div>
    </div>
    <script src="/assets/js/dialogue.js"></script>
    <script src="/assets/js/select.js"></script>
    <script>
        let class_duration = document.getElementById("class_duration");
        let first_class_start_at = document.getElementById("first_class_start_at");
        let edit_btn = document.getElementById("scheduler-settings-edit");
        let cancel_btn = document.getElementById("cancel-scheduler-settings-edit");
        
        edit_btn.addEventListener('click', (ev) => {
            if(edit_btn.innerText != "Save"){
                ev.preventDefault();
                edit_btn.type = "submit";
                edit_btn.innerText = "Save";
                class_duration.disabled = false;
                first_class_start_at.disabled = false;
                cancel_btn.style.opacity = 1;
            }
        });

        cancel_btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            edit_btn.type = "button";
            edit_btn.innerText = "Edit";
            class_duration.disabled = true;
            first_class_start_at.disabled = true;
            cancel_btn.style.opacity = 0;
        });
    </script>
</body>
</html>