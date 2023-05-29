<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();
    $user_id = $_SESSION["user_id"];



    // modify location
    if(isset($_POST['edit1'])){
        $address = $_POST['edit1'];
        $update = "UPDATE users SET location=? WHERE id=?";
        $set = $mysqli->execute_query($update, [$address, $user_id]);
        if ($set === false) {
            echo "query execution failed: " . $mysqli->error;
        } else {
            $row1 = $set->fetch_array();
        }
    }
    
    
    //modify telephone number
    if(isset($_POST['edit2'])){
        $tel = $_POST['edit2'];
        $update = "UPDATE users SET phone_number=? WHERE id=?";
        $set = $mysqli->execute_query($update, [$tel, $user_id]);
        if ($set === false) {
            echo "query execution failed: " . $mysqli->error;
        } else {
            $row1 = $set->fetch_array();
        }
    }
   
    // select information of teacher
    $query="SELECT * FROM teachers JOIN users ON teachers.user_id=users.id WHERE user_id=? ;";
    $result2 = $mysqli->execute_query($query,[$user_id]);
    $row2 = $result2->fetch_array();


    if(isset($_POST['home'])){
    header('Location: ./index.php');
    }

    
    if(isset($_POST['logout'])){
        header('Location:/logout.php');
    }

   
   
?>


<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../styles/profile_teacher.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body>
<main>

    <div class="side-bar">
        
    <div class="container">
            <div class="logo">
                <a href="./index.php"><img src="../assets/images/yahia-fares-logo.png" alt="" class="logoo"></a>
            </div>
            <a href="/teacher" style="text-decoration: none;" class="home-page">
                <button name="home" class="material-symbols-outlined">
                    <h2 >home</h2>
                </button>
            </a>

            <a href="/teacher/profile.php" style="text-decoration: none; width: 100%; display: flex; justify-content: center;">
                <button class="material-symbols-outlined">
                    <h2>account_circle</h2>
                </button>
            </a>
            
            <a href="/teacher/notebook.php" style="text-decoration: none; width: 100%; display: flex; justify-content: center;">
                <button class="material-symbols-outlined">
                    <h2>edit_note</h2>
                </button>
            </a>

            <a href="/teacher/attendance.php" style="text-decoration: none; width: 100%; display: flex; justify-content: center;">
                <button class="material-symbols-outlined">
                    <h2>co_present</h2>
                </button>
            </a>

            <a href="/logout.php" style="text-decoration: none; margin-top: 40px;" class="logout">
                <button name="logout" class="material-symbols-outlined LO">
                    <h2>logout</h2>
                </button>
            </a>
        </div>

    </div>

    <section>
     
        <div class="profile">
            <img src="../assets/images/teacher.png" alt="" class="teacher_img">
            <h1><?php echo strtoupper($row2['first_name']).' '.strtoupper($row2['last_name']); 
                    
            ?></h1>
        </div>

        <form method="POST" class="teatcher-info" >
               <div> <h2>ُEmail :</h2>  <h3><?php echo $row2['email'] ;?></h3>  </div>
                <div> <h2>First Name :</h2>  <h3><?php echo $row2['first_name'] ;?></h3>  </div>
                <div>  <h2>Last Name :</h2>  <h3><?php echo $row2['last_name']; ?></h3>  </div>
                <div id="appen">  <h2>Location : </h2 >  <input type="text" id="h1" name="edit1" disabled value="<?php echo $row2['location'] ;?>" class="address">
                <button  type="submit" class="btn_edit" id="modif_address">edit</button>         
                </div>
                <div id="appen2"> <h2>Telephone  : </h2>  <input type="text" id="h2"name="edit2"  disabled value="<?php echo $row2['phone_number'] ;?>" class="address">
                <button  type="submit" class="btn_edit" id="modif_tel">edit</button>  
                </div>
        </form>

    </section>
</main>

</body>
<script>

    var edit=document.getElementById("modif_address")
    var e=document.getElementById("h1")
    var value=e.value

    edit.addEventListener("click",function(event){
         // if click on edit 
        
        if(edit.textContent=="edit"){
                event.preventDefault();
                edit.textContent="save"
                edit.name="save1";

                const element=document.createElement("button")
                element.setAttribute("id","hh1")
                element.setAttribute("class","btn_cancel")
                element.textContent="cancel"
        
                var a=document.getElementById("appen")
                a.appendChild(element)
                e.disabled=false
        }

         // if click on cancel 
         var cancel=document.getElementById("hh1");
         cancel.addEventListener("click",function(){
   
            document.getElementById("modif_address").textContent="edit"

            const elementToRemove = document.querySelector('#hh1');
            elementToRemove.remove();
            document.getElementById("h1").disabled=true
            e.value= value    
        })

    })



    var edit2=document.getElementById("modif_tel")
    var e2=document.getElementById("h2")
    var value2=e2.value

    edit2.addEventListener("click",function(event){
        // if click on edit 
        if(edit2.textContent=="edit"){
            event.preventDefault();
            edit2.textContent="save"
            edit2.name="save2";

            const element=document.createElement("button")
            element.setAttribute("id","hh2")
            element.setAttribute("class","btn_cancel")
            element.textContent="cancel"
        
            var a2=document.getElementById("appen2")
            a2.appendChild(element)
            e2.disabled=false
        }

        // if click on cancel
        var cancel=document.getElementById("hh2");
        cancel.addEventListener("click",function(){
   
            document.getElementById("modif_tel").textContent="edit"
         
            const elementToRemove = document.querySelector('#hh2');
            elementToRemove.remove();

            document.getElementById("h2").disabled=true
            e2.value= value2
        })
    })
</script>
</html>