<?php
	require_once("includes/db.php");
	$gelen = $_GET['sayfa'];
	
	$sorgu = mysql_query("delete from tbl_yorumlar where yorum_id='$gelen'");
	if($sorgu){
			echo str_repeat("<br>", 8)."<center><h1>Yorum Silindi..</h1></center>";
			header("Refresh: 1; url=sigorta.php");
	}
?>