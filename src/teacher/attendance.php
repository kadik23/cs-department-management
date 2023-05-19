<?php
    include("../../database/db_connection.php");
    include("../../includes/teacher/route.protection.php");
    session_start();
    $user_id = $_SESSION["user_id"];

    if(isset($_POST['date']) && isset($_POST['student_state']) && isset($_POST['student_id']) && isset($_POST['subject_id'])){
        // Check if already submited the grades
        $student_attendance_r = $mysqli->execute_query("select * from attendance where student_id = ? and subject_id = ? and date = ?",[$_POST["student_id"], $_POST["subject_id"], $_POST["date"]]);
        // If so then update else insert
        if($student_attendance_r->num_rows > 0){
            $student_attendance = $student_attendance_r->fetch_assoc();
            $mysqli->execute_query("UPDATE attendance set student_state = ? where id = ?;",[$_POST['student_state'], $student_attendance['id']]);
        }else{
            $mysqli->execute_query("insert into attendance (date, student_state, subject_id, student_id) values(?,?,?,?);",[$_POST['date'], $_POST['student_state'], $_POST['subject_id'], $_POST['student_id']]);
        }
        echo '{ "status": "success", "message": "Student Attendace updated successfuly." }';
        header("Content-Type: application/json");
        exit();
    }


    if (isset($_POST["group_id"]) && isset($_POST["date"])) {
        // FIXME: Since we didn't have enogh time, i leave this FIXME here to explain why i am using
        //        such as bad method to extract subject_id.
        $str = explode(" | ", $_POST["group_name"]);
        $subject_name = $str[1];
        // $subject_r = $mysqli->execute_query("select id, subject_name, coefficient, credit from subjects where subject_name = ?;", [$subject_name]);
        // $subject = $subject_r->fetch_assoc();

        $students_r = $mysqli->execute_query("select students.id as student_id, student_state, first_name, last_name, subjects.id as subject_id, subject_name from students join schedules on students.group_id = schedules.group_id join subjects on subjects.id = schedules.subject_id join users on students.user_id = users.id left join attendance on (students.id = attendance.student_id and subjects.id = attendance.subject_id and date = ?) where teacher_id = (select teachers.id as id from teachers where teachers.user_id = ?) and students.group_id = ? and subject_name = ?;", [$_POST["date"], $user_id, $_POST["group_id"], $subject_name]);
    }

    if (isset($_POST['logout'])) {
        header('Location:/logout.php');
    }

    if (isset($_POST['home'])) {
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
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
                        <h2>home</h2>
                    </button>
                </div>

                <div class="logout">
                    <button name="logout" class="material-symbols-outlined LO">
                        <h2>logout</h2>
                    </button>
                </div>
            </form>

        </div>
        <section>
            <div class="top_section">
                <h2 class="top_section1">Students Attendance</h2>
                <form method="post" style="width: 500px; display:flex; flex-direction:column;">
                    <div class="top_section1_1">
                        <input type="date" id="edit_date" name="date" value="<?= (isset($_POST["date"]) ? $_POST["date"] : date('Y-m-d')) ?>" disabled>
                    </div>

                    <div class="top_section1_2">
                        <input type="text" id="group" class="selected_input" list="groups-list" placeholder="Group"
                            name="group_name" disabled
                            value="<?= (isset($_POST["group_name"]) ? $_POST["group_name"] : "") ?>" />
                        <input type="hidden" class="hidden_selected_input" list="groups-list" id="group_id"
                            name="group_id" value="<?= (isset($_POST["group_id"]) ? $_POST["group_id"] : "") ?>" />
                        <datalist id="groups-list">
                            <?php
                            if ($groups_r) {
                                while ($row = $groups_r->fetch_assoc()) {
                                    echo '<option value="' . $row["id"] . '">L' . $row["level"] . ' ' . $row["speciality_name"] . ' G' . $row["group_number"] . ' | ' . $row["subject_name"] . '</option>';
                                }
                            }
                            ?>
                        </datalist>

                    </div>
                    <div class="edit_btns"
                        style="margin-top: 20px; margin-left: 0; width: 80%; justify-content: center;">
                        <button type="button" class="btn_edit" name="edit" id="edit">Edit</button>
                        <button type="submit" class="save_btn" name="edit" id="save">save</button>
                    </div>
                </form>

            </div>


            <div class="slider2" id="slider2">

                <?php
                if ($students_r) {
                    while ($student = $students_r->fetch_assoc()) {
                        echo '<form method="POST" class="infos attendance_form">
                        <div class="section_milieu_form">
                            <div style="margin-right: 25px;">
                                <h3 style="width:fit-content;margin-right:10px; opacity:0.8; margin-left:100px;">Student Name: </h3>
                                <p style="width:fit-content; font-size:1.1rem; margin-top:2px; border:none; background-color:transparent;" >' . $student["first_name"] . ' ' . $student["last_name"] . '</p>
                            </div>
                            <div style="margin-right: 25px;">
                                <h3 style="width:fit-content;margin-right:10px; opacity:0.8; margin-left:100px;">Student State: </h3>
                                <p class="student_state" style="width:fit-content; font-size:1.1rem; margin-top:2px; border:none; background-color:transparent; '.($student["student_state"] == "Present" ? "color: green;" : "color: red;").'" >'.($student["student_state"] ? $student["student_state"] : "Not set yet").'</p>
                            </div>
                            <div>
                                <h3 style="width:fit-content;margin-right:10px; opacity:0.8;">Subject: </h3>
                                <p style="width:fit-content; margin-top:2px; ">' . $student["subject_name"] . '
                                </p>
                            </div>
                        </div>
                        <div>
                            <h1 style="margin-bottom: 10px;">Does he/she attend:</h1>
                            <input type="hidden" name="student_id" class="student_id" value="'.$student["student_id"].'" />
                            <input type="hidden" name="subject_id" class="subject_id" value="'.$student["subject_id"].'" />
                            <button name="yes" type="submit" class="yes">Yes</button>
                            <button name="no" type="submit" class="no">No</button>
                        </div></form>';
                    }
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

    <script>

        var edit = document.getElementById("edit");
        var save_btn = document.getElementById("save");
        var group_input = document.getElementById("group");
        var group_id = document.getElementById("group_id");
        var edit_date = document.getElementById("edit_date");
        var current_group = { id: "", text: "" };

        edit.addEventListener("click", (event) => {
            event.preventDefault();
            if (edit.innerText == "Edit") {
                current_group = { id: group_id.value, text: group_input.value };
                edit.innerText = "Cancel";
                group_input.disabled = false;
                edit_date.disabled = false;
                save_btn.style.display = "block";
                save_btn.style.opacity = 1;
            } else {
                group_input.value = current_group.text;
                group_id.value = current_group.id;
                edit.innerText = "Edit";
                group_input.disabled = true;
                edit_date.disabled = true;
                save_btn.style.display = "none";
                save_btn.style.opacity = 0;
            }
        });

        let next = document.getElementById('next');
        let prev = document.getElementById('prev');
        let slider = document.getElementById('slider2');

        next.addEventListener('click', (event) => {
            console.log({
                action: "next",
                scrollLeft: slider.scrollLeft,
                clientWidth: slider.clientWidth,
                result: slider.scrollLeft % slider.clientWidth
            });
            event.preventDefault();
            if (slider.scrollLeft % slider.clientWidth <= 5 || (slider.clientWidth - (slider.scrollLeft % slider.clientWidth) <= 5)) {
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
            if (slider.scrollLeft % slider.clientWidth <= 5 || (slider.clientWidth - (slider.scrollLeft % slider.clientWidth) <= 5)) {
                slider.scrollTo({ behavior: 'smooth', left: slider.scrollLeft - slider.clientWidth });
            }
        });

        let attendance_forms = document.getElementsByClassName("attendance_form");
        let student_ids = document.getElementsByClassName("student_id");
        let subject_ids = document.getElementsByClassName("subject_id");

        for(let i = 0; i < attendance_forms.length; i++){
            let attendance_form =attendance_forms[i];
            let student_id = student_ids[i];
            let subject_id = subject_ids[i];

            attendance_form.onsubmit = (ev) => {
                ev.preventDefault();
                
                let student_state = (ev.submitter.name == "yes" ? "Present" : "Absence");
                document.getElementsByClassName("student_state")[i].innerText = student_state;
                document.getElementsByClassName("student_state")[i].style.color = student_state == "Present" ? "green" : "red";
                let form = new FormData();
                form.append("student_id", student_id.value);      
                form.append("subject_id", subject_id.value);      
                form.append("date", edit_date.value);      
                form.append("student_state", student_state);     
                fetch("",{ method: "POST", body: form }).then(response => {
                    response.json().then(data => {
                        if(data.status == "success"){
                            alert(data.message);
                        }
                    });
                }).catch(err => { console.log({ err })}); 
                return false;
            };
        }
    </script>
    <script src="/assets/js/select.js"></script>
</body>

</html>