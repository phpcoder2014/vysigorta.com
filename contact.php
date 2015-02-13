<?php include_once("includes/header.php"); ?>
			<div class="row visible-desktop">
				<div class="span12 main-slider"><!-- SLIDER --></div>
			</div>
		</div>
	  </div>
	</header>
	<section id="content" class="container-fluid">
	<div class="container">

		<div class="row">
			<div class="span12">
				<div class="thumbnail">
					<div id="map_canvas" style="width:100%; height:250px;">
					<iframe style="width:100%; height:250px;" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.com/maps/ms?source=embed&amp;ie=UTF8&amp;hl=tr&amp;msa=0&amp;msid=200560084170092340243.0004985769f9bc340e2f3&amp;ll=40.19184,29.208484&amp;spn=0.004917,0.006437&amp;z=16&amp;output=embed"></iframe>
					
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="span8">
				<div class="title"><h2>Her türlü bilgi talebi için bize yazınız</h2></div>
				<p><strong>V-Y Sigorta bir adım yanınızda</strong>. Her türlü sigortalama işlemleri hakkında veya öğrenmek istediğiniz konular hakkında detaylı açıklama yazıp bize gönderiniz.</p>
				<form method="post" action="mailGonder.php">
				<div class="row">
					<div class="span4">
						<div class="form-padding">
							<label for="f1">Adınız (zorunlu):</label>
							<input type="text" name="contact_name" placeholder="lütfen adınızı giriniz.." id="f1" class="form-text" value=""/>
							<label for="f2">Telefon:</label>
							<input type="text" name="contact_phone" placeholder="irtibat numaranız.." id="f2" class="form-text" value="" size="40"/>
						</div>
					</div>
					<div class="span4">
						<div class="form-padding">
							<label for="f3">E-Posta (zorunlu):</label>
							<input type="text" name="contact_email" placeholder="e-posta adresinizi giriniz.." id="f3" class="form-text" value="" size="40"/>
							<label for="f4">Konu:</label>
							<input type="text" name="contact_subject" placeholder="hangi konu hakkında bilgi talebiniz var.." id="f4" class="form-text" value="" size="40"/>		
						</div>
					</div>
				</div>
				<div class="row">
					<div class="span8">
						<div class="form-padding">
							<label for="f5">Mesajınız (zorunlu):</label>
							<textarea name="contact_message" placeholder="bize iletmek istediğiniz mesajı detaylı bir şekilde yazınız.." id="f5" cols="40" rows="10"></textarea>	
							<input type="submit" class="button red small" value="Bilgileri Gönder"/>
						</div>
					</div>
				</div>				
				</form>
				<div id="form-message"></div>
			</div>
			<div class="span4">
				<div class="headline"><h4>İletisim Detayları / Şubelerimiz</h4></div>
				<div class="card">
				<?php $sorgu = mysql_query("select * from tbl_subeler"); 
					while($row = mysql_fetch_array($sorgu)){
				?>
					<span class="contact-line c1"><?php echo $row["sube_adi"]; ?>&nbsp;:&nbsp;<?php echo $row["sube_adres"]; ?></span>
				<?php } ?>
					<span class="contact-line c2">Ofis Tel:  <a href="#call">0(224) 372 78 78</a></span>
					<span class="contact-line c2">Ofis Tel:  <a href="#call">0(224) 372 56 08</a></span>
					<span class="contact-line c2">Ofis Fax:  <a href="#call">0(224) 373 14 76</a></span>
					<span class="contact-line c2">Mobil Tel:  <a href="#call">0(552) 372 78 78</a></span>
					<span class="contact-line c2">Mobil Tel:  <a href="#call">0(532) 172 16 16</a></span>
					<span class="contact-line c3"><a href="mailto:your@domain.com">vysigorta@vysigorta.com</a></span>
				</div>
				<div class="headline"><h4>Sosyal Network</h4></div>
				<ul class="social-icons">
						<li class="facebook"><a href="https://www.facebook.com/vysigorta">Facebook</a></li>
						<li class="twitter"><a href="http://www.twitter.com/vysigorta">Twitter</a></li>
						<li class="linkedin"><a href="http://www.linkedin.com/profile/view?id=343666086&trk">LinkedIn</a></li>
						<li class="youtube"><a href="http://www.instegram.com/vysigorta">istegram</a></li>
				</ul>	
			</div>
	</div>
	</section>
</div>
<?php include_once("includes/footer.php"); ?>