<?php
    
    $db_server = "localhost";
    $db_username = "abdelfetah-dev";
    $db_password = "Abdelfat";
    $db_name = "cs-departement-management";
    $db_port = 3306;
    
    /*  
    $db_server = "localhost";
    $db_username = "id20569367_csdm";
    $db_password = "B/EVjF7[L/&VZ76~";
    $db_name = "id20569367_cs_departement";
    $db_port = 3306;
    */

    // NOTE: DO_NOT_TOUCH, This is a hack for old php servers, that have a php version below '8.2.0'
    //       because of 'execute_query' method in mysqli class is available only in '8.2.0' and above.
    $PHP_VERSION = phpversion(null);
    if($PHP_VERSION[2] < '2'){
        class mysqli_for_old_php extends mysqli {
            public function execute_query($query, $arr){
                $r = "";
                foreach($arr as $item){
                    if(gettype($item) == "string"){
                        $r .= "s";
                    }
                    if(gettype($item) == "integer"){
                        $r .= "i";
                    }
                }
                $stmt = $this->prepare($query);
                $stmt->bind_param($r, ...$arr);
                $stmt->execute();
                $result = $stmt->get_result();
                return $result;
            }
        }
        $mysqli = new mysqli_for_old_php($db_server, $db_username, $db_password, $db_name, $db_port);
    }else{
        $mysqli = new mysqli($db_server, $db_username, $db_password, $db_name, $db_port);
    }
    
    if($mysqli->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    // echo "Database connected successfuly.";

    /*

    // NOTE: Since 000webhost do not support php 8.2 yet, This is the alternative implementation of 'execute_query' method.
    class Test extends mysqli {
        public function execute_query($query, $arr){
            $r = "";
            foreach($arr as $item){
                if(gettype($item) == "string"){
                    $r .= "s";
                }
                if(gettype($item) == "integer"){
                    $r .= "i";
                }
            }
            $stmt = $this->prepare($query);
            $stmt->bind_param($r, ...$arr);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result;
        }
    }
    
    */

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