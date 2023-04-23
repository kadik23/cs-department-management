<!-- This is a user aside menu -->
<?php
    // NOTE: Since include is just placing the code. we will pass data using variables
    //       using names like $<path>_<component>_<target> is the best practice as shown in the following code:

    $aside_username = "Adminstrater Name";
    $aside_links = [
        [
            "path" => "/admin",
            "title" => "Dashboard",
        ],[
            "path" => "/admin/accounts.php",
            "title" => "Accounts",
        ],
        [
            "path" => "/admin/schedules.php",
            "title" => "Schedules",
        ],
        [
            "path" => "/admin/lectures.php",
            "title" => "Lectures",
        ],
        [
            "path" => "/admin/resources.php",
            "title" => "Resources",
        ],
        [
            "path" => "/admin/students.php",
            "title" => "Students"
        ],
    ];

    include("../../includes/aside.php");
?>
<!-- End user aside menu -->
