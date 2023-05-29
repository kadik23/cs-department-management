<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();
    $user_id = $_SESSION["user_id"];
    $_GET["user_id"] = $user_id;
    
    if(isset($_POST['exam_note']) && isset($_POST['control_note']) && isset($_POST['student_id']) && isset($_POST['subject_id'])){
        // Check if already submited the grades
        $grade_r = $mysqli->execute_query("select * from grades where student_id = ?",[$_POST["student_id"]]);
        // If so then update else insert
        if($grade_r->num_rows > 0){
            $grade = $grade_r->fetch_assoc();
            $mysqli->execute_query("UPDATE grades set exam_note = ?, control_note = ? where id = ?;",[$_POST['exam_note'], $_POST['control_note'], $grade['id']]);
        }else{
            $mysqli->execute_query("insert into grades (exam_note, control_note, subject_id, student_id) values(?,?,?,?);",[$_POST['exam_note'], $_POST['control_note'], $_POST['subject_id'], $_POST['student_id']]);
        }
        echo '{ "status": "success", "message": "Grade updated successfuly." }';
        header("Content-Type: application/json");
        exit();
    }

    if(isset($_POST["search"])){
        $students_r = $mysqli->execute_query("SELECT students.id as id, first_name, last_name, control_note, exam_note, subjects.id as subject_id, subject_name  FROM students JOIN users ON students.user_id = users.id LEFT JOIN grades ON students.id = grades.student_id JOIN schedules ON students.group_id = schedules.group_id JOIN groups ON groups.id = students.group_id JOIN lectures ON groups.acadimic_level_id = lectures.acadimic_level_id JOIN subjects on (schedules.subject_id = subjects.id OR lectures.subject_id = subjects.id) WHERE ( schedules.teacher_id =( SELECT teachers.id AS id FROM teachers WHERE teachers.user_id = ? ) OR schedules.teacher_id =( SELECT teachers.id AS id FROM teachers WHERE teachers.user_id = ? ) ) AND (first_name LIKE concat('%',?,'%') OR last_name LIKE concat('%',?,'%'));", [$user_id, $user_id,$_POST["search"], $_POST["search"]]);
    }

    if(isset($_POST["group_id"])){
        // FIXME: Since we didn't have enogh time, i leave this FIXME here to explain why i am using
        //        such as bad method to extract subject_id.
        $str = explode(" | ", $_POST["group_name"]);
        $subject_name = $str[1];
        // $subject_r = $mysqli->execute_query("select id, subject_name, coefficient, credit from subjects where subject_name = ?;", [$subject_name]);
        // $subject = $subject_r->fetch_assoc();
        
        $students_r = $mysqli->execute_query("SELECT students.id as id, first_name, last_name, control_note, exam_note, subjects.id as subject_id, subject_name FROM students JOIN users ON students.user_id = users.id LEFT JOIN grades ON students.id = grades.student_id JOIN schedules ON students.group_id = schedules.group_id JOIN groups ON groups.id = students.group_id JOIN lectures ON groups.acadimic_level_id = lectures.acadimic_level_id JOIN subjects on (schedules.subject_id = subjects.id OR lectures.subject_id = subjects.id) WHERE ( schedules.teacher_id =( SELECT teachers.id AS id FROM teachers WHERE teachers.user_id = ? ) OR schedules.teacher_id =( SELECT teachers.id AS id FROM teachers WHERE teachers.user_id = ? ) ) AND students.group_id = ? AND subjects.subject_name = ?;", [$user_id, $user_id, $_POST["group_id"], $subject_name]);
    }
    
    if(isset($_POST['logout'])){
        header('Location:/logout.php');
    }

    if(isset($_POST['home'])){
        header('Location: ./index.php');
    }

    $query = "select groups.id as id, group_number, speciality_name, level, subject_name from schedules join groups on groups.id = schedules.group_id join acadimic_levels on acadimic_levels.id = groups.acadimic_level_id join specialities on specialities.id = acadimic_levels.speciality_id join subjects on subjects.id = schedules.subject_id where schedules.teacher_id = (select teachers.id as teacher_id from teachers where user_id = ?);";
    $groups_r = $mysqli->execute_query($query, [$user_id]);
    
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

            <div class="top_section">
                <h2 class="top_section1">Students Notes</h2>
                <form method="POST" class="top_section2">
                    <input type="text" id="group" class="selected_input" list="groups-list" placeholder="Group" name="group_name" disabled value="<?= (isset($_POST["group_name"]) ? $_POST["group_name"] : "") ?>" />
                    <input type="hidden" class="hidden_selected_input" list="groups-list" id="group_id" name="group_id" value="<?= (isset($_POST["group_id"]) ? $_POST["group_id"] : "") ?>" />
                    <datalist id="groups-list">
                        <?php 
                            if($groups_r){
                                while($row = $groups_r->fetch_assoc()){
                                    echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].' G'.$row["group_number"].' | '.$row["subject_name"].'</option>';
                                }
                            }
                        ?>
                    </datalist>
                    <div class="edit_btns">
                        <button type="button" class="btn_edit" name="edit" id="edit">Edit</button>
                        <button type="submit" class="save_btn" name="edit" id="save">save</button>
                    </div>
                </form>
                
            </div>


            <div class="center_section">
                <form method="POST">
                    <input type="text"  id="inp" name="search" placeholder="Student name" class="inp_SN" value="<?= isset($_POST["search"]) ? $_POST["search"] : "" ?>" />
                    <button class="btn_go" type="submit" >Search</button>
                </form>
                <div class="slider" id="slider">
                <?php   
                    if($students_r){
                        while($student = $students_r->fetch_assoc()) {
                            echo '
                            <form method="POST" class="abc" id="submit_notes_form">
                                <div class="student_info">
                                    <div>
                                        <label>Student Name: </label>
                                        <div>'.$student["first_name"].' '.$student["last_name"].'</div>
                                    </div>
                                    
                                    <div>
                                        <label>Subject Name: </label>
                                        <div>'.$student["subject_name"].'</div>
                                    </div>
                                </div>
                                    
                                <div class="notes">
                                    <div class="exam_note">
                                        <p>Exam Note:</p>
                                        <input type="number" max="20" id="exam_note" class="inp_bottom" value="'.$student["exam_note"].'" name="exam_note" />
                                    </div>
                                    <div class="control_note">
                                        <p>Control Note:</p> 
                                        <input type="number" max="20" id="control_note"  class="inp_bottom" name="control_note" value="'.$student["control_note"].'" /> 
                                    </div>
                                </div>

                                <input type="hidden" id="subject_id" name="subject_id" value="'.$student["subject_id"].'" />
                                <input type="hidden" id="student_id" name="student_id" value="'.$student["id"].'" />
                                <button class="submit-btn" type="submit">Submit</button>
                            </form>
                            ';
                        }
                    }else{
                        echo "Please select a Group or Search for Student by his name.";
                    }    
                ?>
                </div>
            </div>


            <div class="slider_control_btns">
                <button name="prev" type="submit" id="prev" class="prev">Prev</button>
                <button name="next" type="submit" id="next" class="next">Next</button>
            </div>
        </section>
    </main>
<script>
    
    var edit = document.getElementById("edit");
    var save_btn = document.getElementById("save");
    var group_input = document.getElementById("group");
    var group_id = document.getElementById("group_id");
    var current_group = { id: "", text: "" };

    edit.addEventListener("click",(event)=>{
        event.preventDefault();
        if(edit.innerText == "Edit"){
            current_group = { id: group_id.value, text: group_input.value };
            edit.innerText = "Cancel";
            group_input.disabled = false;
            save_btn.style.display = "block";
            save_btn.style.opacity = 1;
        }else{
            group_input.value = current_group.text; 
            group_id.value = current_group.id; 
            edit.innerText = "Edit";
            group_input.disabled = false;
            save_btn.style.display = "none";
            save_btn.style.opacity = 0;
        }
    });

    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let slider = document.getElementById('slider');

    next.addEventListener('click', (event) => {
        console.log({
            action: "next",
            scrollLeft: slider.scrollLeft,
            clientWidth: slider.clientWidth,
            result: slider.scrollLeft % slider.clientWidth
        });
        event.preventDefault();
        if(slider.scrollLeft % slider.clientWidth <= 5 || (slider.clientWidth - (slider.scrollLeft % slider.clientWidth) <= 5) ){
            slider.scrollTo({ behavior: 'smooth', left: slider.scrollLeft + slider.clientWidth });
        }
        
    });
    
    prev.addEventListener('click', (event) => {
        console.log({
            action: "prev",
            scrollLeft: slider.scrollLeft,
            clientWidth: slider.clientWidth,
            result: slider.scrollLeft % slider.clientWidth
        });
        event.preventDefault();
        if(slider.scrollLeft % slider.clientWidth <= 5 || (slider.clientWidth - (slider.scrollLeft % slider.clientWidth) <= 5)){
            slider.scrollTo({ behavior: 'smooth', left: slider.scrollLeft - slider.clientWidth });
        }
    });

    let submit_notes_form = document.getElementById("submit_notes_form");
    submit_notes_form.onsubmit = (ev) => {
        let student_id = document.getElementById("student_id");
        let subject_id = document.getElementById("subject_id");
        let exam_note = document.getElementById("exam_note");
        let control_note = document.getElementById("control_note");
    
        let form = new FormData();
        form.append("student_id", student_id.value);      
        form.append("subject_id", subject_id.value);      
        form.append("exam_note", exam_note.value);      
        form.append("control_note", control_note.value);     
        fetch("",{ method: "POST", body: form }).then(response => {
            response.json().then(data => {
                if(data.status == "success"){
                    alert(data.message);
                }
            });
        }).catch(err => { console.log({ err })}); 
        return false;
    };
</script>
    <script src="/assets/js/select.js"></script>
</body>
</html>