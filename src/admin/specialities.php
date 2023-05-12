<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $spec_name = $_POST["speciality_name"];
    $spec_levels = $_POST["speciality_levels"];
    
    if(isset($spec_name) && isset($spec_levels)){
        $speciality_r = $mysqli->execute_query("insert into specialities (speciality_name) values (?);", [$spec_name]);
        $spec_id = $mysqli->insert_id;
        if($speciality_r){
            // NOTE: For now we dont have a custom selection on levels in the UI.
            for($i = 1; $i <= intval($spec_levels); $i++){
                $level_r = $mysqli->execute_query("insert into acadimic_levels (speciality_id, level) values (?,?);", [$spec_id, $i]);
            }
        }
    }
    if(isset($_POST["search"])){
        $specialities_r = $mysqli->execute_query("select specialities.*,count(acadimic_levels.id) as levels from specialities join acadimic_levels on acadimic_levels.speciality_id = specialities.id where speciality_name like concat('%',?,'%') group by acadimic_levels.speciality_id;", [$_POST["search"]]);
    }else{
        $specialities_r = $mysqli->query("select specialities.*,count(acadimic_levels.id) as levels from specialities join acadimic_levels on acadimic_levels.speciality_id = specialities.id group by acadimic_levels.speciality_id;");
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
            $aside_selected_link = "Specialities";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Specialities</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label>Name:</label>
                                <input type="text" name="speciality_name" id="speciality_name" placeholder="name" />
                            </div>    
                            
                            <div class="input-wrapper">
                                <label>Levels:</label>
                                <input type="number" name="speciality_levels" id="speciality_levels" placeholder="levels" />
                            </div>
                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Add</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Add New Speciality</button>
                    </div>
                    <div class="list-control">
                        <form method="POST" class="search">
                            <input type="text" name="search" placeholder="search..." value="<?= $_POST["search"] ?>"/>
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </form>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Speciality Id</div>
                            <div class="list-header-item" style="flex: 2;">Speciality Name</div>
                            <div class="list-header-item">Total Levels</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($specialities_r){
                                    while($row = $specialities_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["id"].'</div>
                                                <div class="list-item" style="flex: 2;">'.$row["speciality_name"].'</div>
                                                <div class="list-item">'.$row["levels"].'</div>
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