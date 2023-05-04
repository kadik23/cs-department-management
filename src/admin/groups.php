<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $group_number = $_POST["group_number"];
    $acadimic_level_id = $_POST["acadimic_level_id"];

    if(isset($group_number) && isset($acadimic_level_id)){
        $result = $mysqli->execute_query("insert into groups (group_number, acadimic_level_id) values (?,?);", [$group_number, $acadimic_level_id]);
    }

    $acadimic_levels_result = $mysqli->query("select acadimic_levels.id as id, specialities.speciality_name as speciality_name, acadimic_levels.level as level from acadimic_levels join specialities on acadimic_levels.speciality_id = specialities.id;");
    
    $groups_result = $mysqli->query("SELECT groups.id AS id, group_number, speciality_name, level, users.first_name AS responsible, COUNT(students.id) AS total_students FROM groups JOIN acadimic_levels ON groups.acadimic_level_id = acadimic_levels.id JOIN specialities ON acadimic_levels.speciality_id = specialities.id LEFT JOIN users ON responsible = users.id LEFT JOIN students ON students.group_id = groups.id group by groups.id HAVING groups.id IS NOT NULL;");

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
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/forms.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Groups";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Groups</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label>Group Number:</label>
                                <input type="number" name="group_number" id="group_number" placeholder="group number" />
                            </div>

                            <div class="input-wrapper">
                                <label for="speciality">Speciality:</label>
                                <input list="speciality-list" id="acadimic_level_id" name="acadimic_level_id" placeholder="speciality" />
                                <datalist id="speciality-list">
                                    <?php 
                                        if($acadimic_levels_result){
                                            while($row = $acadimic_levels_result->fetch_assoc()){
                                                echo '<option value="'.$row["id"].'">L'.$row["level"].' '.$row["speciality_name"].'</option>';
                                            }
                                        }
                                    ?>
                                </datalist>
                            </div>

                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Create</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Create Group</button>
                    </div>
                    <div class="list-control">
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Group Id</div>
                            <div class="list-header-item">Group Number</div>
                            <div class="list-header-item">Speciality</div>
                            <div class="list-header-item">Responsable</div>
                            <div class="list-header-item">Total Students</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($groups_result){
                                    while($row = $groups_result->fetch_assoc()){
                                        echo '<div class="list-row">
                                            <div class="list-item">'.$row["id"].'</div>
                                            <div class="list-item">'.$row["group_number"].'</div>
                                            <div class="list-item">L'.$row["level"].' '.$row["speciality_name"].'</div>
                                            <div class="list-item">'.($row["responsible"] ? $row["responsible"] : "Not Yet").'</div>
                                            <div class="list-item">'.$row["total_students"].'</div>
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
</body>
</html>