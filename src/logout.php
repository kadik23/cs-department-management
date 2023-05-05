<?php 
    session_start();
    session_destroy();
    header('Location: /');
    echo "Loggin out user_id: ".$_SESSION["user_id"];
?>