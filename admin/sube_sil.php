<?php
	require_once("includes/db.php");
	$gelen = $_GET['sayfa'];
	
	$sorgu = mysql_query("delete from tbl_subeler where sube_id='$gelen'");
	if($sorgu){
			echo str_repeat("<br>", 8)."<center><h1>Slider Silindi..</h1></center>";
			header("Refresh: 2; url=sube.php");
	}
?>