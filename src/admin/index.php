<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    // FIXME: This query depends on the database type and it can be too heavy for
    //        performance if we have too much users.
    //        We can add new table that has some dahsboard information and update
    //        it when needed. but for now we will ignore it.

    $qeury = "SELECT COUNT(*) as total_students FROM students;";
    $result = $mysqli->query($qeury);
    if($result){
        $row = $result->fetch_assoc();
        $total_students = $row['total_students'];
        $qeury = "SELECT COUNT(*) as total_teachers FROM teachers;";
        $result = $mysqli->query($qeury);
        if($result){
            $row = $result->fetch_assoc();
            $total_teachers = $row['total_teachers'];
            $qeury = "SELECT COUNT(*) as total_users FROM users;";
            $result = $mysqli->query($qeury);
            if($result){
                $row = $result->fetch_assoc();
                $total_users = $row['total_users'];
            }
        }
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
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Dashboard";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Dashboard</div>
            </div>
            <div class="row-wrapper">
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Total users</div>
                        <div class="card-content"><?= $total_users ?></div>
                    </div>
                </div>

                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Students</div>
                        <div class="card-content"><?= $total_students ?></div>
                    </div>
                </div>
                
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Teachers</div>
                        <div class="card-content"><?= $total_teachers ?></div>
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
                    <div class="section-title">Latest changes</div>
                </div>
                <div class="section-content">
                    
                </div>
            </div>
        </div>
    </div>
</body>
</html>