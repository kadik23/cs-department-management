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
    <link rel="stylesheet" href="/styles/buttons.css">
    <link rel="stylesheet" href="/styles/dialogue.css">
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Schedules";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Schedules</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <button id="open-dialogue-btn" class="btn">Create</button>
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
                            <div class="list-header-item">Room Number</div>
                            <div class="list-header-item" style="flex: 2;">Group</div>
                            <div class="list-header-item">From</div>
                            <div class="list-header-item">To</div>
                            <div class="list-header-item" style="flex: 2;">Subject</div>
                        </div>
                        <div class="list-body">
                            <?php
                                $students = [0,1,2,3,4,5,6];
                                foreach($students as $student){
                                    echo '<div class="list-row">
                                            <div class="list-item">'.$student.'</div>
                                            <div class="list-item" style="flex: 2;">L2 ComputerScience G4</div>
                                            <div class="list-item">08:00</div>
                                            <div class="list-item">10:00</div>
                                            <div class="list-item" style="flex: 2;">Algorithms and data structures</div>
                                         </div>';
                                }
                            ?>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div id="dialogue" class="dialogue">
        <div class="dialogue-inner">
            <div class="dialogue-header">
                <div class="dialogue-title">Create</div>
                <div class="dialogue-close-btn" id="dialogue-close-btn">Close</div>
            </div>
            <div class="dialogue-body">
                <form>
                    <div>
                        <label for="room_number">Room number:</label>
                        <input type="text" name="room_number" id="room_number" />
                    </div>
                    <div>
                        <label for="group">Group:</label>
                        <input list="groups" id="group" name="group" />
                        <datalist id="groups">
                            <option value="L1 Info"></option>
                            <option value="L2 Info"></option>
                            <option value="L3 Info"></option>
                            <option value="M1 Info"></option>
                            <option value="M2 Info"></option>
                        </datalist>
                    </div>
                    <div>
                        <label for="subject">Subject:</label>
                        <input list="subjects" id="subjects" name="subject" />
                        <datalist id="subjects">
                            <option value="Algorithms and data structure"></option>
                            <option value="System explotation"></option>
                            <option value="Databases"></option>
                        </datalist>
                    </div>
                    <div>
                        <div>
                            <label for="start">Start at:</label>
                            <input type="time" list="popularHours" />
                            <datalist id="popularHours">
                                <option value="12:00"></option>
                                <option value="13:00"></option>
                                <option value="14:00"></option>
                            </datalist>
                        </div>
                        <div>
                            <label for="start">Start at:</label>
                            <input type="time" list="popularHours" />
                            <datalist id="popularHours">
                                <option value="12:00"></option>
                                <option value="13:00"></option>
                                <option value="14:00"></option>
                            </datalist>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="/assets/js/dialogue.js"></script>
</body>
</html>