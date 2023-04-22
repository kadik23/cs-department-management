<?php 
    include("../../database/db_connection.php");
    include("../../includes/admin/route_protection.php");

    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $account_type = $_POST["account_type"];
    
    // TODO: Only admin can perform this task.
    if(isset($first_name) && isset($last_name) && isset($email) && isset($password) && isset($account_type)){
        // Check if user exist.
        $query = "SELECT * FROM users where first_name=? and last_name=? and email=?;";
        $result = $mysqli->execute_query($query, [$first_name, $last_name, $email]);
        if($result){
            if($result->num_rows > 0){
                $alert_message = "User alredy exist.";
            }else{
                $hashed_password = password_hash($password, null);
                // Create user.
                $query = "INSERT INTO users (first_name, last_name, email, password) values (?,?,?,?);";
                $result = $mysqli->execute_query($query, [$first_name, $last_name, $email, $hashed_password]);
                $user_id = $mysqli->insert_id;
                // Switch statemnt on account_type
                switch($account_type){
                    case "teacher":
                        $query = "INSERT INTO teachers (user_id) values (?);";
                        $result = $mysqli->execute_query($query,[$user_id]);
                        if($result){
                            $alert_message = "User created successfuly.";
                        }
                        break;
                }
            }
        }
    }

    $account_type = $_GET["account_type"];
    if(isset($account_type)){
        switch($account_type){
            case "student":
                $qeury = "SELECT * FROM users join students on students.user_id = users.id;";
                break;
            case "teacher":
                $qeury = "SELECT * FROM users join teachers on teachers.user_id = users.id;";
                break;
            default:
                $qeury = "SELECT * FROM users;";
                break;
        }
        $result = $mysqli->query($qeury);
    }else{
        $qeury = "SELECT * FROM users;";
        $result = $mysqli->query($qeury);
    }

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

                    <!--
                        TODO: Show total users.
                        <div class="total-accounts">2565 Users</div>
                    -->
    
                    <div class="row">
                        <button id="open-dialogue-btn" class="btn">Create new account</button>
                    </div>

                    <div class="accounts-header">
                        <div class="custom-select" style="width:200px;">
                            <select id="account-type">
                                <option value="0">Select Account type:</option>
                                <option value="all">All</option>
                                <option value="admin">Admin</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                        <div class="search">
                            <input type="text" placeholder="search..." />
                            <div class="search-icon">
                                <img src="/assets/icons/search.svg" alt="search-icon" />
                            </div>
                        </div>
                    </div>                    

                    <div class="list">
                        <div class="list-header">
                            <div class="list-header-item">Profile Picture</div>
                            <div class="list-header-item">User id</div>
                            <div class="list-header-item">First name</div>
                            <div class="list-header-item">Last name</div>
                            <div class="list-header-item" style="flex: 2;">Email</div>
                        </div>
                        <div class="list-body">
                            <?php
                                if($result && $result->num_rows > 0){
                                    while($row = $result->fetch_assoc()) {
                                        echo '<div class="list-row">
                                            <div class="list-item">
                                                <img class="user-profile-picture" src="/assets/images/student.jpg" alt="">
                                            </div>
                                            <div class="list-item">'.$row["id"].'</div>
                                            <div class="list-item">'.$row["first_name"].'</div>
                                            <div class="list-item">'.$row["last_name"].'</div>
                                            <div class="list-item" style="flex: 2;">'.$row["email"].'</div>
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
                <?php
                    $tabs = [
                        [
                            "title" => "Student",
                            "content" => '
                                <form method="POST" class="create-account-body">
                                    <div class="create-account-input">
                                        <label>First name:</label>
                                        <input type="text" name="first_name" id="first_name">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Last name:</label>
                                        <input type="text" name="last_name" id="last_name">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Email:</label>
                                        <input type="text" name="email" id="email">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Password:</label>
                                        <input type="password" name="password" id="password">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Acadimic level:</label>
                                        <div class="custom-select" style="width:200px;">
                                            <select name="acadimic_level" id="acadimic_level">
                                                <option value="0">Select Acadimic level:</option>
                                                <option value="l1">L1 Informatique</option>
                                                <option value="admin">L2 Informatique</option>
                                                <option value="student">L3 Informatique</option>
                                                <option value="teacher">M1 Software engineer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input value="student" type="hidden" name="account_type" id="account_type" disabled />
                                    <button type="submit" class="btn create-btn">Create</button>
                                </form>
                            ',
                        ],
                        [
                            "title" => "Teacher",
                            "content" => '
                                <form method="POST" class="create-account-body">
                                    <div class="create-account-input">
                                        <label>First name:</label>
                                        <input type="text" name="first_name" id="first_name">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Last name:</label>
                                        <input type="text" name="last_name" id="last_name">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Email:</label>
                                        <input type="text" name="email" id="email">
                                    </div>
                                    <div class="create-account-input">
                                        <label>Password:</label>
                                        <input type="password" name="password" id="password">
                                    </div>
                                    <input value="teacher" type="hidden" name="account_type" id="account_type" disabled />
                                    <button type="submit" class="btn create-btn">Create</button>
                                </form>
                            '
                        ]
                    ];
                    include("../../includes/tabs.php");
                ?>
            </div>
        </div>
            
        <!--
            <div id="dialogue-body" class="create-account">
                <div class="create-account-header">
                    <div class="create-account-title">Create new account</div>
                    <div id="close-dialogue-btn">Close</div>
                </div>
                <form method="POST" class="create-account-body">
                    <div class="create-account-input">
                        <label>First name:</label>
                        <input type="text" name="first_name" id="first_name">
                    </div>
                    <div class="create-account-input">
                        <label>Last name:</label>
                        <input type="text" name="last_name" id="last_name">
                    </div>
                    <div class="create-account-input">
                        <label>Email:</label>
                        <input type="text" name="email" id="email">
                    </div>
                    <div class="create-account-input">
                        <label>Password:</label>
                        <input type="password" name="password" id="password">
                    </div>
                    <div class="create-account-type">
                        <label>Account Type:</label>
                        <select class="account-select" name="account_type" id="account_type">
                            <option class="account-option" value="admin">admin</option>
                            <option class="account-option" value="student">student</option>
                            <option class="account-option" value="teacher">teacher</option>
                        </select>
                    </div>
                    <button type="submit" class="btn create-btn">Create</button>
                </form>
            </div>
        -->
    </div>
    
    <?php
        if(isset($alert_message)){
            echo '<div class="dialogue-alert-message">'.$alert_message.'</div>';
        }
    ?>

    <script src="/assets/js/custom-select.js"></script>
    <script src="/assets/js/dialogue.js"></script>
    <script src="/assets/js/tabs.js"></script>
    <script>
        let account_type = document.getElementById("account-type");
        account_type.onselect = (target) => {
            window.location.search = "?account_type="+target.toLocaleLowerCase();
        }    
    </script>
</body>
</html>