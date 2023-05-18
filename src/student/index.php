<?php 
    include("../../database/db_connection.php");
    include("../../includes/student/route_protection.php");

    $user_id = $_SESSION["user_id"];

    $colleagues_r = $mysqli->execute_query("select first_name, last_name from users join students on users.id = students.user_id where students.group_id = (select group_id from students where user_id = ?) and users.id != ?;", [$user_id, $user_id]);
    if(!$colleagues_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }   

    $student_r = $mysqli->execute_query("select first_name, last_name, email, group_number, level, speciality_name from students join users on students.user_id = users.id left join `groups` on students.group_id = `groups`.id left join acadimic_levels on students.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where students.user_id = ?;", [ $user_id]);
    if(!$student_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }

    $student = $student_r->fetch_assoc();
    $aside_username = $student["first_name"]." ".$student["last_name"];
    $semestrer_r = $mysqli->query("SELECT * FROM semesters WHERE CURRENT_DATE BETWEEN start_at AND end_at;");
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
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Dashboard";
            include("../../includes/student/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Home</div>
            </div>
            <div class="row-wrapper">
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Semestre</div>
                        <div class="card-content"><?php 
                            if($semestrer_r){
                                $s = $semestrer_r->fetch_assoc();
                                echo $s["semester_name"];
                            }else{
                                echo "Semester not started yet.";
                            }
                        ?></div>
                    </div>
                </div>
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Group</div>
                        <div class="card-content"><?= $student["group_number"] ?></div>
                    </div>
                </div>
                
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Study Year</div>
                        <div class="card-content"><?= ($student["level"] > 3 ? $student["level"] % 3 : $student["level"])." Year ".($student["level"] > 3 ? "Master " : "License ").$student["speciality_name"] ?></div>
                    </div>
                </div>
                
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">College Year</div>
                        <div class="card-content">2022/2023</div>
                    </div>
                </div>
            </div>
            <div class="section-wrapper">
                <div class="section-header">
                    <div class="section-title">About me</div>
                </div>
                <div class="section-content">
                    <div class="info-wrapper">
                        <div class="info-icon">
                            <img src="/assets/icons/email.svg" alt="">
                        </div>
                        <div class="info-content"><?= $student["email"] ?></div>
                    </div>
                    <div class="info-wrapper">
                        <div class="info-icon">
                            <img src="/assets/icons/location.svg" alt="">
                        </div>
                        <div class="info-content">Medea, Algeria</div>
                    </div>
                </div>
            </div>
            <div class="section-wrapper" style="overflow: auto;">
                <div class="section-header">
                    <div class="section-title">My colleagues</div>
                </div>
                <div class="section-content" style="overflow: auto;">
                    <div class="friends" style="overflow: auto; margin-bottom: 40px;">
                        <?php 
                            while($row = $colleagues_r->fetch_assoc()){
                                echo '
                                    <div class="friend">
                                        <div class="friend-profile-pic">
                                            <img src="/assets/images/student.jpg" alt="profile_image">
                                        </div>
                                        <div class="friend-name">'.$row["first_name"].' '.$row["last_name"].'</div>
                                    </div>
                                ';
                            }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>