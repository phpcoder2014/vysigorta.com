<?php
	require_once("includes/db.php");
	$gelen = $_GET['sayfa'];
	
	$sorgu = mysql_query("delete from tbl_referans_logo where referans_logo_id='$gelen'");
	if($sorgu){
			echo str_repeat("<br>", 8)."<center><h1>Slider Silindi..</h1></center>";
			header("Refresh: 2; url=index.php");
	}
?>