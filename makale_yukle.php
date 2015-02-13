<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$contact_no 		= $_POST["contact_no"];
$contact_name		= $_POST["contact_name"];
$contact_lastname	= $_POST["contact_lastname"];
$contact_home_phone	= $_POST["contact_home_phone"];
$contact_city		= $_POST["contact_city"];
$contact_address	= $_POST["contact_address"];
$contact_mobile_phone	= $_POST["contact_mobile_phone"];
$contact_city_small	= $_POST["contact_city_small"];
$sigorta_turu		= $_POST["sigorta_turu"];
$contact_address	= $_POST["contact_address"];
$vade_hatirlatma	= $_POST["vade_hatirlatma"];
$contact_message	= $_POST["contact_message"];
$zaman				= date("d.my.y H:i:s");


$baglan = mysql_query("insert into tbl_teklif_formu (tc_no,adi,soyadi,ev_telefon,cep_telefon,adres,il,ilce,mesaj,sigorta_turu,vade_hatirlatma,zaman) 
values('$contact_no','$contact_name','$contact_lastname','$contact_home_phone','$contact_mobile_phone','$contact_address','$contact_city','$contact_city_small','$contact_message','$sigorta_turu','$vade_hatirlatma','$zaman');") or die("Hata Kayit Eklenmedi");
if($baglan){
echo '<script>alert("Teklifiniz gönderildi..");</script>';
header("Refresh: 1; url=index.php");
}else{
	echo "bilgiler gönderilmedi";
}
?>
