<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $resource_type = $_POST["resource_type"];
    $resource_number = $_POST["resource_number"];

    if(isset($resource_type) && isset($resource_number)){
        $resource_r = $mysqli->execute_query("insert into resources (resource_type, resource_number) select ?,? where not exists (select * from resources where resource_type = ? and resource_number = ?);", [$resource_type, $resource_number, $resource_type, $resource_number]);
        if($mysqli->affected_rows < 1){
            $error_message = "Resource Already Exist.";
        }else{
            $success_message = "Resource Added Successfuly.";
        }
    }
    
    if(isset($_POST["filter_resource_type"]) && $_POST["filter_resource_type"] != 'All'){
        $resources_r = $mysqli->execute_query("select * from resources where resource_type like concat('%',?,'%');",[$_POST["filter_resource_type"]]);
    }else{
        $resources_r = $mysqli->query("select * from resources;");
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
    <link rel="stylesheet" href="/styles/dialogue.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Resources";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Resources</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label>Resource Type:</label>
                                <input type="text" name="resource_type" id="resource_type" placeholder="Resource type" />
                            </div>    
                            
                            <div class="input-wrapper">
                                <label>Resource Number/Reference:</label>
                                <input type="number" name="resource_number" id="resource_number" placeholder="Resource number" />
                            </div>
                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Create</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Create Resource</button>
                    </div>
                    <div class="list-control">
                        <form method="POST" class="input-group" style="margin-right: 10px;">
                            <input style="background-color: #ebebeb; padding: 10px 20px;" placeholder="Resource Type" type="text" class="selected_input" list="filter-resource-types" value="<?= $_POST['filter_resource_type'] ?>" />
                            <input type="hidden" class="hidden_selected_input" id="filter_resource_type" name="filter_resource_type" value="<?= $_POST['filter_resource_type'] ?>" />
                            <datalist id="filter-resource-types">
                                <option value="All">All</option>
                                <option value="Amphi">Amphi</option>
                                <option value="Sale">Sale</option>
                                <option value="Labo">Labo</option>
                            </datalist>
                            <button style="margin-right: 10px; margin-left: 10px; background-color: #16a34a; border: none;" class="btn" type="submit">Filter</button>
                        </form>
                    </div>
                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Resource Id</div>
                            <div class="list-header-item" style="flex: 2;">Resource Type</div>
                            <div class="list-header-item">Resource Number/Reference</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($resources_r){
                                    while($row = $resources_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                                <div class="list-item">'.$row["id"].'</div>
                                                <div class="list-item" style="flex: 2;">'.$row["resource_type"].'</div>
                                                <div class="list-item">'.$row["resource_number"].'</div>
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

    <?php include("../../includes/admin/alert_message.php")  ?>

    <script src="/assets/js/forms.js"></script>
    <script src="/assets/js/select.js"></script>
</body>
</html>