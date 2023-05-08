<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    // This is API to get all the groups that available to a specific acadimic level.
    if(isset($_GET["acadimic_level_id"])){
        $groups_r = $mysqli->execute_query("select `groups`.id as id, group_number, level, speciality_name from `groups` join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where acadimic_levels.id = ?;", [$_GET["acadimic_level_id"]]);
        $groups = json_encode($groups_r->fetch_all(MYSQLI_ASSOC));
        echo $groups;
        exit();
    }

    if(isset($_POST["student_id"]) && isset($_POST["group_id"])){
        $query_r = $mysqli->execute_query("update students set group_id = ? where id = ?;", [$_POST["group_id"], $_POST["student_id"]]);
        if(!$query_r){
            echo "SQL Error: ".$mysqli->error;
            exit();
        }
    }

    $students_r = $mysqli->query('select students.id as id, students.acadimic_level_id as acadimic_level_id, first_name, last_name, group_number, count(attendance.id) as absence from students join users on users.id = students.user_id left join `groups` on group_id = `groups`.id left join attendance on students.id = attendance.student_id and attendance.student_state = "absence" group by students.id having students.id is not null;');
    
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
    <link rel="stylesheet" href="/styles/dialogue.css">
    <link rel="stylesheet" href="/styles/forms.css">
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/card-box.css">
    <link rel="stylesheet" href="/styles/students.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Students";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Students</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="list-control">
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-boxes-wrapper">
                        <?php
                            if($students_r){
                                while($row = $students_r->fetch_assoc()){
                                    echo '
                                        <div class="card-box-outer">
                                            <div class="card-box">
                                                <div class="student-profile">
                                                    <div class="student-image">
                                                        <img src="/assets/images/student.jpg" alt="profile_image" />
                                                    </div>
                                                    <div class="student-info">
                                                        <div class="student-name">'.$row["first_name"].' '.$row["last_name"].'</div>
                                                        '.($row["group_number"] ? '<div class="student-group">Group '.$row["group_number"].'</div>' : '<div class="small-btn open-dialogue-btn" student_id="'.$row["id"].'" acadimic_level_id="'.$row["acadimic_level_id"].'" style="align-self: self-start; margin-bottom: 4px">Assign Group</div>').'
                                                        <div class="student-grade">'.($row["current_grade"] ? $row["current_grade"] : "Grade not yet").'</div>
                                                        <div class="student-absence">'.$row["absence"].' Absence</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ';
                                }
                            }
                        ?>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="dialogue" class="dialogue">
        <div class="dialogue-inner">
            <div class="dialogue-header">
                <div class="dialogue-title">Student Group:</div>
                <div class="dialogue-close-btn" id="dialogue-close-btn">Close</div>
            </div>
            <div class="dialogue-body">
               <div class="row">
                    <div class="dialogue-student-profile">
                        <img src="/assets/images/student.jpg" alt="profile_image" />
                        <div class="student-name" style="width: fit-content; margin-top: 10px;">Abdelfetah Lachenani</div>
                    </div>
                    <div class="student-group-select">
                        <form id="assign-group-form" name="assign-group-form"  method="POST">
                            <div class="input-wrapper">
                                <label for="speciality">Groups:</label>
                                <input type="text" class="selected_input" list="groups-list" placeholder="group" />
                                <input type="hidden" class="hidden_selected_input" list="groups-list" id="group_id" name="group_id" placeholder="group" />
                                <datalist id="groups-list">
                                    <!-- Will be loaded using javascript since we have diffrent UI for each student -->
                                </datalist>
                            </div>
                        </form>
                        <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end; width: calc(11/12*100%);">
                            <div class="cancel-btn dialogue-close-btn">Cancel</div>
                            <button form="assign-group-form" class="btn" type="submit" style="margin-left: 10px;">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/assets/js/dialogue.js"></script>
    <script src="/assets/js/select.js"></script>
    <script>
        let btns = document.getElementsByClassName("open-dialogue-btn");
        for(let i = 0; i < btns.length; i++){
            let btn = open_dialogue_btns[i];
            btn.addEventListener("click", (ev) => {
                let acadimic_level_id = ev.target.getAttribute("acadimic_level_id");
                let student_id = ev.target.getAttribute("student_id");
                let assign_group_form = document.getElementById("assign-group-form");

                // FIXME: Using innerHTML can lead to XSS vuln and also it may break the dom tree.
                //        There is another method, i will use ut later, for now that's it.
                assign_group_form.innerHTML += "<input type='hidden' id='student_id' name='student_id' value='"+student_id+"' />";

                fetch("/admin/students.php?acadimic_level_id="+acadimic_level_id, {}).then(response => {
                    response.json().then(data => {
                        for(let i = 0; i < data.length; i++){
                            // FIXME: Using innerHTML can lead to XSS vuln and also it may break the dom tree.
                            //        There is another method, i will use ut later, for now that's it.
                            document.getElementById("groups-list").innerHTML += ("<option value='"+data[i]['id']+"'>L"+data[i]['level']+" "+data[i]['speciality_name']+" Group "+data[i]['group_number']+"</option>")
                        }
                    });
                }).catch(err => console.log({ error: err }));
            });
        }
    </script>
</body>
</html>