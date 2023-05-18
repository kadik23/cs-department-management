<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $querys_map = [
        "accounts" => "select users.id as user_id, username, first_name, last_name, email from users;",
        "teachers" => "select users.id as user_id, username, first_name, last_name, email from teachers join users on teachers.user_id = users.id;",
        "students" => "select users.id as user_id, username, first_name, last_name, email from students join users on students.user_id = users.id;",
        "admins" => "select users.id as user_id, username, first_name, last_name, email from users where id not in (select user_id from students) and id not in (select user_id from teachers);"
    ];

    $search_querys = [
        "accounts" => "select users.id as user_id, username, first_name, last_name, email from users where username like concat('%',?,'%') or first_name like concat('%',?,'%') or last_name like concat('%',?,'%') or email like concat('%',?,'%');",
        "teachers" => "select users.id as user_id, username, first_name, last_name, email from teachers join users on teachers.user_id = users.id where username like concat('%',?,'%') or first_name like concat('%',?,'%') or last_name like concat('%',?,'%') or email like concat('%',?,'%');",
        "students" => "select users.id as user_id, username, first_name, last_name, email from students join users on students.user_id = users.id where username like concat('%',?,'%') or first_name like concat('%',?,'%') or last_name like concat('%',?,'%') or email like concat('%',?,'%');",
        "admins" => "select users.id as user_id, username, first_name, last_name, email from users where id not in (select user_id from students) and id not in (select user_id from teachers) and (username like concat('%',?,'%') or first_name like concat('%',?,'%') or last_name like concat('%',?,'%') or email like concat('%',?,'%'));"
    ];

    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $account_type = $_POST["account_type"];
    $acadimic_level_id = $_POST["acadimic_level_id"];
    
    if(isset($first_name) && isset($last_name) && isset($username) && isset($email) && isset($password) && isset($account_type)){
        // Check if user exist.
        $query = "SELECT * FROM users where username=?;";
        $result = $mysqli->execute_query($query, [$username]);
        if($result){
            if($result->num_rows > 0){
                $error_message = "User alredy exist.";
            }else{
                if($account_type == "student" && !isset($acadimic_level_id)){
                    $error_message = "Acadimic level input not set";
                }else{
                    $hashed_password = password_hash($password, null);
                    // Create user.
                    $query = "INSERT INTO users (first_name, last_name, username, email, password) values (?,?,?,?,?);";
                    $result = $mysqli->execute_query($query, [$first_name, $last_name, $username,$email, $hashed_password]);
                    $user_id = $mysqli->insert_id;
                    // Switch statemnt on account_type
                    switch($account_type){
                        case "teacher":
                            $query = "INSERT INTO teachers (user_id) values (?);";
                            $result = $mysqli->execute_query($query,[$user_id]);
                            if($result){
                                $success_message = "User created successfuly.";
                            }
                            break;
                        case "student":
                            $query = "INSERT INTO students (user_id, acadimic_level_id) values (?,?);";
                            $result = $mysqli->execute_query($query,[$user_id, $acadimic_level_id]);
                            if($result){
                                $success_message = "User created successfuly.";
                            }
                            break;
                    }
                }
            }
        }
    }

    
    $account_type = $_GET["account_type"];
    if(isset($account_type)){
        if(isset($_POST["search"])){
            $search = $_POST["search"];
            $result = $mysqli->execute_query((isset($search_querys[$account_type])) ? $search_querys[$account_type] : $search_querys["accounts"],[$search, $search, $search, $search]);
        }else{
            $result = $mysqli->query(isset($querys_map[$account_type]) ? $querys_map[$account_type] : $querys_map["accounts"]);
        }
    }else{
        if(isset($_POST["search"])){
            $search = $_POST["search"];
            $result = $mysqli->execute_query($search_querys["accounts"],[$search, $search, $search, $search]);
        }else{
            $result = $mysqli->query($querys_map["accounts"]);
        }
    }

    $acadimic_levels_r = $mysqli->query("select acadimic_levels.id as id, specialities.speciality_name as speciality_name, acadimic_levels.level as level from acadimic_levels join specialities on acadimic_levels.speciality_id = specialities.id;");


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Computer Science Departement</title>
    <link rel="stylesheet" href="/styles/accounts.css">
    <link rel="stylesheet" href="/styles/admin.css">
    <link rel="stylesheet" href="/styles/aside.css">
    <link rel="stylesheet" href="/styles/custom-select.css">
    <link rel="stylesheet" href="/styles/dialogue.css">
    <link rel="stylesheet" href="/styles/list.css">
    <link rel="stylesheet" href="/styles/search.css">
    <link rel="stylesheet" href="/styles/tabs.css">
</head>
<body>
    <div class="container">

        <?php
            $aside_selected_link = "Accounts";
            include("../../includes/admin/aside.php");
        ?>
        
        <div class="page-content">
            <div class="page-header">
                <div class="page-title">Accounts</div>
            </div>
            <div class="section-wrapper">
                <div class="section-content">
                    <div class="row">
                        <button class="open-dialogue-btn btn" >Create new account</button>
                    </div>

                    <div class="accounts-header">
                        <div class="custom-select" style="width:200px;">
                            <select id="account-type">
                                <?php
                                    if(isset($_GET["account_type"])){
                                        echo '<option value="0">'.$account_type.'</option>';
                                    }else{
                                        echo '<option value="0">Select Account type:</option>';
                                    }
                                    $account_types = ["all","admins","students","teachers"];
                                    foreach($account_types as $t){
                                        if($account_type != $t){
                                            echo '<option value="'.$t.'">'.$t.'</option>';
                                        }
                                    }
                                ?>
                            </select>
                        </div>
                        <form method="POST" class="search">
                            <input type="text" name="search" placeholder="search..." value="<?= $_POST["search"] ?>"/>
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </form>
                    </div>                    

                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Profile Picture</div>
                            <div class="list-header-item">User id</div>
                            <div class="list-header-item" style="flex: 2;">username</div>
                            <div class="list-header-item" style="flex: 2;">First name</div>
                            <div class="list-header-item" style="flex: 2;">Last name</div>
                            <div class="list-header-item" style="flex: 3;">Email</div>
                        </div>
                        <div id="list_body" class="list-body">
                            <?php
                                if($result && $result->num_rows > 0){
                                    while($row = $result->fetch_assoc()) {
                                        echo '<div class="list-row">
                                            <div class="list-item">
                                                <img class="user-profile-picture" src="/assets/images/student.jpg" alt="">
                                            </div>
                                            <div class="list-item">'.$row["user_id"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["username"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["first_name"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["last_name"].'</div>
                                            <div class="list-item" style="flex: 3;">'.$row["email"].'</div>
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
    
    <div id="dialogue" class="dialogue">
        <div class="dialogue-inner">
            <div class="dialogue-header">
                <div class="dialogue-title">Create new account</div>
                <div class="dialogue-close-btn" id="dialogue-close-btn">Close</div>
            </div>
            <div class="dialogue-body">
                <div class="create-account">
                    <form method="POST" class="student-account">
                        <div class="student-title">Student</div>
                        <input type="hidden" name="account_type" id="account_type" value="student" />
                        <div class="input-group">
                            <label for="first_name">First Name:</label>
                            <input type="text" name="first_name" id="first_name" placeholder="First name" />
                        </div>

                        <div class="input-group">
                            <label for="last_name">Last Name:</label>
                            <input type="text" name="last_name" id="last_name" placeholder="Last name" />
                        </div>

                        <div class="input-group">
                            <label for="username">Username:</label>
                            <input type="text" name="username" id="username" placeholder="username" required="true"/>
                        </div>

                        <div class="input-group">
                            <label for="email">Email:</label>
                            <input type="text" name="email" id="email" placeholder="Email" />
                        </div>

                        <div class="input-group">
                            <label for="password">Password:</label>
                            <input type="text" name="password" id="password" placeholder="password" />
                        </div>

                        <div class="input-group">
                            <label for="speciality">Speciality:</label>
                            <input type="text" class="selected_input" list="speciality-list" placeholder="speciality" />
                            <input type="hidden" class="hidden_selected_input" list="speciality-list" id="acadimic_level_id" name="acadimic_level_id" placeholder="speciality" />
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
                        
                        <button type="submit" class="btn">Create Student Account</button>
                    </form>
                    <form method="POST" class="teacher-account">
                        <div class="teacher-title">Teacher</div>
                        <input type="hidden" name="account_type" id="account_type" value="teacher" />
                        
                        <div class="input-group">
                            <label for="first_name">First Name:</label>
                            <input type="text" name="first_name" id="first_name" placeholder="First name" />
                        </div>

                        <div class="input-group">
                            <label for="last_name">Last Name:</label>
                            <input type="text" name="last_name" id="last_name" placeholder="Last name" />
                        </div>
                        
                        <div class="input-group">
                            <label for="username">Username:</label>
                            <input type="text" name="username" id="username" placeholder="username" required="true"/>
                        </div>
                        
                        <div class="input-group">
                            <label for="email">Email:</label>
                            <input type="text" name="email" id="email" placeholder="Email" />
                        </div>

                        <div class="input-group">
                            <label for="password">Password:</label>
                            <input type="text" name="password" id="password" placeholder="password" />
                        </div>

                        <button type="submit" class="btn">Create Teacher Account</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
   <?php include("../../includes/admin/alert_message.php")  ?>

    <script src="/assets/js/custom-select.js"></script>
    <script src="/assets/js/dialogue.js"></script>
    <script src="/assets/js/tabs.js"></script>
    <script src="/assets/js/select.js"></script>
    <script src="/assets/js/list.js"></script>
    <script src="/assets/js/accounts.js"></script>
</body>
</html>