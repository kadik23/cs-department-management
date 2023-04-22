<?php
    
    $db_server = "db4free.net";
    $db_username = "cs_departement";
    $db_password = "csdm2023";
    $db_name = "cs_departement";
    $db_port = 3306;
    

    $mysqli = new mysqli($db_server, $db_username, $db_password, $db_name, $db_port);
    
    if($mysqli->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    // echo "Database connected successfuly.";

    function is_admin($user_id){
        global $mysqli;
        $query = 'select * from administraters where user_id = ?;';
        $result = $mysqli->execute_query($query, [$user_id]);
        if($result && $result->num_rows > 0){
            return true;
        }
        return false;
    }

    function is_student($user_id){
        global $mysqli;
        $query = 'select * from students where user_id = ?;';
        $result = $mysqli->execute_query($query, [$user_id]);
        if($result && $result->num_rows > 0){
            return true;
        }
        return false;
    }

    function is_teacher($user_id){
        global $mysqli;
        $query = 'select * from teachers where user_id = ?;';
        $result = $mysqli->execute_query($query, [$user_id]);
        if($result && $result->num_rows > 0){
            return true;
        }
        return false;
    }
?>