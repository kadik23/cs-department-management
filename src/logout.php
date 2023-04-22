<?php 
    session_start();
    echo "user_id: ".$_SESSION["user_id"];
    session_destroy();
    header('Location: /');
?>