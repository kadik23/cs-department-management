<?php 
    include("../../database/db_connection.php");
    // include("../../includes/admin/route_protection.php");

    $querys_map = [
        "exams_schedules" => "select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, group_number, level, speciality_name, day_of_week, class_index from exams_schedules join resources on exams_schedules.class_room_id = resources.id join subjects on exams_schedules.subject_id = subjects.id join `groups` on exams_schedules.group_id = `groups`.id join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;"
    ];

    $filter_querys_map = [
        "exams_schedules" => "select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, group_number, level, speciality_name, day_of_week, class_index from exams_schedules join resources on exams_schedules.class_room_id = resources.id join subjects on exams_schedules.subject_id = subjects.id join `groups` on exams_schedules.group_id = `groups`.id join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where exams_schedules.group_id = ?;"
    ];

    $class_room_id = $_POST["class_room_id"];
    $group_id = $_POST["group_id"];
    $subject_id = $_POST["subject_id"];
    $day_of_week = $_POST["day_of_week"];
    $class_index = $_POST["class_index"];

    if(isset($class_room_id) && isset($group_id) && isset($subject_id) && isset($day_of_week) && isset($class_index)){
        // Check If The Group is Empty At That Time.
        $is_empty_r = $mysqli->execute_query("select * from exams_schedules where group_id = ? and class_index = ? and day_of_week = ?;", [$group_id, $class_index, $day_of_week]);
        if($is_empty_r && $is_empty_r->num_rows > 0){
            $error_message = "This group already has another class at that time.";
            goto skip;
        }

        // Check If The Class Room was reserved at that time.
        $is_reserved_r = $mysqli->execute_query("select * from exams_schedules where class_room_id = ? and class_index = ? and day_of_week = ?;", [$class_room_id, $class_index, $day_of_week]);
        if($is_reserved_r && $is_reserved_r->num_rows > 0){
            $error_message = "The class room is already reserved at that time.";
            goto skip;
        }

        // Create Schedule.
        $exam_schedule_r = $mysqli->execute_query("insert into exams_schedules (class_room_id, group_id, subject_id, day_of_week, class_index) select ?,?,?,?,? where not exists (select * from exams_schedules where class_room_id = ? and group_id = ? and subject_id = ? and day_of_week = ? and class_index = ?);", [$class_room_id, $group_id, $subject_id, $day_of_week, $class_index, $class_room_id, $group_id, $subject_id, $day_of_week, $class_index]);
        if($mysqli->affected_rows < 1){
            $error_message = "Schedule Already Exist.";
        }else{
            $success_message = "Schedule Added Successfuly.";
        }

        // This label is used to skip the query in case there was a error_message.
        skip:
    }

    if(isset($_POST["filter_group_id"])){
        $exams_schedules_r = $mysqli->execute_query($filter_querys_map["exams_schedules"] ,[$_POST["filter_group_id"]]);
    }else{
        $exams_schedules_r = $mysqli->query($querys_map["exams_schedules"]);
    }


    if(isset($_POST["first_exam_start_at"]) && isset($_POST["exam_duration"])){
        $update_exams_scheduler_settings_r = $mysqli->execute_query("update exams_scheduler_settings set exam_duration = ?, first_exam_start_at = ?;", [$_POST["exam_duration"], $_POST["first_exam_start_at"]]);
    }

    $exams_schudeler_settings_r = $mysqli->query("select exam_duration, first_exam_start_at from exams_scheduler_settings;");
    $class_rooms_r = $mysqli->query("select * from resources where resource_type='Sale' or resource_type='Labo';");
    $groups_r = $mysqli->query("select `groups`.id as id, group_number,level, speciality_name from `groups` join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
    $subjects_r = $mysqli->query("select id, subject_name from subjects;");

    $groups = $groups_r->fetch_all(MYSQLI_ASSOC);

    if(!$exams_schudeler_settings_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $exams_schudeler_settings = $exams_schudeler_settings_r->fetch_assoc();

    function parseTime($time){
        $hours = $time / 60;
        $minutes = $time % 60;
        return [$hours, $minutes];
    }

    $first_exam_start_at = [intval(substr($exams_schudeler_settings["first_exam_start_at"],0,2)),intval(substr($exams_schudeler_settings["first_exam_start_at"],3,5))];
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
            $aside_selected_link = "Exams Schedules";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Exams Schedules</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <form class="scheduler-settings-form" method="POST">
                        <div>
                            <label for="first_exam_start_at">First Exam Start At: </label>
                            <input type="time" name="first_exam_start_at" id="first_exam_start_at" disabled value="<?= $exams_schudeler_settings["first_exam_start_at"] ?>"/>
                        </div>
                        <div>
                            <label for="exam_duration">Exam Duration: </label>
                            <input type="number" name="exam_duration" id="exam_duration" disabled value="<?= $exams_schudeler_settings["exam_duration"] ?>" />
                        </div>
                        <div>
                            <button type="button" id="cancel-scheduler-settings-edit" class="cancel-btn" style="width: fit-content; margin-right: 10px; opacity: 0; transition: 0.5s;">cancel</button>
                            <button type="button" id="scheduler-settings-edit" class="btn" style="width: fit-content;">Edit</button>
                        </div>
                    </form>
                    <div class="row">
                        <button class="open-dialogue-btn btn">Add</button>
                    </div>
                    <div class="list-control" style="justify-content: space-between;">
                        <form method="POST" class="input-group" style="margin-right: 10px;">
                            <input style="background-color: #ebebeb; padding: 10px 20px;" placeholder="Group" type="text" class="selected_input" list="filter-groups" value="<?php 
                                if(isset($_POST["filter_group_id"])){
                                    $result = $mysqli->execute_query("select group_number, level, speciality_name from groups join acadimic_levels on groups.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where groups.id = ?;", [$_POST['filter_group_id']]);
                                    $r = $result->fetch_assoc();
                                    echo 'L'.$r["level"].' '.$r["speciality_name"].' Group '.$r["group_number"];
                                }
                            ?>" />
                            <input type="hidden" class="hidden_selected_input" list="filter-groups" id="filter_group_id" name="filter_group_id" value="<?= $_POST['filter_group_id'] ?>" />
                            <datalist id="filter-groups">
                                <?php 
                                    foreach($groups as $row){
                                        echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].' Group '.$row["group_number"].'</option>';
                                    }
                                ?>
                            </datalist>
                            <button style="margin-right: 10px; margin-left: 10px; background-color: #16a34a; border: none;" class="btn" type="submit">Filter</button>
                        </form>
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
                                if($exams_schedules_r){
                                    $days_map = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                    while($row = $exams_schedules_r->fetch_assoc()){
                                        $from_calc = parseTime($row["class_index"] * $exams_schudeler_settings["exam_duration"] + $first_exam_start_at[1]);
                                        $from_hours = $from_calc[0] + $first_exam_start_at[0];
                                        $from_minutes = $from_calc[1];

                                        $to_calc = parseTime(($row["class_index"] + 1) * $exams_schudeler_settings["exam_duration"] + $first_exam_start_at[1]);
                                        $to_hours = $to_calc[0] + $first_exam_start_at[0];
                                        $to_minutes = $to_calc[1];
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item">'.$days_map[$row["day_of_week"]].'</div>
                                                <div class="list-item" style="flex: 2;">L'.$row["level"].' '.$row["speciality_name"].' G'.$row["group_number"].'</div>
                                                <div class="list-item">';
                                                printf('%02d', $from_hours);
                                                echo ":";
                                                printf('%02d', $from_minutes);
                                                echo '</div>
                                                        <div class="list-item">';
                                                printf('%02d', $to_hours);
                                                echo ":";
                                                printf('%02d', $to_minutes);
                                        
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
                                foreach($groups as $row){
                                    echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].' Group '.$row["group_number"].'</option>';
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
                                $days = [0,1,2,3,4,5]; 
                                $days_map = [
                                    "0" => "Saturday",
                                    "1" => "Sunday",
                                    "2" => "Monday",
                                    "3" => "Tuesday",
                                    "4" => "Wednesday",
                                    "5" => "Thursday"
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
                                while(($i * $exams_schudeler_settings["exam_duration"]) < ((18-$first_exam_start_at[0])*60)){
                                    $calc = parseTime($i * $exams_schudeler_settings["exam_duration"] + $first_exam_start_at[1]);
                                    $hours = $calc[0] + $first_exam_start_at[0];
                                    $minutes = $calc[1];
                                    
                                    echo "<option value='".$i."'>";
                                    printf('%02d', $hours);
                                    echo ":";
                                    printf('%02d', $minutes);
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

    <?php include("../../includes/admin/alert_message.php")  ?>

    <script src="/assets/js/dialogue.js"></script>
    <script src="/assets/js/select.js"></script>
    <script>
        let exam_duration = document.getElementById("exam_duration");
        let first_exam_start_at = document.getElementById("first_exam_start_at");
        let edit_btn = document.getElementById("scheduler-settings-edit");
        let cancel_btn = document.getElementById("cancel-scheduler-settings-edit");
        
        edit_btn.addEventListener('click', (ev) => {
            if(edit_btn.innerText != "Save"){
                ev.preventDefault();
                edit_btn.type = "submit";
                edit_btn.innerText = "Save";
                exam_duration.disabled = false;
                first_exam_start_at.disabled = false;
                cancel_btn.style.opacity = 1;
            }
        });

        cancel_btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            edit_btn.type = "button";
            edit_btn.innerText = "Edit";
            exam_duration.disabled = true;
            first_exam_start_at.disabled = true;
            cancel_btn.style.opacity = 0;
        });
    </script>
</body>
</html>
