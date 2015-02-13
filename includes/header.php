<?php include_once("includes/db.php"); ?>
<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<title>V-Y Sigorta | Aracılık hizmetleri ltd şti.</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no"/>
	<meta name="google-site-verification" content="29Su2SDFJAmoAZ1GRzJ4GSsafzBSp0pcynaD6zNl04Q" />
	<meta name="description" content="V-Y Sigorta aracılık hizmetleri ltd şit. Kasko, yangın sigortası ve bir çok sigortalama işlemleri">
	<meta name="keywords" content="V-Y Sigorta, aracılık hizmetleri, ltd şit. Kasko, yangın sigortası, ve bir çok ,sigortalama, işlemleri">
	<link rel="stylesheet" href="style.css">
	<link rel="icon" href="favicon.ico" type="image/x-icon"/>
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	<script src="http://code.jquery.com/jquery-1.8.2.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/jquery.color.js"></script>
	<script src="js/custom.js"></script>
	<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
	<script src="js/jquery-easing-1.3.js" type="text/javascript"></script>
	<script src="js/layerslider.kreaturamedia.jquery.js" type="text/javascript"></script>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<script>
	  function initialize() {
		var mapCanvas = document.getElementById('map_canvas1');
		var mapOptions = {
		  center: new google.maps.LatLng(40.191189, 29.208125),
		  zoom: 16,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions)
	  }
	  google.maps.event.addDomListener(window, 'load', initialize);
	</script>
	<script type="text/javascript">
		$(document).ready(function(){
			$('#layerslider').layerSlider({
				autoStart : true,
				hoverPrevNext : false,
				animateFirstLayer	: false,
				thumbnailNavigation : false
			});
		});		
	</script>
</head>
<body><div id="wrapper">
	<header id="header" class="container-fluid">
	  <div class="header-bg">
		<div class="container">
			<div class="decoration dec-left visible-desktop"></div>
			<div class="decoration dec-right visible-desktop"></div>	  
			<div class="row">
				<div id="logo" class="span3"><a href="index.php"><img src="images/logo.png" alt="Medex HTML"/></a></div>
				<div class="span9">
					<!-- Social Icons -->
					<ul class="social-icons">
						<li class="facebook"><a href="https://www.facebook.com/vysigorta">Facebook</a></li>
						<li class="twitter"><a href="http://www.twitter.com/vysigorta">Twitter</a></li>
						<li class="linkedin"><a href="http://www.linkedin.com/profile/view?id=343666086&trk">LinkedIn</a></li>
						<li class="youtube"><a href="http://www.instegram.com/vysigorta">istegram</a></li>
					</ul>	
					<!-- Contact Details -->
					<div class="contact-details visible-desktop">
						<ul>
							<li>Bizi arayın: <a href="#" class="tel">0(224) 372 78 78</a></li>
							<li>Yeni mh. Fatih cad No:12-A Kestel/BURSA</li>
						</ul>
					</div>			
					<!-- Search Form -->
					<div class="search-form">
						<form method="post" action="e-bulten.php">
							<input type="text" value="E-postayla takip edin." name="bulten" class="search-text-box"/>
							<input type="submit" value="" class="search-text-submit"/>
						</form>
					</div>		
				</div>	
			</div>
			<div class="row">
				<div class="span12">
					<div class="select-menu hidden-desktop">
						<select id="selectMenu">
								<option value="trafik-sigorta.php">Trafik Sigortası</option>
								<option value="kasko-sigorta.php">Kasko Sigortası</option>
								<option value="oto-dis-kaza-sigorta.php">Oto Dış Kaza Sigortası</option>
								<option value="yangin-sigortasi.php">Yangın Sigortası</option>
								<option value="nakliyat-sigortasi.php">Nakliyat Sigortası</option>
								<option value="saglik-sigortasi.php">Sağlık Sigortası</option>
								<option value="hukuksal-koruma.php">Hukuksal Koruma</option>
								<option value="zorunlu-deprem.php">Zorunlu Deprem Sigortası</option>
								<option value="tamamlayici-saglik.php">Tamamlayıcı Sağlık Sigortası</option>
								
								<option>Teminat Bilgileri</option>
								<option>Genel Şartlar</option>
								<option>Türkiye'de Sigortacılık</option>
								<option>Dünya'da Sigortacılık</option>
								
								<option value="contact.php">Bize Ulasin</option> 
						</select>
					</div>
					<ul id="menu" class="visible-desktop">
						<li>
							<a href="index.php">Anasayfa</a>
						</li>
						<li><a href="#">Hakkımızda</a>
							<ul> 
								<li><a href="photo.php">Fotoğraflar</a></li>
								<li><a href="about.php">Şirket Profil</a></li>
							</ul>												
						</li>						
						<li><a href="#">Hizmetler</a>
							<ul> 
								<li><a href="trafik-sigorta.php">Trafik Sigortası</a></li>
								<li><a href="kasko-sigorta.php">Kasko Sigortası</a></li>
								<li><a href="oto-dis-kaza-sigorta.php">Oto Dış Kaza Sigortası</a></li>
								<li><a href="yangin-sigortasi.php">Yangın Sigortası</a></li>
								<li><a href="nakliyat-sigortasi.php">Nakliyat Sigortası</a></li>
								<li><a href="saglik-sigortasi.php">Sağlık Sigortası</a></li>
								<li><a href="hukuksal-koruma.php">Hukuksal Koruma</a></li>
								<li><a href="zorunlu-deprem.php">Zorunlu Deprem Sigortası</a></li>
								<li><a href="tamamlayici-saglik.php">Tamamlayıcı Sağlık Sigortası</a></li>
							</ul>
						</li>
						<li>
							<a href="#">Acentelerimiz</a>
							<ul> 
							<?php $sorgu = mysql_query("select * from tbl_referans_logo");
								while($row = mysql_fetch_array($sorgu)){
							?>
								<li><a href="<?php echo $row["referans_link"]; ?>"><?php echo $row["referans_baslik"]; ?></a></li>
							<?php } ?>	
							</ul>
						</li>
						<li>
							<a href="#">Sigortacılık Bilgileri</a>
							<ul> 
								<li><a href="teminat-bilgileri.php">Teminat Bilgileri</a></li>
								<li><a href="genel-sartlar.php">Genel Şartlar</a></li>
								<li><a href="turkiyede-sigortacilik.php">Türkiye'de Sigortacılık</a></li>
								<li><a href="dunyada-sigortacilik.php">Dünya'da Sigortacılık</a></li>
							</ul>
						</li>
						<li><a href="contact.php">Bize Ulasin</a></li> 
					</ul>
				</div>
			</div>
