<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$referans_link 	= $_POST["referans_link"];
$zaman			= date("d.my.y H:i:s");
$import			= $_FILES["import"]["name"];


$baglan = mysql_query("insert into tbl_fotograf (foto_resim,foto_text,foto_zaman) values('$import','$referans_link','$zaman');") or die("Hata Kayit Eklenmedi");

$baglan = mysql_query("select foto_id from tbl_fotograf where foto_text='".$referans_link."' and foto_zaman = '".$zaman."';") or die("Hata. Uyelik bulunamadı.");
           if($value=mysql_fetch_array($baglan)){
			$id=$value['slider_id'];
			$import= $id."_".$import;
			
			$target_path = "admin/photo/";

$target_path = $target_path . basename( $import); 

		if(move_uploaded_file($_FILES['import']['tmp_name'], $target_path)) {
			echo str_repeat("<br>", 8)."<center><h1>Fotoğraf Gonderildi..</h1></center>";
			header("Refresh: 2; url=photo.php");
		} else{
			echo "işlemlerinizde hata var, lütfen tekrar deneyiniz.!";
		}
			
			$baglan = mysql_query("UPDATE tbl_fotograf SET slider_resim = '$import' where slider_id='$id';") or die("Hata Kayit Eklenmedi");
	
			}
?>
