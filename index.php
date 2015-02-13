<?php require_once("includes/db.php"); ?>
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
<body>
<div id="wrapper">
	<header id="header" class="container-fluid main">
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
							<option selected value="index.php">ANA MENU</option>
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
					<?php include_once("includes/menu.php"); ?>
				</div>
			</div>
			<div class="row">
				<div class="span12 main-slider">
					<div id="layerslider-container">	
						<div id="layerslider" style="width:100%; height:380px;">
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/50.png" class="ls-bg" style="right:0px;slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/32.png"/></div>
								<img alt="" src="images/gallery/32.png" class="ls-s6 visible-phone" style="top:0px; left:80%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<a href="saglik-sigortasi.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Karşılaşabileceğiniz bir sağlık probleminde veya bir kaza sonucu yaralanmanız halinde ayakta ya da yatarak yapılacak hastane tedavi giderleriniz</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Sağlık Sigortası</div>
							</div>
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/50.png" class="ls-bg" style="slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/33.png"/></div>
								<img alt="" src="images/gallery/33.png" class="ls-s6 visible-phone" style="top:0px; left:70%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<a href="kasko-sigorta.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Sigortalı aracın çalınmasında sigortalı aracın tamamen veya kısmen çalınması veya çalınmasına teşebbüs edilmesi neticesinde meydana gelen ziya ve hasarlar..</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Kasko Sigortası</div>
							</div>
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/53.png" class="ls-bg" style="slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/34.png"/></div>
								<img alt="" src="images/gallery/34.png" class="ls-s6 visible-phone" style="top:0px; left:70%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;">
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;">
								<a href="trafik-sigorta.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Motorlu aracın işletilmesi sırasında, üçüncü şahısların ölümü, yaralanması ve maddi zararlara sebebiyet verilmesi halinde...</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Trafik Sigortası</div>
							</div>
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/54.png" class="ls-bg" style="slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/dask.png"/></div>
								<img alt="" src="images/gallery/dask.png" class="ls-s6 visible-phone" style="top:0px; left:70%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<a href="zorunlu-deprem.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Bu sigorta ile, depremin doğrudan neden olduğu maddi zararlar ile deprem sonucu meydana gelen yangın, infilak, dev dalga (tsunami) veya yer kaymasının gibi..</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Zorunlu Deprem Sigortası</div>
							</div>
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/54.png" class="ls-bg" style="slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/bes.png"/></div>
								<img alt="" src="images/gallery/bes.png" class="ls-s6 visible-phone" style="top:0px; left:70%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<a href="bes-emeklilik.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Bireysel emeklilik sistemine katılarak, düzenli gelir elde ettiğiniz bugünlerde, geleceğiniz için küçük birikimler ayırarak, o hayalini kurduğunuz emekliliğe ulaşabilirsiniz..</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Bireysel Emeklilik</div>
							</div>
							<div class="ls-layer" style="slidedelay:4000">
								<img alt="" src="images/54.png" class="ls-bg" style="slidedisrection : fade; durationin : 1000; durationout : 1000; easingin : easeOutExpo; delayin :0;">
								<div class="ls-s1 hidden-phone" style="top:0px; left:0px; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"><img alt="" src="images/gallery/ates.png"/></div>
								<img alt="" src="images/gallery/ates.png" class="ls-s6 visible-phone" style="top:0px; left:70%; slidedirection : right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<img alt="" src="images/51.png" class="ls-s2" style="top:80px; left:35px; slidedirection : left; slideoutdirection : left; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 1000;"/>
								<a href="yangin-sigortasi.php" class="ls-s3" style="top:230px; left:190px; slidedirection : bottom; slideoutdirection : bottom; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Detaylar</a>
								<div class="ls-s4 hidden-phone" style="top:160px; left:150px; slidedirection :right; slideoutdirection : right; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Yangın sigortası ile, aşağıdaki durumlarda ortaya çıkan maddi zararlar, sigorta bedeline kadar güvence altına alınmaktadır.</div>
								<div class="ls-s5" style="top:100px; left:120px; slidedirection :top; slideoutdirection :top; durationin : 2000; durationout : 1500; easingin : easeOutElastic; easingout : easeInOutQuint; delayin : 2500;">Yangın Sigortası</div>
							</div>
						</div>		
					</div>			
				</div>
			</div>
		</div>
	  </div>
	</header>
	<section id="content" class="container-fluid">
	<div class="container">
		<div class="row">
			<div class="span9">
				<h1>Sigortalarla ilgili bilgi ve fiyat teklifi almak için formu doldurun.</h1>
				<span class="purchase">Firmamızın sıcak ve güleryüzü ile hemen irtibat kurun aklınızdaki sorulardan kurtulun.</span>
			</div>
			<div class="span3 aligncenter"><a href="teklif-formu.php" class="button large red">Hemen Teklif Al</a></div>
			<div class="span3 aligncenter"><a href="kaza_tespit_tutanagi.pdf" class="button large blue">Kaza Tespit Tutanağı</a></div>
		</div>
		<div class="row">
			<div class="span12">
				<div class="row">
					<div class="span3">
						<a href="yangin-sigortasi.php" class="link-block">
							<span class="move-item icon-1 move-bg-icon"></span>
							<h2 class="move-item">Yangın Sigortası</h2>
							<p class="move-item">Bu sözleşme ile sigorta edilmiş şeylerde meydana gelen zararın miktarı taraflar arasında yapılacak anlaşmayla tespit edilir. </p>
						</a>
					</div>
					<div class="span3">
						<a href="kasko-sigorta.php" class="link-block">
							<span class="move-item icon-2 move-bg-icon"></span>
							<h2 class="move-item">Kasko Sigortası</h2>
							<p class="move-item">Kasko Sigortası, karayollarında hareket eden her türlü nakil aracınızın gerek hareket ve durma halindeyken güvenceye alır. </p>
						</a>
					</div>
					<div class="span3">
						<a href="saglik-sigortasi.php" class="link-block">
							<span class="move-item icon-3 move-bg-icon"></span>
							<h2 class="move-item">Sağlık Sigortası</h2>
							<p class="move-item">Sağlık Sigortaları,doğum giderleriniz ve yeni doğan bebek bakımı hizmetinin yanısıra Mamografi gibi sağlık hizmetleri de sunar. </p>
						</a>
					</div>
					<div class="span3">
						<a href="hukuksal-koruma.php" class="link-block">
							<span class="move-item icon-4 move-bg-icon"></span>
							<h2 class="move-item">Hukuksal Koruma</h2>
							<p class="move-item">Bu sözleşme ile sigortalıya poliçede gösterilecek olan aşağıdaki hallerden biri veya birkaçı ve bütünü için hukuksal koruma sağlanabilir.</p>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="title"><h2>Hukuksal Koruma</h2></div>
		<p>Kasko teminatına giren bir hasar ile ilgili sigortalının taraf olduğu ve sigorta sözleşmesi ile saptanan konular kapsamındaki hukuksal sorunların halledilmesine yönelik harcamaları , vekalet ücreti, dava masrafları,danışmalık ücreti, hakem ücreti, teminat akçesi, icra masrafı, temyiz, karar düzeltme, ihtarname ücretleri, tespit masrafları, ihtarname çekimi, dilekçe yazımı ile ilgili masraflarını poliçede yazılı limitler dahilinde karşılar.Hukuksal Koruma Teminatı Motorlu Araca Bağlı Hukuksal Koruma ve Sürücü Hukuksal Koruma teminatları adı altında verilmektedir..</p>
		 

		<blockquote>"Sigorta bedelinin tespitinde, sigorta edilen meskenin yapı tarzı için Hazine Müsteşarlığınca yayımlanan "Zorunlu Deprem Sigortası Tarife ve Talimatı"nda belirlenen metrekare bedeli ile aynı meskenin brüt yüzölçümünün (veya yaklaşık yüzölçümünün) çarpılması sonucu bulunan tutar esas alınır."</blockquote>
		<div class="row">
			<div class="span4">
				<div class="title"><h2>Haftalık çalışma saatleri</h2></div>
				<p><i>Pazartesi sabah 08:30 den akşam 18:30'a kadar hizmetinizdeyiz. Her türlü işlem ve sorunlarınız için telefonlarımızdan bize ulaşabilirsiniz.</i></p>
				<p>
				<span class="phone contact">0(224) 372 78 78</span>
				<span class="phone contact">0(224) 372 56 08</span>
				<span class="phone contact">0(552) 372 78 78</span>
				<span class="phone contact">0(532) 172 16 16</span>
				<a href="mailto:vysigorta@vysigorta.com" class="email contact">vysigorta@vysigorta.com</a>
				</p>
				<a href="contact.php" class="button small red">7/24 Bize yazın</a>
			</div>
			<div class="span4">
				<div class="title"><h2>Acil Yardım ve Hasar Destek</h2></div>
				<ul class="service-list">
					<li>Axa Sigorta  Destek Hattı : 0850 250 9999</li>
					<li>Anadolu Sigorta Hattı : 0850 724 0850</li>
					<li>HDI Sigorta Destek : 444 8 434</li>
					<li>Ak Sigorta Destek  : 444 27 27</li>
					<li>Dubai Starr Sigorta Destek : 444 1 347</li>
					<li>Türk Nippon Sigorta Destek : 444 8 867</li>
					<li>ING Emeklilik Destek : 444 1 666</li>
					<li>Mapfre Kasko Destek : 0212 346 0666</li>
					<li>Mapfre Kasko Jet Yardım : 0212 705 5555</li>
					<li>Mapfre Kasko Ev Yardım : 0212 253 7777</li>
				</ul>
			</div>
			<div class="span4">
				<div class="title"><h2>Müşterilerimiz ne diyor:</h2></div>
				<div class="carousel slide review-slider" id="MeetOurDoctor4">
				<div class="blockquote-line"><div class="blockquote-pattern"></div></div>
					<div class="carousel-inner review-inner">
					<?php $sorgu = mysql_query("select * from tbl_yorumlar");
						while($row = mysql_fetch_array($sorgu)){
					?>	
						<div class="active item">
							<div class="blockquote"><?php echo $row["yorum_text"]; ?><br /><?php echo $row["yorum_zaman"]; ?></div>
						</div>
					</div>
					<?php } ?>
					<a class="prew-slide nav-slider" href="#MeetOurDoctor4" data-slide="prev">&lsaquo;</a>
					<a class="next-slide nav-slider" href="#MeetOurDoctor4" data-slide="next">&rsaquo;</a>
				</div>							
			</div>	
			
		</div>
		<div class="row">
			<div class="span12">
				<div class="title"><h2>Çalıştığımız Sigorta Şirketleri</h2></div>
				<div id="MeetOurDoctor1" class="carousel slide hidden-phone">
					<div class="carousel-inner">
						<div class="item active">
							<div class="row">
							<?php $sorgu = mysql_query("select * from tbl_referans_logo limit 0,4");
								while($row = mysql_fetch_array($sorgu)){
							?>
								<div class="span3">
									<a href="<?php echo $row["referans_link"]; ?>" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="<?php echo $row["referans_baslik"]; ?>" src="admin/referans_logo/<?php echo $row["referans_logo"]; ?>"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
							<?php } ?>
							</div>
						</div>
						<div class="item">
							<div class="row">
							<?php $sorgu = mysql_query("select * from tbl_referans_logo limit 4,8");
								while($row = mysql_fetch_array($sorgu)){
							?>
								<div class="span3">
									<a href="<?php echo $row["referans_link"]; ?>" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="<?php echo $row["referans_baslik"]; ?>" src="admin/referans_logo/<?php echo $row["referans_logo"]; ?>"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
							<?php } ?>
							</div>
						</div>
					</div>
					<a class="prew-slide nav-slider" href="#MeetOurDoctor1" data-slide="prev">&lsaquo;</a>
					<a class="next-slide nav-slider" href="#MeetOurDoctor1" data-slide="next">&rsaquo;</a>						
				</div>
				<div id="MeetOurDoctor3" class="carousel slide visible-phone">
					<div class="carousel-inner">
						<div class="item active">
							<div class="row">
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/ak-sigorta.png"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/anadolu-sigorta.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/dubai.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/hdi-sigorta-logo.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
						<div class="item">
							<div class="row">
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/ing-emekli.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/Mapfre-Genel.jpg"/>
												<div class="link-img-bg">
													<div class="group">	
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/nippon.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>								
								<div class="span3">
									<a href="#" class="link-img">
										<div class="img-border">
											<div class="img-block">
												<img alt="" src="admin/referans_logo/axa.jpg"/>
												<div class="link-img-bg">
													<div class="group">
													</div>
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
					<a class="prew-slide nav-slider" href="#MeetOurDoctor3" data-slide="prev">&lsaquo;</a>
					<a class="next-slide nav-slider" href="#MeetOurDoctor3" data-slide="next">&rsaquo;</a>						
				</div>	
				
			</div>
		</div>
	</div>
	</section>
</div>
<?php include_once("includes/footer.php"); ?>