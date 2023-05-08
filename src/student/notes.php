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

    $grades_r = $mysqli->execute_query("select student_id, subject_name, control_note, exam_note, coefficient, credit from grades join subjects on subjects.id = grades.subject_id where semester_id = (SELECT id FROM semesters WHERE CURRENT_DATE BETWEEN start_at AND end_at) and student_id = (select id from students where user_id = ?);", [$user_id]);
    if(!$grades_r){
        echo "SQL Error: ".$mysqli->error;
        exit();
    }
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
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
</head>
<body>
    <div class="container">
        <?php
            $aside_selected_link = "Notes";
            $aside_username = $student["first_name"]." ".$student["last_name"];
            include("../../includes/student/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Notes</div>
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
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                            <div class="list-header-item" >Control Note</div>
                            <div class="list-header-item">Exam Note</div>
                            <div class="list-header-item">Coefficient</div>
                            <div class="list-header-item">Creadit</div>
                            <div class="list-header-item">Subject Average</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($grades_r){
                                    while($row = $grades_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item" style="flex: 2;">'.$row["subject_name"].'</div>
                                                <div class="list-item">'.$row["control_note"].'</div>
                                                <div class="list-item">'.$row["exam_note"].'</div>
                                                <div class="list-item">'.$row["coefficient"].'</div>
                                                <div class="list-item">'.$row["credit"].'</div>
                                                <div class="list-item">18.00</div>
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
</body>
</html>