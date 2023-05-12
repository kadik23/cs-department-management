<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();

    $query= 'SELECT COUNT(id) AS number_students FROM students;';
    $result = $mysqli->execute_query($query,[]);
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

    $user_id = $_SESSION["user_id"];
    
    $query="SELECT * FROM teachers JOIN users ON teachers.user_id=users.id WHERE user_id=? ;";
    $result2 = $mysqli->execute_query($query,[$user_id]);
    $row2 = $result2->fetch_array();
   
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
                <div><h2>Location : </h2><h3><?php echo $row2['address'] ?></h3></div>
                <div> <h2>Tel : </h2><h3><?php echo $row2['Tel'] ?></h3></div>
                
               
                
                
               
            </div>
        </div>

        <div class="contain">

            <div class="exams" onmouseover="change1(true)" onmouseout="change1(false)" >
                <button type="submit" name="examPost" class="exams-button" id="btn1"> <b>Preparation of exam topics</b> </button>
                <p>Preparing exam topics is by uploading topics from pdf format on the exams platform</p>
            </div>
            <div class="STD-attendance" onmouseover="change2(true)" onmouseout="change2(false)" > 
                <button type="submit" class="att-button" id="btn2"><b> Student attendance</b></button>
                <p>Registration of absences and monitoring of students according to the conditions of the university's internal system</p>
            </div>
            <div class="soon">
                <h2>Soon..</h2> 
            </div>

        </div>

        <div class="div-template">
        <button class="temp-btn">Schedule</button>
            <div class="template">
                <img src="" alt="">
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