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