<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$referans_link 		= $_POST["referans_link"];
$referans_baslik	= $_POST["referans_baslik"];
$import				= $_FILES["referans_logo"]["name"];


$baglan = mysql_query("insert into tbl_referans_logo (referans_link,referans_baslik,referans_logo) values('$referans_link','$referans_baslik','$import');") or die("Hata Kayit Eklenmedi");

$baglan = mysql_query("select referans_logo_id from tbl_referans_logo where referans_link='".$referans_link."' and referans_baslik='".$referans_baslik."';") or die("Hata. Uyelik bulunamadı.");
           if($value=mysql_fetch_array($baglan)){
			$id=$value['referans_logo_id'];
			$import= $id."_".$import;
			
			$target_path = "referans_logo/";

$target_path = $target_path . basename( $import); 

		if(move_uploaded_file($_FILES['referans_logo']['tmp_name'], $target_path)) {
			echo str_repeat("<br>", 8)."<center><h1>Referans Gonderildi..</h1></center>";
			header("Refresh: 2; url=index.php");
		} else {
			echo "işlemlerinizde hata var, lütfen tekrar deneyiniz.!";
		}
			
			$baglan = mysql_query("UPDATE tbl_referans_logo SET referans_logo = '$import' where referans_logo_id='$id';") or die("Hata Kayit Eklenmedi");
	
	}
?>
