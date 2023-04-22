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
    <link rel="stylesheet" href="/styles/student.css">
    <link rel="stylesheet" href="/styles/aside.css">
    <link rel="stylesheet" href="/styles/table.css">
</head>
<body>
    <div class="container">
        <?php
            $aside_selected_link = "Schudeler";
            include("../../includes/student/aside.php");
        ?>
        

        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Schudeler</div>
            </div>
       
            <div class="section-wrapper">
                <div class="section-content">
                
                <div class="table-head">
                    <div class="table-head-item">Days</div>
                    <div class="table-head-item">08:00 to 10:00</div>
                    <div class="table-head-item">10:00 to 12:00</div>
                    <div class="table-head-item">12:00 to 14:00</div>
                    <div class="table-head-item">14:00 to 16:00</div>
                    <div class="table-head-item">16:00 to 18:00</div>
                </div>
                <div class="table-body">
                    <div class="table-row">
                        <div class="table-item">Sunday</div>   
                        <div class="table-item">TP Réseaux</div>   
                        <div class="table-item">Théorie des langages</div>   
                        <div class="table-item">TD Système d'exploitation 1</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                    </div>
                    <div class="table-row">
                        <div class="table-item">Monday</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item">Bases de données</div>   
                        <div class="table-item">TD Théorie des langages</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                    </div>
                    <div class="table-row">
                        <div class="table-item">Tuesday</div>   
                        <div class="table-item">Système d'exploitation 1</div>   
                        <div class="table-item">TP Système d'exploitation 1</div>   
                        <div class="table-item">Programmation orienté objet</div>   
                        <div class="table-item">TP Programmation orienté objet</div>   
                        <div class="table-item">TD Réseaux</div>   
                    </div>
                    <div class="table-row">
                        <div class="table-item">Wednesday</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item">Réseaux</div>   
                        <div class="table-item">TD Bases de données</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                    </div>
                    <div class="table-row">
                        <div class="table-item">Thursday</div>   
                        <div class="table-item">TP Développement d'applications web</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                        <div class="table-item table-item-empty">Empty</div>   
                    </div>
                </div>

                </div>
            </div>
        </div>
    </div>
</body>
</html>