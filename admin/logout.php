<?php
session_start();
ob_start();
session_destroy();
echo str_repeat("<br>", 8)."<center><h1> Cikis basarili lutfen bekleyiniz..</h1></center>";
header("Refresh: 2; url=login.php");
ob_end_flush();
?>