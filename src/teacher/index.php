<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();

    $query= 'SELECT COUNT(students.id) AS number_students FROM students left join schedules on students.group_id = schedules.group_id where schedules.teacher_id = (select teachers.id as id from teachers where teachers.user_id = ?);';
    $result = $mysqli->execute_query($query,[$user_id]);
    $row = $result->fetch_array();
   
    // echo var_dump($result);

    if(isset($_POST['send'])){
        header('Location:/logout.php');
    }

    if(isset($_POST['profile'])){
        header('Location: /teacher/profile.php');

    }


    if(isset($_POST['notebook'])){
        header('Location: /teacher/notebook.php');

    }

    if(isset($_POST['attendance'])){
        header('Location: /teacher/attendance.php');

    }

    $user_id = $_SESSION["user_id"];
    
    $query="SELECT * FROM teachers JOIN users ON teachers.user_id=users.id WHERE user_id=? ;";
    $result2 = $mysqli->execute_query($query,[$user_id]);
    $row2 = $result2->fetch_array();

   $lecture = $mysqli->execute_query("select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, level, speciality_name, class_index ,day_of_week from lectures join resources on lectures.class_room_id = resources.id join subjects on lectures.subject_id = subjects.id join teachers on lectures.teacher_id = teachers.id join users on users.id = teachers.user_id join acadimic_levels on `lectures`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where users.id=?;", [$_SESSION["user_id"]]);
    
    $schudeler_settings_r = $mysqli->query("select class_duration, first_class_start_at from scheduler_settings;");
    $schudeler_settings = $schudeler_settings_r->fetch_assoc();

    $first_class_start_at = intval(substr($schudeler_settings["first_class_start_at"],0,2));


    $schedule= $mysqli->execute_query(" select resources.resource_type as class_room, resources.resource_number as class_room_number, subject_name, first_name, last_name, group_number, level, speciality_name, day_of_week, class_index from schedules join resources on schedules.class_room_id = resources.id join subjects on schedules.subject_id = subjects.id join teachers on schedules.teacher_id = teachers.id join users on users.id = teachers.user_id join `groups` on schedules.group_id = `groups`.id join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where users.id=?;", [$_SESSION["user_id"]]);
    function parseTime($time){
        $hours = $time / 60;
        $minutes = $time % 60;
        return [$hours, $minutes];
    }

    function convertedTime($time){
        $timeWithSeconds =$time;
        $convert= date("H:i", strtotime($timeWithSeconds));
        return $convert;
    }
?>








<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Computer Science Departement</title>
    <link rel="stylesheet" href="../styles/teacher.css">

</head>
<body>

    <header>

        <div class="top-header">
            <div class="div-Logo">
                <img src="../assets/images/yahia-fares-logo.png" alt="" class="logo">
            </div>
            <form  class="Right-Top-header" method="post" >
                <button type="submit"  name="profile">Profile</button>
                <button type="submit" class="notebook" name="notebook">Students's Notebook</button>
                <p>|</p>
                <button class="logout" type="submit" name="send">Logout</button>
            </form>
        </div>

        <div class="center-header">
            <h1><?php 
                
                echo $row['number_students'].' students';
                
             ?></h1>
            <button type="submit" >PLATFORM</button>
        </div>
        
        <div class="bottom-header">
            <img src="../assets/images/Vector 12.png" alt="" class="vector">
        </div>

    </header>

    <main>

        <div class="about-me">
            <h1>About Me</h1>
            <div class="teatcher-info">
                <div><h2>ُEmail : </h2><h3><?php echo $row2['email'] ?></h3></div>
                <div> <h2>First Name : </h2><h3><?php echo $row2['first_name'] ?></h3></div>
                <div><h2>Last Name : </h2><h3><?php echo $row2['last_name'] ?></h3></div>
                <div><h2>Location : </h2><h3><?php echo $row2['location'] ?></h3></div>
                <div> <h2>Tel : </h2><h3><?php echo $row2['phone_number'] ?></h3></div>
                
               
                
                
               
            </div>
        </div>

        <div class="contain">

            <div class="exams" onmouseover="change1(true)" onmouseout="change1(false)" >
                <button type="submit" name="examPost" class="exams-button" id="btn1"> <b>Preparation of exam topics</b> </button>
                <p>Preparing exam topics is by uploading topics from pdf format on the exams platform</p>
            </div>
            <form method="POST" class="STD-attendance" onmouseover="change2(true)" onmouseout="change2(false)" > 
                <button type="submit" name="attendance" class="att-button" id="btn2"><b> Student attendance</b></button>
                <p>Registration of absences and monitoring of students according to the conditions of the university's internal system</p>
            </form>
            <div class="soon">
                <h2>Soon..</h2> 
            </div>

        </div>

        <div class="div-template">
        <button class="temp-btn">Schedule</button>
            <div class="template">
                    <div class="schedule_label">
                        <h2 class="schedule-item">Day</h2>
                        <h2 class="schedule-item">Subject</h2>
                        <h2 class="schedule-item">Room</h2>
                        <h2 class="schedule-item">Group</h2>
                        <h2 class="schedule-item">Start At</h2>
                        <h2 class="schedule-item">End At</h2>
                    </div>
                    <div class="schedule_value">
                        <?php 
                            if($schedule){
                                $days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                while($row = $schedule->fetch_assoc()){
                                    echo '<div class="list-row">
                                                <div class="list-item">'.$days[$row["day_of_week"]].'</div>
                                                <div class="list-item" ">'.$row["subject_name"].'</div>
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item" ">L'.$row["level"].' '.$row["speciality_name"].' G'.$row["group_number"].'</div>
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

                            if($lecture){
                                $days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
                                while($row = $lecture->fetch_assoc()){
                                    echo '<div class="list-row">
                                                <div class="list-item">'.$days[$row["day_of_week"]].'</div>
                                                <div class="list-item" ">'.$row["subject_name"].'</div>
                                                <div class="list-item">'.$row["class_room"].' '.$row["class_room_number"].'</div>
                                                <div class="list-item" ">L'.$row["level"].' '.$row["speciality_name"].'</div>
                                                <div class="list-item" ">'.convertedTime($row["class_index"]).'</div>

                                        </div>';
                                }
                        
                            }
                        ?>
                    </div>
            </div>
        </div>

    </main>

    <!-- <footer>

        <div class="left-footer-content">Soon..</div>
        <div class="center-footer-content"></div>
        <div class="right-footer-content"></div>

    </footer> -->

</body>
<script>
    function change1(event){

        if (event){
            let btn1=document.getElementById("btn1");
            btn1.classList.remove("exams-button")
            btn1.classList.add("exams-button-hover")
        }
        else{
            let btn1=document.getElementById("btn1");
            btn1.classList.remove("exams-button-hover")
            btn1.classList.add("exams-button")
        }
    }



    function change2(event){

        if (event){
            let btn2=document.getElementById("btn2");
            btn2.classList.remove("att-button")
            btn2.classList.add("att-button-hover")
        }
        else{
            let btn2=document.getElementById("btn2");
            btn2.classList.remove("att-button-hover")
            btn2.classList.add("att-button")
        }
    }

</script>
</html>