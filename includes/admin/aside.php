<!-- This is a user aside menu -->
<?php
    // NOTE: Since include is just placing the code. we will pass data using variables
    //       using names like $<path>_<component>_<target> is the best practice as shown in the following code:

    $r = $mysqli->execute_query("select first_name, last_name from users where id = ?;",[$_SESSION["user_id"]]);
    $row = $r->fetch_assoc();
    $aside_username = $row["first_name"]." ".$row["last_name"];
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
        [
            "path" => "/admin/groups.php",
            "title" => "Groups"
        ],
        [
            "path" => "/admin/subjects.php",
            "title" => "Subjects"
        ],
        [
            "path" => "/admin/specialities.php",
            "title" => "Specialities"
        ]
    ];

    include("../../includes/aside.php");
?>
<!-- End user aside menu -->
