<html>
    <head>
        <title>LightDiscordClient</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <p>Welcome, <?php if(isset($_GET["username"])) {$username = $_GET["username"];} echo $username ?>#<?php if(isset($_GET["discrim"])) {$discrim = $_GET["discrim"];} echo $discrim ?><br><br>Your user ID: <?php if(isset($_GET["id"])) {$id = $_GET["id"];} echo $id ?></p>
        <a href="serverlist.php?auth=<?php if(isset($_GET["auth"])) {$auth = $_GET["auth"];} echo $auth ?>">Go to your server list</a>
        <br>
        <a href="dms.php?auth=<?php if(isset($_GET["auth"])) {$auth = $_GET["auth"];} echo $auth ?>">Go to your DMs</a>
    </body>
</html>
