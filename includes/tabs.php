<div class="tabs">
    <div class="tabs-header">
        <?php
            foreach($tabs as $tab){
                echo "<div class='tab'>".$tab["title"]."</div>";
            }
        ?>
    </div>
    <div class="tabs-body">
        <?php
            foreach($tabs as $tab){
                echo "<div class='tab-content'>".$tab["content"]."</div>";
            }
        ?>
    </div>
</div>