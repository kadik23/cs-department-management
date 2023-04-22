 <!-- This is a user aside menu -->
 <?php
    // NOTE: Since include is just placing the code. we will pass data using variables
    //       using names like $<path>_<component>_<target> is the best practice as shown in the following code:
    $aside_username = "Student Name";
    $aside_links = [
        [
            "path" => "/student",
            "title" => "Dashboard",
        ],[
            "path" => "/student/schudeler.php",
            "title" => "Schudeler",
        ],
        [
            "path" => "/student/notes.php",
            "title" => "Notes",
        ]
    ];
    include("../../includes/aside.php")
?>
<!-- End user aside menu -->