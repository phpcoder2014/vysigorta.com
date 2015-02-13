<?php
	require_once("includes/db.php");
	$gelen = $_GET['sayfa'];
	
	$sorgu = mysql_query("delete from tbl_teklif_formu where teklif_id='$gelen'");
	if($sorgu){
			echo str_repeat("<br>", 8)."<center><h1>Teklif Silindi..</h1></center>";
			header("Refresh: 2; url=teklif.php");
	}
?>