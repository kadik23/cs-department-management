<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");
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
    <link rel="stylesheet" href="/styles/accounts.css">
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
                    <div class="table-control">
                        <div class="accounts-search">
                            <input type="text" placeholder="search..." />
                            <div class="accounts-search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>
                    <div class="users-table">
                        <div class="table-header">
                            <div class="table-header-item">Room Number</div>
                            <div class="table-header-item" style="flex: 2;">Group</div>
                            <div class="table-header-item">From</div>
                            <div class="table-header-item">To</div>
                            <div class="table-header-item" style="flex: 2;">Subject</div>
                        </div>
                        <div class="table-body">
                            <?php
                                $students = [0,1,2,3,4,5,6];
                                foreach($students as $student){
                                    echo '<div class="table-row">
                                            <div class="table-item">'.$student.'</div>
                                            <div class="table-item" style="flex: 2;">L2 ComputerScience G4</div>
                                            <div class="table-item">08:00</div>
                                            <div class="table-item">10:00</div>
                                            <div class="table-item" style="flex: 2;">Algorithms and data structures</div>
                                         </div>';
                                }
                            ?>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</body>
</html>