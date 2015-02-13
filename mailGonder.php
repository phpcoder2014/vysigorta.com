<?php session_start(); ?>
<head>
	<meta charset="utf-8">
</head>
<?php
ob_start();
require_once("PHPMailerAutoload.php");
$name					= $_POST['contact_name'];
$email					= $_POST['contact_email'];
$phone					= $_POST['contact_phone'];
$subject				= $_POST['contact_subject'];
$message				= $_POST['contact_message'];
$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPDebug 		 = 0;
$mail->SMTPAuth 		 = true;
$mail->Host 			 = "smtp.gmail.com";
$mail->SMTPSecure 		 = 'ssl';
$mail->CharSet 			 = 'UTF-8';
$mail->Port				 = 465;
$mail->Username			 = "nihatsendil@gmail.com";
$mail->Password 		 = "google3252439";
$mail->SetFrom($subject);
$mail->Subject			 = $subject;
$body 	     			 = $message;
$mail->MsgHTML($body . "<br/><br/><br/>E-posta &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;". $email . "<br/>Adı Soyadı :&nbsp;" . $name . "<br/>Telefon &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;" .$phone);
// hedef adresi ekle
$to = 'vy.sigorta@gmail.com';

$mail->AddAddress($to, "Yeni Bir Mesaj Var.!");
// Maili gönder
if(!$mail->Send())
{
echo "Mailer Hata: " . $mail->ErrorInfo;
}
else
{
"<script>alert('Mesaj gonderildi..');</script>";
header('refresh: 1; url=contact.php'); 
}
ob_end_flush();
?>

