<?php include_once("includes/header.php"); ?>
			<div class="row visible-desktop">
				<div class="span12 main-slider"><!-- SLIDER --></div>
			</div>
		</div>
	  </div>
	</header>
	<section id="content" class="container-fluid">
	<div class="container">
		<div id="headline-page">
			<h1>TEKLIF FORMU</h1>
		</div>		
	<div class="row">
			<div class="span8">
				<div class="title"><h2>Teklif Formunu eksiksiz doldurup bize gönderebilirsiniz.</h2></div>
				<p><strong>V-Y Sigorta bir adım yanınızda</strong>. Şirketimiz sigorta sektöründe profesyonel anlamda hizmet veren, müşteri memnuniyetine önem veren öncü bir sigorta acentesidir.</p>
				<form method="post" action="makale_yukle.php">
				<div class="row">
					<div class="span4">
						<div class="form-padding">
							<label for="f1">T.C No (zorunlu):</label>
							<input type="text" name="contact_no" placeholder="T.C kimlik no giriniz.." id="f1" class="form-text" value=""/>
							<label for="f2">Soyadınız (zorunlu):</label>
							<input type="text" name="contact_lastname" placeholder="soyadınızı yazınız.." id="f2" class="form-text" value="" size="40"/>
						</div>
					</div>
					<div class="span4">
						<div class="form-padding">
							<label for="f3">Adınız (zorunlu):</label>
							<input type="text" name="contact_name" placeholder="adınızı yazınız.." id="f3" class="form-text" value="" size="40"/>
							<label for="f4">Ev Telefonu:</label>
							<input type="text" placeholder="(123) 123-1234" data-input-mask="(999) 999-9999" name="contact_home_phone" placeholder="ev telefonunuzu giriniz.." id="f4" class="form-text" value="" size="40"/>		
						</div>
					</div>
				</div>				
				<div class="row">
					<div class="span4">
						<div class="form-padding">
							<label for="f1">Yaşadığınız il:</label>
							<input type="text" name="contact_city" placeholder="yaşadığınız ili giriniz.." id="f1" class="form-text" value=""/>
							<label for="f2">Detaylı adres (zorunlu):</label>
							<input type="text" name="contact_address" placeholder="adresinizi detaylı giriniz.." id="f2" class="form-text" value="" size="40"/>
						</div>
					</div>
					<div class="span4">
						<div class="form-padding">
							<label for="f3">Cep Telefonu (zorunlu):</label>
							<input type="text" name="contact_mobile_phone" placeholder="(123) 123-1234" id="f3" class="form-text" value="" size="40"/>
							<label for="f4">Yaşadığınız ilçe:</label>
							<input type="text" name="contact_city_small" placeholder="yaşadığınız ilçeyi giriniz." id="f4" class="form-text" value="" size="40"/>		
						</div>
					</div>
				</div>				
				<div class="row">
					<div class="span4">
						<div class="form-padding">
							<label for="f1">Sigorta türü:</label>
							<select name="sigorta_turu" id="f1" class="form-text">
							  <option selected="">Sigorta türünü seçiniz</option>
							  <option value="Trafik Sigortası">Trafik Sigortası</option>
							  <option value="Kasko Sigortası">Kasko Sigortası</option>
							  <option value="Oto Dışı Kaza Sigortası">Oto Dışı Kaza Sigortası</option>
							  <option value="Yangın Sigortası">Yangın Sigortası</option>
							  <option value="Mühendislik Sigortası">Mühendislik Sigortası</option>
							  <option value="Nakliyat Sigortası">Nakliyat Sigortası</option>
							  <option value="Sağlık Sigortası">Sağlık Sigortası</option>
							  <option value="Hukuksal Koruma Sigortası">Hukuksal Koruma Sigortası</option>
							  <option value="DASK">DASK(Deprem Sigortası)</option>
							  <option value="Egitim Güvencesi Sigortasi">Eğitim Güvencesi Sigortası</option>
							  <option value="Işyeri Sigortası">İşyeri Sigortası</option>
							  <option value="Ev Sigortasi">Ev Sigortası</option>							
							 </select>
							<label for="f2">Detaylı adres 2 (zorunlu):</label>
							<input type="text" style="width:590px;" name="contact_address" placeholder="adresinizi detaylı giriniz.." id="f2" class="form-text" value="" size="40"/>
						</div>
					</div>
					<div class="span4">
						<div class="form-padding">
							<label for="f4">Vade hatırlatma :</label>
							<select name="vade_hatirlatma" id="f1" class="form-text">
							  <option selected="">Vade hatırlatma istermisiniz</option>
							  <option value="Evet">Evet istiyorum</option>							
							  <option value="Hayır">Hayır istemiyorum</option>							
							</select>	
						</div>
					</div>
				</div>
				<div class="row">
					<div class="span8">
						<div class="form-padding">
							<label for="f5">Açıklama :</label>
							<textarea name="contact_message" placeholder="bize iletmek istediğiniz mesajı detaylı bir şekilde yazınız.." id="f5" cols="40" rows="5"></textarea>	
							<input type="submit" class="button red small" value="Teklif talebini gönder"/>
						</div>
					</div>
				</div>				
				</form>
				<div id="form-message"></div>
			</div>
			<div class="span4">
				<div class="headline"><h4>İletisim Detayları</h4></div>
				<div class="card">
				<?php $sorgu = mysql_query("select * from tbl_subeler"); 
					while($row = mysql_fetch_array($sorgu)){
				?>
					<span class="contact-line c1"><?php echo $row["sube_adi"]; ?>&nbsp;:&nbsp;<?php echo $row["sube_adres"]; ?></span>
				<?php } ?>
					<span class="contact-line c2">Ofis Tel:  <a href="#call">0(224) 372 78 78</a></span>
					<span class="contact-line c2">Ofis Tel:  <a href="#call">0(224) 372 56 08</a></span>
					<span class="contact-line c2">Ofis Fax:  <a href="#call">0(224) 373 14 76</a></span>
					<span class="contact-line c2">Mobil Tel:  <a href="#call">0(532) 324 76 52</a></span>
					<span class="contact-line c2">Mobil Tel:  <a href="#call">0(532) 770 04 52</a></span>
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
	</div>
	</section>
</div>
<?php include_once("includes/footer.php"); ?>