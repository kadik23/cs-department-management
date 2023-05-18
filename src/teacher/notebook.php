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

     if(isset($_POST['save_note'])){
                //   test..
        echo $_POST["exam"];
        echo $_POST["control"];
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
                <form method="post" class="top_section2" id="appen">
                        <input type="text" id="edit_Subject" value="Operating System " disabled>
                        <p style="width: max-content; background-color: #e7e7e7; display:flex; align-items:center; padding-right:2px; color:#545454;font-weight: bold;" >| Group </p>
                        <input type="text" id="edit_Group" value="<?= $_POST['group']?>" name="group" disabled>
                        <button type="submit" class="btn_edit" name="edit" id="edit">Edit</button>
                </form>
                
            </div>


            <div class="center_section">
                <form method="POST">
                    <input type="text"  id="inp" name="value" placeholder="Student name" class="inp_SN">
                    <button name="go" class="btn_go" type="submit" >Go</button>
                </form>
                <form method="POST" class="slider" id="slider">
                <?php   
                    if(isset($_POST['save'])) {
                            
                             $student = $mysqli->execute_query("SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name FROM users JOIN students ON users.id = students.user_id  where students.group_id=?;",[$_POST["group"]]);

                             foreach ($student as $student_r) {
                                 echo '
                                    <div class="abc">
                                         <div class="student_name ">
                                            <h3 style="width:fit-content;margin-right:10px; ">Student Name: </h3>
                                            <div class="username">'.$student_r["full_name"].'</div>
                                         </div>
                                         
                                        <div class="notes">
                                            <div class="exam_note">
                                                <p style="margin-right:10px">Exam Note:</p>
                                               <div class="bcd"> <input type="text"  id="inp1" class="inp_bottom"> <button type="submit" class="btn_save">save</button> </div> 
                                            </div>

                                            <div class="control_note">
                                                <p>Control Note:</p> 
                                                <div class="bcd"> <input type="text" id="inp1"  class="inp_bottom" name="save_note">   </div> 
                                            </div>
                                        </div>
                                    </div>
                                  ';
                             }
                             
                    }else{
                        if(isset($_POST['go'])){
                            $value=$_POST['value'];
                            $search="SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name FROM users JOIN students ON users.id = students.user_id WHERE CONCAT(users.first_name, ' ', users.last_name) = ? ;";
                            $result = $mysqli->execute_query($search,[$value]);
                            $final_result = $result->fetch_array();
                        }    
                            
                                echo '
                                     <div class="abc">

                                         <div class="student_name ">
                                         <h3 style="width:fit-content;margin-right:10px; ">Student Name: </h3>
                                             <div class="username">';
                                             
                                             if($final_result)
                                                echo $final_result['full_name'];
                                                echo    
                                                '
                                             </div>
                                         </div>
                                         
                                        <div class="notes">
                                            <div class="exam_note">
                                                <p style="margin-right:10px" >Exam Note:</p>
                                                <div class="bcd"> <input type="text"  id="inp1" class="inp_bottom" name="exam"> <button type="submit" class="btn_save" name="save_note">save</button> </div> 
                                            </div>

                                            <div class="control_note">
                                                <p>Control Note:</p> 
                                                <div class="bcd"> <input type="text" id="inp1"  class="inp_bottom" name="control">   </div> 
                                            </div>
                                        </div>
                                    </div>';
                    }
                    ?>
                </form>
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
    
    var edit=document.getElementById("edit")
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

                var appen=document.getElementById("appen")
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

            let next = document.getElementById('next');
            let prev = document.getElementById('prev');
            let slider = document.getElementById('slider');

            next.addEventListener('click', (event) => {

                event.preventDefault();
                if(slider.scrollLeft % slider.clientWidth <= 50){
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