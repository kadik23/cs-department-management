<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $subject_name = $_POST["subject_name"];
    $coefficient = $_POST["coefficient"];
    $credit = $_POST["credit"];
    
    if(isset($subject_name) && isset($coefficient) && isset($credit)){
        $subject_r = $mysqli->execute_query("insert into subjects (subject_name, coefficient, credit) values (?,?,?);", [$subject_name, $coefficient, $credit]);
        if(!$subject_r){
            echo "SQL Error: ".$mysqli->error;
            exit();
        }
    }

    if(isset($_POST["search"])){
        $subjects_r = $mysqli->execute_query("select * from subjects where subject_name like concat('%',?,'%');", [$_POST['search']]);
    }else{
        $subjects_r = $mysqli->query("select * from subjects;");
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
            $aside_selected_link = "Subjects";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Subjects</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <form method="POST" id="target_form" class="form-wrapper">
                            <div class="input-wrapper">
                                <label>Subject Name:</label>
                                <input type="text" name="subject_name" id="subject_name" placeholder="Subject name" />
                            </div>
                            <div class="input-wrapper">
                                <label>Coefficient:</label>
                                <input type="number" name="coefficient" id="coefficient" placeholder="coefficient" />
                            </div>
                            <div class="input-wrapper">
                                <label>Credit:</label>
                                <input type="number" name="credit" id="credit" placeholder="credit" />
                            </div>
                            <div>
                                <button id="close_create_spec" class="cancel-btn">Cancel</button>
                                <button type="submit" class="btn">Create</button>
                            </div>
                        </form>
                        <button id="open_create_spec" class="btn">Create Subject</button>
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
                            <div class="list-header-item">Id</div>
                            <div class="list-header-item" style="flex: 3;">Subject Name</div>
                            <div class="list-header-item">Coefficient</div>
                            <div class="list-header-item">Credit</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($subjects_r){
                                    while($row = $subjects_r->fetch_assoc()){
                                        echo '<div class="list-row">
                                            <div class="list-item">'.$row["id"].'</div>
                                            <div class="list-item" style="flex: 3;">'.$row["subject_name"].'</div>
                                            <div class="list-item">'.$row["coefficient"].'</div>
                                            <div class="list-item">'.$row["credit"].'</div>
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