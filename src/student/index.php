<?php 
    include("../../database/db_connection.php");
    include("../../includes/student/route_protection.php");
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
                        <div class="card-title">Section</div>
                        <div class="card-content">1</div>
                    </div>
                </div>

                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Group</div>
                        <div class="card-content">4</div>
                    </div>
                </div>
                
                <div class="card-box-wrapper">
                    <div class="card-box">
                        <div class="card-title">Study Year</div>
                        <div class="card-content">2 Year License</div>
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
                        <div class="info-content">student@univ-medea.dz</div>
                    </div>
                    <div class="info-wrapper">
                        <div class="info-icon">
                            <img src="/assets/icons/location.svg" alt="">
                        </div>
                        <div class="info-content">Medea, Algeria</div>
                    </div>
                </div>
            </div>
            <div class="section-wrapper">
                <div class="section-header">
                    <div class="section-title">My colleagues</div>
                </div>
                <div class="section-content">
                    <div class="friends">
                    <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                        <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                        <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                        <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                        <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                        <div class="friend">
                            <div class="friend-profile-pic">
                                <img src="/assets/images/student.jpg" alt="">
                            </div>
                            <div class="friend-name">Student name</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>