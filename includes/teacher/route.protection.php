<?php
    // NOTE: This will only work when it included after db_connection.php.
    session_start();
    if(isset($_SESSION["user_id"])){
        $user_id = $_SESSION["user_id"];
        if(!is_teacher($user_id)){
            header('Location: /');
        }
    }else{
        header('Location: /');
        exit();
    }
    
?>