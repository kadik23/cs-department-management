<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $subjects_r = $mysqli->query("select id, subject_name from subjects;");
    $teachers_r = $mysqli->query("select teachers.id as id, first_name, last_name from users join teachers on users.id = teachers.user_id;");
    $acadimic_levels_r = $mysqli->query("select acadimic_levels.id as id, specialities.speciality_name as speciality_name, acadimic_levels.level as level from acadimic_levels join specialities on acadimic_levels.speciality_id = specialities.id;");
    $class_rooms_r = $mysqli->query("select * from resources where resource_type='Amphi';");
    $groups_r = $mysqli->query("select `groups`.id as id, group_number,level, speciality_name from `groups` join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
    $schudeler_settings_r = $mysqli->query("select class_duration, first_class_start_at from scheduler_settings;");

    $acadimic_levels = $acadimic_levels_r->fetch_all(MYSQLI_ASSOC);

    if(!$schudeler_settings_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $schudeler_settings = $schudeler_settings_r->fetch_assoc();
    
    function parseTime($time){
        $hours = $time / 60;
        $minutes = $time % 60;
        return [$hours, $minutes];
    }

    $first_class_start_at = intval(substr($schudeler_settings["first_class_start_at"],0,2));

    $subject_id = $_POST["subject_id"];
    $teacher_id = $_POST["teacher_id"];
    $acadimic_level_id = $_POST["acadimic_level_id"];
    $class_index = $_POST["class_index"];
    $class_room_id = $_POST["class_room_id"];
    $day_of_week = $_POST["day_of_week"];

    if(isset($subject_id) && isset($teacher_id) && isset($acadimic_level_id) && isset($class_index) && isset($class_room_id) && isset($day_of_week)){
        // Check If The Group is Empty At That Time.
        $is_empty_r = $mysqli->execute_query("select * from schedules, lectures where (group_id in (select groups.id as id from groups where groups.acadimic_level_id = ?) and schedules.class_index = ? and schedules.day_of_week = ?) or (lectures.acadimic_level_id = ? and lectures.class_index = ? and lectures.day_of_week = ?);", [$acadimic_level_id, $class_index, $day_of_week, $acadimic_level_id, $class_index, $day_of_week]);
        if($is_empty_r && $is_empty_r->num_rows > 0){
            $error_message = "The groups of this acadimic level already has another class at that time.";
            goto skip;
        }
        
        // Check If The Teacher is Empty at that time.
        $is_empty_r = $mysqli->execute_query("select * from schedules, lectures where (schedules.teacher_id = ? and schedules.class_index = ? and schedules.day_of_week = ?) or (lectures.teacher_id = ? and lectures.class_index = ? and lectures.day_of_week = ?);", [$teacher_id, $class_index, $day_of_week, $teacher_id, $class_index, $day_of_week]);
        if($is_empty_r && $is_empty_r->num_rows > 0){
            $error_message = "This group already has another class at that time.";
            goto skip;
        }

        // Check If The Class Room was reserved at that time.
        $is_reserved_r = $mysqli->execute_query("select * from schedules, lectures where (schedules.class_room_id = ? and schedules.class_index = ? and schedules.day_of_week = ?) or (lectures.class_room_id = ? and lectures.class_index = ? and lectures.day_of_week = ?);", [$class_room_id, $class_index, $day_of_week, $class_room_id, $class_index, $day_of_week]);
        if($is_reserved_r && $is_reserved_r->num_rows > 0){
            $error_message = "The class room is already reserved at that time.";
            goto skip;
        }

        // Adding new lecture.
        $lecture_r = $mysqli->execute_query("insert into lectures (subject_id, teacher_id, class_room_id, acadimic_level_id, day_of_week, class_index) select ?,?,?,?,?,? where not exists (select * from lectures where subject_id = ? and teacher_id = ? and class_room_id = ? and acadimic_level_id = ? and day_of_week = ? and class_index = ?);", [$subject_id, $teacher_id, $class_room_id,$acadimic_level_id, $day_of_week, $class_index, $subject_id, $teacher_id, $class_room_id,$acadimic_level_id, $day_of_week, $class_index]);
        if($mysqli->affected_rows > 0){
            $error_message = "Lecture Already Exist.";
        }else{
            $success_message = "Lecture Added Successfuly.";
        }
        
        // This label is used to skip the query in case there was a error_message.
        skip:
    }

    if(isset($_POST["filter_acadimic_level_id"])){
        $lectures_r = $mysqli->execute_query("select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, level, speciality_name, day_of_week, class_index from lectures join resources on lectures.class_room_id = resources.id join subjects on lectures.subject_id = subjects.id join teachers on lectures.teacher_id = teachers.id join users on users.id = teachers.user_id join acadimic_levels on lectures.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where lectures.acadimic_level_id = ?;",[$_POST["filter_acadimic_level_id"]]);
    }else{
        $lectures_r = $mysqli->query("select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, level, speciality_name, day_of_week, class_index from lectures join resources on lectures.class_room_id = resources.id join subjects on lectures.subject_id = subjects.id join teachers on lectures.teacher_id = teachers.id join users on users.id = teachers.user_id join acadimic_levels on lectures.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");
    }

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
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/forms.css">
    <link rel="stylesheet" href="/styles/dialogue.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Lectures";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Lectures</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label for="subject">Subject:</label>
                                <input type="text" class="selected_input" list="subjects-list" placeholder="subject" />
                                <input type="hidden" class="hidden_selected_input" list="subjects-list" id="subject_id" name="subject_id" placeholder="subject" />
                                <datalist id="subjects-list">
                                    <?php 
                                        if($subjects_r){
                                            while($row = $subjects_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">'.$row["subject_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="teacher">Teacher:</label>
                                <input type="text" class="selected_input" list="teachers-list" placeholder="teacher" />
                                <input type="hidden" class="hidden_selected_input" list="teachers-list" id="teacher_id" name="teacher_id" placeholder="teacher" />
                                <datalist id="teachers-list">
                                    <?php 
                                        if($teachers_r){
                                            while($row = $teachers_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">'.$row["first_name"].' '.$row["last_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="speciality">Acadimic Level:</label>
                                <input type="text" class="selected_input" list="speciality-list" placeholder="acadimic level" />
                                <input type="hidden" class="hidden_selected_input" list="speciality-list" id="acadimic_level_id" name="acadimic_level_id" placeholder="acadimic level" />
                                <datalist id="speciality-list">
                                    <?php 
                                        foreach($acadimic_levels as $row){
                                            echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].'</option>';
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="class_room_id">Class Room:</label>
                                <input type="text" class="selected_input" list="class-rooms-list" placeholder="class room" />
                                <input type="hidden" class="hidden_selected_input" list="class-rooms-list" id="class_room_id" name="class_room_id" placeholder="class room" />
                                <datalist id="class-rooms-list">
                                    <?php 
                                        if($class_rooms_r){
                                            while($row = $class_rooms_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">Amphi '.$row["resource_number"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
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

                            <div class="input-wrapper">
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

                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Add</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Add New Lecture</button>
                    </div>
                    <div class="list-control">
                        <form method="POST" class="input-group" style="margin-right: 10px;">
                            <input style="background-color: #ebebeb; padding: 10px 20px;" placeholder="Acadimic Level" type="text" class="selected_input" list="filter-acadimic_levels" value="<?php 
                                if(isset($_POST["filter_acadimic_level_id"])){
                                    $result = $mysqli->execute_query("select level, speciality_name from acadimic_levels join specialities on acadimic_levels.speciality_id = specialities.id where acadimic_levels.id = ?;", [$_POST['filter_acadimic_level_id']]);
                                    $r = $result->fetch_assoc();
                                    echo 'L'.$r["level"].' '.$r["speciality_name"];
                                }
                            ?>" />
                            <input type="hidden" class="hidden_selected_input" list="filter-acadimic_levels" id="filter_acadimic_level_id" name="filter_acadimic_level_id" value="<?= $_POST['filter_acadimic_level_id'] ?>" />
                            <datalist id="filter-acadimic_levels">
                                <?php 
                                    foreach($acadimic_levels as $row){
                                        echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].'</option>';
                                    }
                                ?>
                            </datalist>
                            <button style="margin-right: 10px; margin-left: 10px; background-color: #16a34a; border: none;" class="btn" type="submit">Filter</button>
                        </form>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Class Room</div>
                            <div class="list-header-item">Day</div>
                            <div class="list-header-item" style="flex: 3;">Acadimic Level</div>
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                            <div class="list-header-item" style="flex: 2;">Teacher</div>
                            <div class="list-header-item">Start At</div>
                            <div class="list-header-item">End At</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($lectures_r){
                                    $days_map = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                    while($row = $lectures_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                            <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                            <div class="list-item">'.$days_map[$row["day_of_week"]].'</div>
                                            <div class="list-item" style="flex: 3;">L'.$row["level"].' '.$row["speciality_name"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["subject_name"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["first_name"].' '.$row["last_name"].'</div>
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

    <?php include("../../includes/admin/alert_message.php")  ?>

    <script src="/assets/js/forms.js"></script>
    <script src="/assets/js/select.js"></script>
</body>
</html>