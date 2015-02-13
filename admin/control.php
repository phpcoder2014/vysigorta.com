<?php
ob_start();
session_start();
include("includes/db.php");


$kullanici_adi = $_POST["kullanici_adi"];
$parola = $_POST["parola"];

$sorgula = mysql_query("SELECT * FROM tbl_uyeler WHERE kullanici_adi='$kullanici_adi' and parola='$parola'") or die (mysql_error());

$uye_varmi = mysql_num_rows($sorgula);
if($uye_varmi > 0)
{
$_SESSION["login"] = "true";
$_SESSION["kullanici_adi"] = $kullanici_adi;
$_SESSION["parola"] = $parola;


setcookie("kullanici_adi",$kullanici_adi,time()+60*60*24);

echo str_repeat("<br>", 8)."<center><h1> Giris basarili lutfen bekleyiniz..</h1></center>";
header("Refresh: 2; url=index.php");
}
else
{		
echo str_repeat("<br>", 8)."<center><h1> Kullanici adi veya parola hatali!</h1></center>";
header("Refresh: 2; url=login.php");
	
}
ob_end_flush();
?>