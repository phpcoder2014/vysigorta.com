<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$makale_baslik 	= $_POST["makale_baslik"];
$makale_detay	= $_POST["makale_detay"];
$zaman			= date("d.my.y H:i:s");
$import			= $_FILES["import"]["name"];
$makale_yazan	= "Abdulrahman Taşçı";

$baglan = mysql_query("insert into tbl_makaleler (makale_baslik,makale_detay,makale_resim,makale_yazan,zaman) values('$makale_baslik','$makale_detay','$import','$makale_yazan','$zaman');") or die("Hata Kayit Eklenmedi");

$baglan = mysql_query("select makale_id from tbl_makaleler where makale_baslik='".$makale_baslik."' and makale_detay='".$makale_detay."' and zaman = '".$zaman."';") or die("Hata. Uyelik bulunamadı.");
           if($value=mysql_fetch_array($baglan)){
			$id=$value['makale_id'];
			$import= "assets/images/data/".$id."_".$import;
			
			$target_path = "../assets/images/data/";

$target_path = $target_path . basename( $import); 

		if(move_uploaded_file($_FILES['import']['tmp_name'], $target_path)) {
			echo str_repeat("<br>", 8)."<center><h1>Makale Gonderildi..</h1></center>";
			header("Refresh: 2; url=index.php");
		} else{
			echo "işlemlerinizde hata var, lütfen tekrar deneyiniz.!";
		}
			
			$baglan = mysql_query("UPDATE tbl_makaleler SET makale_resim = '$import' where makale_id='$id';") or die("Hata Kayit Eklenmedi");
	
			}
?>
