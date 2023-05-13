<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $subjects_r = $mysqli->query("select id, subject_name from subjects;");
    $teachers_r = $mysqli->query("select teachers.id as id, first_name, last_name from users join teachers on users.id = teachers.user_id;");
    $acadimic_levels_r = $mysqli->query("select acadimic_levels.id as id, specialities.speciality_name as speciality_name, acadimic_levels.level as level from acadimic_levels join specialities on acadimic_levels.speciality_id = specialities.id;");
    $class_rooms_r = $mysqli->query("select * from resources where resource_type='Amphi';");
    $groups_r = $mysqli->query("select `groups`.id as id, group_number,level, speciality_name from `groups` join acadimic_levels on `groups`.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id;");

    $subject_id = $_POST["subject_id"];
    $teacher_id = $_POST["teacher_id"];
    $acadimic_level_id = $_POST["acadimic_level_id"];
    $start_at = $_POST["start_at"];
    $end_at = $_POST["end_at"];

    if(isset($subject_id) && isset($teacher_id) && isset($acadimic_level_id) && isset($start_at) && isset($end_at)){
        $lecture_r = $mysqli->execute_query("insert into lectures (subject_id, teacher_id, acadimic_level_id, start_at, end_at) value (?,?,?,?,?);", [$subject_id, $teacher_id, $acadimic_level_id, $start_at, $end_at]);
        // TODO: Handle query results (Error/Success Message).
    }

    if(isset($_POST["filter_group_id"])){
        $lectures_r = $mysqli->execute_query("SELECT lectures.id AS id, subjects.subject_name AS lecture_name, start_at, end_at, first_name, last_name, speciality_name, level, group_number, resource_type, resource_number FROM lectures JOIN subjects ON lectures.subject_id = subjects.id JOIN teachers ON lectures.teacher_id = teachers.id JOIN users ON users.id = teachers.user_id JOIN groups ON groups.id = lectures.group_id JOIN acadimic_levels ON acadimic_levels.id = groups.acadimic_level_id JOIN specialities ON specialities.id = acadimic_levels.speciality_id JOIN resources ON class_room_id = resources.id where groups.id = ?;",[$_POST["filter_group_id"]]);
    }else{
        $lectures_r = $mysqli->query("SELECT lectures.id AS id, subjects.subject_name AS lecture_name, start_at, end_at, first_name, last_name, speciality_name, level, group_number, resource_type, resource_number FROM lectures JOIN subjects ON lectures.subject_id = subjects.id JOIN teachers ON lectures.teacher_id = teachers.id JOIN users ON users.id = teachers.user_id JOIN groups ON groups.id = lectures.group_id JOIN acadimic_levels ON acadimic_levels.id = groups.acadimic_level_id JOIN specialities ON specialities.id = acadimic_levels.speciality_id JOIN resources ON class_room_id = resources.id;");
    }

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
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/forms.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Lectures";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Lectures</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label for="subject">Subject:</label>
                                <input type="text" class="selected_input" list="subjects-list" placeholder="subject" />
                                <input type="hidden" class="hidden_selected_input" list="subjects-list" id="subject_id" name="subject_id" placeholder="subject" />
                                <datalist id="subjects-list">
                                    <?php 
                                        if($subjects_r){
                                            while($row = $subjects_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">'.$row["subject_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="teacher">Teacher:</label>
                                <input type="text" class="selected_input" list="teachers-list" placeholder="teacher" />
                                <input type="hidden" class="hidden_selected_input" list="teachers-list" id="teacher_id" name="teacher_id" placeholder="teacher" />
                                <datalist id="teachers-list">
                                    <?php 
                                        if($teachers_r){
                                            while($row = $teachers_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">'.$row["first_name"].' '.$row["last_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="speciality">Acadimic Level:</label>
                                <input type="text" class="selected_input" list="speciality-list" placeholder="acadimic level" />
                                <input type="hidden" class="hidden_selected_input" list="speciality-list" id="acadimic_level_id" name="acadimic_level_id" placeholder="acadimic level" />
                                <datalist id="speciality-list">
                                    <?php 
                                        if($acadimic_levels_r){
                                            while($row = $acadimic_levels_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label for="class_room_id">Class Room:</label>
                                <input type="text" class="selected_input" list="class-rooms-list" placeholder="class room" />
                                <input type="hidden" class="hidden_selected_input" list="class-rooms-list" id="class_room_id" name="class_room_id" placeholder="class room" />
                                <datalist id="class-rooms-list">
                                    <?php 
                                        if($class_rooms_r){
                                            while($row = $class_rooms_r->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">Amphi '.$row["resource_number"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div class="input-wrapper">
                                <label>Start At:</label>
                                <input type="time" min="08:00" max="18:00" step="300" name="start_at" id="start_at" />
                            </div>   

                            <div class="input-wrapper">
                                <label>End At:</label>
                                <input type="time" min="08:00" max="18:00" step="300" name="end_at" id="end_at" />
                            </div>   

                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Add</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Add New Lecture</button>
                    </div>
                    <div class="list-control">
                        <form method="POST" class="input-group" style="margin-right: 10px;">
                            <input style="background-color: #ebebeb; padding: 10px 20px;" placeholder="Group" type="text" class="selected_input" list="filter-groups" value="<?php 
                                if(isset($_POST["filter_group_id"])){
                                    $result = $mysqli->execute_query("select group_number, level, speciality_name from groups join acadimic_levels on groups.acadimic_level_id = acadimic_levels.id join specialities on acadimic_levels.speciality_id = specialities.id where groups.id = ?;", [$_POST['filter_group_id']]);
                                    $r = $result->fetch_assoc();
                                    echo 'L'.$r["level"].' '.$r["speciality_name"].' Group '.$r["group_number"];
                                }
                            ?>" />
                            <input type="hidden" class="hidden_selected_input" list="filter-groups" id="filter_group_id" name="filter_group_id" value="<?= $_POST['filter_group_id'] ?>" />
                            <datalist id="filter-groups">
                                <?php 
                                    if($groups_r){
                                        while($row = $groups_r->fetch_assoc()){
                                            echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].' Group '.$row["group_number"].'</option>';
                                        }
                                    }
                                ?>
                            </datalist>
                            <button style="margin-right: 10px; margin-left: 10px; background-color: #16a34a; border: none;" class="btn" type="submit">Filter</button>
                        </form>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Lecture Id</div>
                            <div class="list-header-item" style="flex: 2;">Lecture name</div>
                            <div class="list-header-item" style="flex: 2;">Teacher</div>
                            <div class="list-header-item" style="flex: 3;">Group</div>
                            <div class="list-header-item">Class Room</div>
                            <div class="list-header-item">From</div>
                            <div class="list-header-item">To</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($lectures_r){
                                    while($row = $lectures_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["id"].'</div>
                                                <div class="list-item" style="flex: 2;">'.$row["lecture_name"].'</div>
                                                <div class="list-item" style="flex: 2;">'.$row["first_name"].' '.$row["last_name"].'</div>
                                                <div class="list-item" style="flex: 3;">L'.$row["level"].' '.$row["speciality_name"].' Group '.$row["group_number"].'</div>
                                                <div class="list-item">'.$row["resource_type"].' '.$row["resource_number"].'</div>
                                                <div class="list-item">'.substr($row["start_at"], 0, -3).'</div>
                                                <div class="list-item">'.substr($row["end_at"], 0, -3).'</div>
                                             </div>';
                                    }        
                                }
                            ?>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <script src="/assets/js/forms.js"></script>
    <script src="/assets/js/select.js"></script>
</body>
</html>