<?php
    if(isset($error_message)){
        echo '<div class="dialogue-alert-message alert-error">'.$error_message.'</div>';
    }

    if(isset($success_message)){
        echo '<div class="dialogue-alert-message alert-success">'.$success_message.'</div>';
    }
?>