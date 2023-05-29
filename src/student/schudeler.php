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

    $scheduler_r = $mysqli->execute_query("select resource_type, resource_number, subject_name, first_name, last_name, day_of_week, class_index from `schedules` join subjects on schedules.subject_id = subjects.id join resources on class_room_id = resources.id join teachers on teacher_id = teachers.id join users on teachers.user_id = users.id where group_id = (select group_id from students where user_id = ?) order by day_of_week, class_index asc;", [$user_id]);
    if(!$scheduler_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $schudeler_settings_r = $mysqli->query("select class_duration, first_class_start_at from scheduler_settings;");
    $schudeler_settings = $schudeler_settings_r->fetch_assoc();
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
    <link rel="stylesheet" href="/styles/student.css">
    <link rel="stylesheet" href="/styles/aside.css">
    <link rel="stylesheet" href="/styles/table.css">
</head>
<body>
    <div class="container">
        <?php
            $aside_selected_link = "Schudeler";
            $aside_username = $student["first_name"]." ".$student["last_name"];
            include("../../includes/student/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Schudeler</div>
            </div>
       
            <div class="section-wrapper">
                <div class="section-content">
                
                <div class="table-head">
                    <div class="table-head-item">Days</div>
                    <?php 
                        $i = 0;
                        while($i < 5){
                            echo "<div class='table-head-item'>";
                            printf('%02d',parseTime($i * $schudeler_settings["class_duration"])[0] + $first_class_start_at);
                            echo ":";
                            printf('%02d',parseTime($i * $schudeler_settings["class_duration"])[1]);
                            
                            echo " to ";
                            
                            printf('%02d',parseTime(($i + 1) * $schudeler_settings["class_duration"])[0] + $first_class_start_at);
                            echo ":";
                            printf('%02d',parseTime(($i + 1) * $schudeler_settings["class_duration"])[1]);
                            
                            echo "</div>";
                            $i += 1;
                        }
                    ?>
                </div>
                <div class="table-body">
                    <?php 
                        $week_days = ["Saturday","Sunday","Monday","Thuesday","Wednesday","Thursday"];
                        $day = 0;
                        $i = 0;
                        while($row = $scheduler_r->fetch_assoc()){
                            repeat:
                            if($row["day_of_week"] == $day){
                                if($i == 0){
                                    echo '<div class="table-row">';
                                    echo '<div class="table-item">'.$week_days[$day].'</div>';
                                }
                                if($row["class_index"] == $i){
                                    echo '<div class="table-item">
                                            <div class="subject_name">
                                            '.$row["subject_name"].'<br/>
                                            </div>
                                            <div class="class_info">
                                                <div class="teacher_name">
                                                '.$row["first_name"].' '.$row["last_name"].'
                                                </div>
                                                <div class="class_room">
                                                '.$row["resource_type"].' '.$row["resource_number"].'
                                                </div>
                                            </div>    
                                        </div>';
                                    $i += 1;
                                }else{
                                    for($j = $i; $j < $row["class_index"]; $j++){
                                        echo '<div class="table-item">Empty</div>';
                                        $i += 1;
                                    }
                                    echo '<div class="table-item">
                                            <div class="subject_name">
                                            '.$row["subject_name"].'<br/>
                                            </div>
                                            <div class="class_info">
                                                <div class="teacher_name">
                                                '.$row["first_name"].' '.$row["last_name"].'
                                                </div>
                                                <div class="class_room">
                                                '.$row["resource_type"].' '.$row["resource_number"].'
                                                </div>
                                            </div>    
                                        </div>';
                                    $i += 1;
                                }    
                                
                                if($i == 5){
                                    echo '</div>';
                                    $day += 1;
                                    $i = 0;
                                }       
                            }else{
                                if($i != 0){
                                    for($j = $i; $j < 5; $j++){
                                        echo '<div class="table-item">Empty</div>';
                                    }
                                    echo '</div>';
                                    $day += 1;
                                    $i = 0;
                                    goto repeat; 
                                }else{
                                    for($j = $day; $j < $row["day_of_week"]; $j++){
                                        echo '<div class="table-row">';
                                        echo '<div class="table-item">'.$week_days[$j].'</div>';
                                        for($k = 0; $k < 5; $k++){
                                            echo '<div class="table-item">Empty</div>';
                                        }
                                        $day += 1;
                                        echo '</div>';
                                    }
                                    goto repeat;
                                }
                            }
                        }
                        if($i != 0){
                            for($j = $i; $j < 5; $j++){
                                echo '<div class="table-item">Empty</div>';
                            }
                            echo '</div>';
                            $day += 1;
                            $i = 0;
                        }
                        if($day < 6){
                            for($j = $day; $j < 6; $j++){
                                echo '<div class="table-row">';
                                echo '<div class="table-item">'.$week_days[$j].'</div>';
                                for($k = 0; $k < 5; $k++){
                                    echo '<div class="table-item">Empty</div>';
                                }
                                echo '</div>';
                            }
                        }
                    ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>