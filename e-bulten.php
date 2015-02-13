<meta charset="utf-8">
<?php
error_log("E_ALL");

include("includes/db.php");

$mailing 		= $_POST["bulten"];
$zaman			= date("d.my.y H:i:s");


$baglan = mysql_query("insert into tbl_ebulten (mail_add,zaman) values('$mailing','$zaman');") or die("Hata Kayit Eklenmedi");
if($baglan){
echo '<script>alert("Bültenimize kaydoldunuz..");</script>';
header("Refresh: 1; url=index.php");
}else{
	echo "bilgiler gönderilmedi";
}
?>
