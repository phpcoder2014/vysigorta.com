<?php include_once("includes/header.php"); ?>
	<script type="text/javascript" src="js/lightbox/jquery-1.10.1.min.js"></script>
	<script type="text/javascript" src="js/lightbox/gallery.js"></script>
	<script type="text/javascript" src="source/jquery.fancybox.js?v=2.1.5"></script>
	<link rel="stylesheet" type="text/css" href="source/jquery.fancybox.css?v=2.1.5" media="screen" />
			<div class="row visible-desktop">
				<div class="span12 main-slider"><!-- SLIDER --></div>
			</div>
		</div>
	  </div>
	</header>
	<section id="content" class="container-fluid">
	<div class="container">
		<div id="headline-page">
			<h1>Şirketimizin Fotoğrafları</h1>
			<div id="crumbs"><a href="index.php">Anasayfa</a> / <a href="photo.php" class="active">Foto Galeri</a></div> 
		</div>
	<div class="row post">
	<?php $sorgu = mysql_query("select * from tbl_fotograf");
			while($row = mysql_fetch_array($sorgu)){
	?>
			<div class="span3">
				<a href="admin/photo/<?php echo $row["foto_resim"]; ?>" data-fancybox-group="gallery" class="fancybox">
					<div class="img-border">
						<div class="img-block">
							<img alt="" width="206" height="155" src="admin/photo/<?php echo $row["foto_resim"]; ?>">
							<div class="link-img-bg" style="opacity: 0;">
								<div class="group">
									<h2><?php echo $row["foto_text"]; ?></h2>
								</div>
							</div>
						</div>
					</div>
				</a>
					<br />
			</div>
		<?php } ?>
	</div>
		
		</div>	
		
		</div>				
	</div>
	</section>
</div>
<?php include_once("includes/footer.php"); ?>