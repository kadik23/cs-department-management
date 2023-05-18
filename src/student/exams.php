<?php 
    include("../../database/db_connection.php");
    include("../../includes/student/route_protection.php");

    $user_id = $_SESSION["user_id"];
    $student_r = $mysqli->execute_query("select first_name, last_name, email, group_number, level, speciality_name from students join users on students.user_id = users.id join `groups` on students.group_id = `groups`.id join acadimic_levels on students.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where students.user_id = ?;", [ $user_id]);
    if(!$student_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }
    $student = $student_r->fetch_assoc();

    $exams_scheduler_r = $mysqli->execute_query("select resource_type as class_room, resource_number as class_room_number, subject_name, date, class_index from `exams_schedules` join subjects on exams_schedules.subject_id = subjects.id join resources on class_room_id = resources.id where group_id = (select group_id from students where user_id = ?) order by date, class_index asc;", [$user_id]);
    if(!$exams_scheduler_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $exams_schudeler_settings_r = $mysqli->query("select exam_duration, first_exam_start_at from exams_scheduler_settings;");
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
    <link rel="stylesheet" href="/styles/student.css">
    <link rel="stylesheet" href="/styles/aside.css">
    <link rel="stylesheet" href="/styles/table.css">
    <link rel="stylesheet" href="/styles/list.css">
</head>
<body>
    <div class="container">
        <?php
            $aside_selected_link = "Exams Schedules";
            $aside_username = $student["first_name"]." ".$student["last_name"];
            include("../../includes/student/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Exams Schudeler</div>
            </div>
       
            <div class="section-wrapper">
            <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Room Number</div>
                            <div class="list-header-item">Day</div>
                            <div class="list-header-item">Start At</div>
                            <div class="list-header-item">End At</div>
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($exams_scheduler_r){
                                    $days_map = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                    while($row = $exams_scheduler_r->fetch_assoc()){
                                        $from_calc = parseTime($row["class_index"] * $exams_schudeler_settings["exam_duration"] + $first_exam_start_at[1]);
                                        $from_hours = $from_calc[0] + $first_exam_start_at[0];
                                        $from_minutes = $from_calc[1];

                                        $to_calc = parseTime(($row["class_index"] + 1) * $exams_schudeler_settings["exam_duration"] + $first_exam_start_at[1]);
                                        $to_hours = $to_calc[0] + $first_exam_start_at[0];
                                        $to_minutes = $to_calc[1];
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item">'.$row["date"].'</div>
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
</body>
</html>