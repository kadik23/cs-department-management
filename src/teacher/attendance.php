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

    $student=$mysqli->query("SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name FROM users JOIN students ON users.id = students.user_id ;");

 

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
                <h2 class="top_section1">Students Attendance</h2>
                <form method="post"  style="height : 100px; display:flex; flex-direction:column; justify-content:space-around;">

                    <div class="top_section1_1">
                        <input type="text" id="edit_day" value="2023-01-01" name="date" disabled>
                        <input type="text" id="edit_hour" value="08:00" name="time" disabled>
                        <input type="text" id="edit_hour_type" value="AM" disabled>
                    </div> 

                    <div class="top_section1_2">
                        <input type="text" id="edit_Subject" value="Operating System " name="subject" disabled>
                        <p style="width: max-content; background-color: #e7e7e7; display:flex; align-items:center; color:#545454;font-weight: bold;" >| Group </p>
                        <input type="text" id="edit_Group" value=" 02" name="group" disabled>
                    </div>
                    <div  id="appen" >
                        <button type="submit" class="btn_edit" name="edit" id="edit">Edit</button>
                        </div>
                    </div>
                </form>
                
            </div>


            <div class="slider2" id="slider2">
             
                <?php 
                   if(isset($_POST["save"])){
                    $data=$mysqli->execute_query("select CONCAT(users.first_name, ' ', users.last_name) AS full_name ,groups.group_number  FROM users JOIN students ON users.id = students.user_id JOIN groups ON groups.id=students.group_id JOIN attendance on students.id=attendance.student_id JOIN subjects ON subjects.id = attendance.subject_id WHERE (subjects.subject_name=?) AND (attendance.time=?) AND (attendance.date=?) AND (groups.group_number=?);",[$_POST["subject"],$_POST["time"],$_POST["date"],$_POST["group"]]);
                    foreach ($data as $student_r) {
            
                echo '   <div class="infos">
                <form method="POST" class="section_milieu_form">
                    <div style="margin-right: 25px;">
                        <h3 style="width:fit-content;margin-right:10px; opacity:0.8; margin-left:100px;">Student Name: </h3>
                        <p style="width:fit-content; font-size:1.1rem; margin-top:2px; border:none; background-color:transparent;" >'.$student_r["full_name"].'</p>
                    </div>
                  
                    <div>
                        <h3 style="width:fit-content;margin-right:10px; opacity:0.8;"> Group: </h3>
                        <p style="width:fit-content; margin-top:2px; ">'.$student_r["group_number"].'
                        </p>
                    </div>
                </form>
                <form method="POST" >
                     <h1 style="margin-bottom: 10px;">Does he/she attend:</h1>
                     <button name="yes" type="submit" id="yes" class="yes">Yes</button>
                     <button name="no" type="submit" id="no" class="no">No</button>
                </form></div>';
            }}else{
                echo '
                <div class="infos">
                <form method="POST" class="section_milieu_form">
                    <div style="margin-right: 25px;">
                        <h3 style="width:fit-content;margin-right:10px; opacity:0.8; margin-left:100px;">Student Name: </h3>
                        <p style="width:fit-content; font-size:1.1rem; margin-top:2px; border:none; background-color:transparent;" ></p>
                    </div>
                  
                    <div>
                        <h3 style="width:fit-content;margin-right:10px; opacity:0.8;"> Group: </h3>
                        <p style="width:fit-content; margin-top:2px; ">
                        </p>
                    </div>
                </form>
                <form method="POST" >
                     <h1 style="margin-bottom: 10px;">Does he/she attend:</h1>
                     <button name="yes" type="submit" id="yes" class="yes">Yes</button>
                     <button name="no" type="submit" id="no" class="no">No</button>
                </form></div>';
            }
                ?>
            </div>


            <div class="bottom_section">
              
              <div class="bottom_section3">
                  <button name="prev" type="submit" id="prev" class="prev">Prev</button>
                  <button name="next" type="submit" id="next" class="next">Next</button>
              </div>
          </div>
        </section>

    </main>

</body>
<script>
    // if click edit 
    var editS=document.getElementById("edit_Subject")
    var editG=document.getElementById("edit_Group")
    valueSubject=editS.value
    valueGroup=editG.value
    var edit=document.getElementById("edit")
    var editD=document.getElementById("edit_day")
    var editH=document.getElementById("edit_hour")
    var editTH=document.getElementById("edit_hour_type")
    valueDay=editD.value
    valueHour=editH.value
    valueTH=editTH.value

    edit.addEventListener("click",(event)=>{
        if(edit.textContent=="Edit"){
            event.preventDefault();
            edit.textContent="Save"
            edit.name="save";
            
            const element=document.createElement("button")
                element.setAttribute("id","cancel")
                element.setAttribute("class","btn_cancel2")
                element.textContent="Cancel"

                var appen=document.getElementById("appen")
                appen.appendChild(element)

                editG.disabled=false
                editS.disabled=false
                editH.disabled=false
                editD.disabled=false
                editTH.disabled=false

        }


         // if click on cancel
        var cancel=document.getElementById("cancel");
        cancel.addEventListener("click",()=>{
   
            edit.textContent="Edit"
         
            const elementToRemove = document.querySelector('#cancel');
            elementToRemove.remove();

            editD.disabled=true
            editH.disabled=true
            editTH.disabled=true
            editG.disabled=true
            editS.disabled=true
            editD.value =valueDay
            editH.value =valueHour
            editTH.value =valueTH
            editS.value =valueSubject
            editG.value =valueGroup
        })
    })

    // scroll animation
            let next = document.getElementById('next');
            let prev = document.getElementById('prev');
            let slider = document.getElementById('slider2');

            next.addEventListener('click', (event) => {
                event.preventDefault();
                if(slider.scrollLeft % slider.clientWidth <= 5){
                    slider.scrollTo({ behavior: 'smooth', left: slider.scrollLeft + slider.clientWidth });
                }

            });

            prev.addEventListener('click', (event) => {
                event.preventDefault();

                if(slider.scrollLeft % slider.clientWidth <= 5){
                    slider.scrollTo({ behavior: 'smooth', left: slider.scrollLeft - slider.clientWidth });
                }
            });
</script>
</html>