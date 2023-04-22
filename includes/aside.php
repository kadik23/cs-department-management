<aside>
    <div class="user-profile-pic">
        <img src="/assets/images/student.jpg" alt="profile picture">
    </div>
    <div class="user-name"><?php echo $aside_username; ?></div>
    <nav>
        <?php 
            foreach($aside_links as $link){
                if($aside_selected_link === $link["title"]){
                    echo('<a class="aside-selected-link" href="'.$link["path"].'">'.$link["title"].'</a>');
                }else{
                    echo('<a href="'.$link["path"].'">'.$link["title"].'</a>');
                }
            }
            echo('<a href="/logout.php">Log out</a>');
        ?>
    </nav>
</aside>