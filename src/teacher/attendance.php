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
                <h2 class="top_section1">Students Attendance</h2>
                <form method="post" class="top_section2_1" id="appen1">
                        <input type="text" id="edit_day" value="01-01-2023" disabled>
                        <input type="text" id="edit_hour" value="08:00" disabled>
                        <input type="text" id="edit_hour_type" value="AM" disabled>
                        <button type="submit" class="btn_edit" name="edit1" id="edit1">Edit</button>
                </form>
                <form method="post" class="top_section2_2" id="appen2">
                        <input type="text" id="edit_Subject" value="Operating System " disabled>
                        <p style="width: max-content; background-color: #e7e7e7; display:flex; align-items:center; color:#545454;font-weight: bold;" >| Group </p>
                        <input type="text" id="edit_Group" value=" 02" name="group" disabled>
                        <button type="submit" class="btn_edit" name="edit2" id="edit2">Edit</button>
                </form>
                
            </div>


            <div class="section_milieu">
                <form method="POST">
                    <h3 style="width:fit-content;margin-right:10px; opacity:0.8;">Student Name: </h3>
                    <p style="width:fit-content; margin-top:2px; "><?php   
                    echo "kadik salah" ?>
                    </p>
                </form>
                <form method="POST">
                    <h3 style="width:fit-content;margin-right:10px; opacity:0.8;"> Group: </h3>
                    <p style="width:fit-content; margin-top:2px; "><?php   
                    echo "L2 Info 04" ?>
                    </p>
                </form>
            </div>


            <div class="sectionFond">
                <div class="sectionFond1">
                     <h1 >Does he/she attend:</h1>
                </div>

                <div class="sectionFond2">
                    <button name="yes" type="submit" id="yes" class="yes">Yes</button>
                    <button name="no" type="submit" id="no" class="no">No</button>
                </div>
            </div>
        </section>

    </main>

</body>
<script>

    var edit=document.getElementById("edit2")
    var editS=document.getElementById("edit_Subject")
    var editG=document.getElementById("edit_Group")
    valueSubject=editS.value
    valueGroup=editG.value

    edit.addEventListener("click",(event)=>{
        if(edit.textContent=="Edit"){
            event.preventDefault();
            edit.textContent="Save"
            edit.name="save";
            
            const element=document.createElement("button")
                element.setAttribute("id","cancel")
                element.setAttribute("class","btn_cancel")
                element.textContent="Cancel"

                var appen=document.getElementById("appen2")
                appen.appendChild(element)

                editG.disabled=false
                editS.disabled=false

        }


         // if click on cancel
        var cancel=document.getElementById("cancel");
        cancel.addEventListener("click",()=>{
   
            edit.textContent="Edit"
         
            const elementToRemove = document.querySelector('#cancel');
            elementToRemove.remove();

            editG.disabled=true
            editS.disabled=true
            editS.value =valueSubject
            editG.value =valueGroup
        })
    })





    var edit2=document.getElementById("edit1")
    var editD=document.getElementById("edit_day")
    var editH=document.getElementById("edit_hour")
    var editTH=document.getElementById("edit_hour_type")
    valueDay=editD.value
    valueHour=editH.value
    valueTH=editTH.value

    edit2.addEventListener("click",(event)=>{
        if(edit2.textContent=="Edit"){
            event.preventDefault();
            edit2.textContent="Save"
            edit2.name="save";
            
            const element=document.createElement("button")
                element.setAttribute("id","cancel")
                element.setAttribute("class","btn_cancel")
                element.textContent="Cancel"

                var appen2=document.getElementById("appen1")
                appen2.appendChild(element)

                editH.disabled=false
                editD.disabled=false
                editTH.disabled=false

        }


         // if click on cancel
        var cancel=document.getElementById("cancel");
        cancel.addEventListener("click",()=>{
   
            edit2.textContent="Edit"
         
            const elementToRemove = document.querySelector('#cancel');
            elementToRemove.remove();

            editD.disabled=true
            editH.disabled=true
            editTH.disabled=true
            editD.value =valueDay
            editH.value =valueHour
            editTH.value =valueTH
        })
    })
</script>
</html>