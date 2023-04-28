<?php 
    include("../database/db_connection.php");
    session_start();

    if(isset($_SESSION["user_id"])){
        $user_id = $_SESSION["user_id"];
        
        if(is_admin($user_id)){
            header('Location: /admin');
            exit();
        }

        if(is_student($user_id)){
            header('Location: /student');
            exit();
        }

        if(is_teacher($user_id)){
            header('Location: /teacher');
            exit();
        }
    }

    $username = $_POST["username"];
    $password = $_POST["password"];

    if(isset($username) && isset($password)){
        $query = "SELECT * FROM students JOIN users on students.user_id = users.id where first_name = ?;";
        $result = $mysqli->execute_query($query, [$username]);
        if($result && $result->num_rows > 0){
            $row = $result->fetch_assoc();
            if(password_verify($password, $row["password"])){
                $_SESSION["user_id"] = $row["user_id"];
                header('Location: /student');
                echo "You are student.";
                exit();
            }
        }

        $query = "SELECT * FROM teachers JOIN users on teachers.user_id = users.id where first_name = ?;";
        $result = $mysqli->execute_query($query, [$username]);
        if($result && $result->num_rows > 0){
            $row = $result->fetch_assoc();
            if(password_verify($password, $row["password"])){
                $_SESSION["user_id"] = $row["user_id"];
                header('Location: /teacher');
                echo "You are teacher.";
                exit();
            }
        }

        $query = "SELECT * FROM administraters JOIN users on administraters.user_id = users.id where first_name = ?;";
        $result = $mysqli->execute_query($query, [$username]);
        if($result && $result->num_rows > 0){
            $row = $result->fetch_assoc();
            if(password_verify($password, $row["password"])){
                $_SESSION["user_id"] = $row["user_id"];
                header('Location: /admin');
                echo "You are admin.";
                exit();
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Computer Science Departement</title>
    <link rel="stylesheet" href="/styles/style.css">
</head>
<body>
    <div class="left-side">
        <div class="image-wrapper">
            <img src="/assets/images/left.jpg" alt="">
        </div>
        <div class="welcom">
            <h1>Welcom to Computer Science Departement</h1>
            <p style="padding-left: 5px; padding-top: 10px; font-size: 14px; line-height: 24px; color: #f0f9ff  ;">
                Access to this system is restricted to authorized users only.
                If you do not have an account, please contact the department
                administrator to request one.   
            </p>
        </div>
    </div>
    <div class="right-side">
        <div class="top-image">
            <img src="/assets/images/top.png" alt="top-image">
        </div>
        <div class="wrapper">
            <form method="POST">
                <label for="username">Username:</label>
                <input type="text" name="username" id="username" placeholder="Username" />
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" placeholder="Password" />
                <button class="btn" type="submit">Login</button>
            </form>
        </div>
    </div>
</body>
</html>