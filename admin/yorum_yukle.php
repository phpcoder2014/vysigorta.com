<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$referans_link 		= $_POST["referans_link"];
$referans_baslik	= $_POST["referans_baslik"];
$zaman				= date("d.m.y H:i:s");

$baglan = mysql_query("insert into tbl_yorumlar (yorum_baslik,yorum_text,yorum_zaman) 
values('$referans_link','$referans_baslik','$zaman');") or die("Hata Kayit Eklenmedi");
if($baglan){
			echo str_repeat("<br>", 8)."<center><h1>Yorum Eklendi..</h1></center>";
			header("Refresh: 2; url=sigorta.php");
}

?>
