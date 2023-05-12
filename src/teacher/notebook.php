<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();
    $user_id = $_SESSION["user_id"];

    

    if(isset($_POST['logout'])){
        header('Location:/logout.php');
    }

    if(isset($_POST['home'])){
        header('Location: ./index.php');
    }

?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../styles/notebook.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
    
    <main>
        <div class="side-bar">
            
            <form class="container" method="post">
                <div class="logo">
                    <a href="./index.php"><img src="../assets/images/yahia-fares-logo.png" alt="" class="logoo"></a>
                </div>
                
                <div class="home-page">
                <button name="home" class="material-symbols-outlined">
                    <h2 >home</h2>
                </button>
                </div>

                <div class="logout">
                <button name="logout" class="material-symbols-outlined LO">
                <h2 >logout</h2>
                </button>
                </div>
            </form>

        </div>

        <section>

            <div class="top_section">
                <h2 class="top_section1">Students Notes</h2>
                <div class="top_section2">
                        <p>Operating System | Group 04</p>
                        <button type="submit" class="btn_edit" name="edit" id="edit">Edit</button>
                </div>
                
            </div>


            <div class="center_section">
                <div>
                    <input type="text"  id="inp" placeholder="Student name" class="inp_SN">
                    <button name="go" class="btn_go" type="submit" >Go</button>
                </div>
                <div>
                    <h3 style="width:fit-content;margin-right:10px; opacity:0.8;">Student Name: </h3>
                    <p style="width:fit-content; ">Kadik salah eddine</p>
                </div>
            </div>


            <div class="bottom_section">
                <div class="bottom_section1">
                     <p style="margin-right:10px">Exam Note:</p>
                    <input type="text"  id="inp1" class="inp_bottom">
                </div>
                <div class="bottom_section2">
                    <p>Control Note:</p>
                    <input type="text" id="inp1"  class="inp_bottom">
                </div>
                <div class="bottom_section3">
                    <button name="prev" type="submit" id="prev" class="prev">Prev</button>
                    <button name="next" type="submit" id="next" class="next">Next</button>
                </div>
            </div>

        </section>

    </main>
</body>
</html>