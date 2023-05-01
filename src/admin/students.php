<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $students_r = $mysqli->query('select first_name, last_name, group_number, count(attendance.id) as absence from users join students on users.id = students.user_id join groups on group_id = groups.id left join attendance on students.id = attendance.student_id and attendance.student_state = "absence";');
    
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
    <link rel="stylesheet" href="/styles/card-box.css">
    <link rel="stylesheet" href="/styles/students.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Students";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Students</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="list-control">
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-boxes-wrapper">
                        <?php
                            if($students_r){
                                while($row = $students_r->fetch_assoc()){
                                    echo '
                                        <div class="card-box-outer">
                                            <div class="card-box">
                                                <div class="student-profile">
                                                    <div class="student-image">
                                                        <img src="/assets/images/student.jpg" alt="profile_image" />
                                                    </div>
                                                    <div class="student-info">
                                                        <div class="student-name">'.$row["first_name"].' '.$row["last_name"].'</div>
                                                        <div class="student-group">Group '.$row["group_number"].'</div>
                                                        <div class="student-grade">'.($row["current_grade"] ? $row["current_grade"] : "Grade not yet").'</div>
                                                        <div class="student-absence">'.$row["absence"].' Absence</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ';
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