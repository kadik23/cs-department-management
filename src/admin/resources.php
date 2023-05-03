<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $resource_type = $_POST["resource_type"];
    $resource_number = $_POST["resource_number"];

    if(isset($resource_type) && isset($resource_number)){
        $resource_r = $mysqli->execute_query("insert into resources (resource_type, resource_number) values (?,?);", [$resource_type, $resource_number]);
        // TODO: Handle Error/Success messages.
    }

    $resources_r = $mysqli->query("select * from resources;");
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
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
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
    <script src="/assets/js/forms.js"></script>
</body>
</html>