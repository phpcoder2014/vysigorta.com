<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$referans_link 		= $_POST["referans_link"];
$referans_baslik	= $_POST["referans_baslik"];


$baglan = mysql_query("insert into tbl_subeler (sube_adi,sube_adres) values('$referans_link','$referans_baslik');") or die("Hata Kayit Eklenmedi");
if($baglan){
			echo str_repeat("<br>", 8)."<center><h1>Şube Eklendi..</h1></center>";
			header("Refresh: 2; url=sube.php");
}
?>
