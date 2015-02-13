<?php include_once("includes/db.php");
session_start();
  if(!isset($_SESSION["login"])){
	echo str_repeat("<br>", 8)."<center><h1> Sisteme Yonleniyor..</h1></center>";
	header("Refresh: 2; url=../index.php");
  }else{

 ?>
<!DOCTYPE html>
<html lang="en">
 <head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Hosgeldin <?php echo $_SESSION["kullanici_adi"]; ?></title>
	  
		<!-- Reset Stylesheet -->
		<link rel="stylesheet" href="resources/css/reset.css" type="text/css" media="screen" />
	  
		<!-- Main Stylesheet -->
		<link rel="stylesheet" href="resources/css/style.css" type="text/css" media="screen" />
		
		<!-- Invalid Stylesheet. This makes stuff look pretty. Remove it if you want the CSS completely valid -->
		<link rel="stylesheet" href="resources/css/invalid.css" type="text/css" media="screen" />	
  
		<!-- jQuery -->
		<script type="text/javascript" src="resources/scripts/jquery-1.3.2.min.js"></script>
		
		<!-- jQuery Configuration -->
		<script type="text/javascript" src="resources/scripts/simpla.jquery.configuration.js"></script>
		
		<!-- Facebox jQuery Plugin -->
		<script type="text/javascript" src="resources/scripts/facebox.js"></script>
		
		<!-- jQuery WYSIWYG Plugin -->
		<script type="text/javascript" src="resources/scripts/jquery.wysiwyg.js"></script>
		
		<!-- jQuery Datepicker Plugin -->
		<script type="text/javascript" src="resources/scripts/jquery.datePicker.js"></script>
		<script type="text/javascript" src="resources/scripts/jquery.date.js"></script>
		<!--[if IE]><script type="text/javascript" src="resources/scripts/jquery.bgiframe.js"></script><![endif]-->
	</head>
  
	<body><div id="body-wrapper"> <!-- Wrapper for the radial gradient background -->
		
		<div id="sidebar"><div id="sidebar-wrapper"> <!-- Sidebar with logo and menu -->
			
			<h1 id="sidebar-title"><a href="#">Simpla Admin</a></h1>
		  
			<!-- Logo (221px wide) -->
			<a href="#"><img id="logo" src="resources/images/logo.png" alt="Simpla Admin logo" /></a>
		  
			<!-- Sidebar Profile links -->
			<div id="profile-links">
				Merhaba, <a href="#" title="Edit your profile"><?php echo $_SESSION["kullanici_adi"]; ?></a><br />
				<br />
				<a href="#" title="View the Site">Siteye Git</a> | <a href="logout.php" title="Sign Out">Hesabi Kapat</a>
			</div>        
			
			<ul id="main-nav">  <!-- Accordion Menu -->
				
				<li>
					<a href="index.php" class="nav-top-item no-submenu"> <!-- Add the class "no-submenu" to menu items with no sub menu -->
						Makale
					</a> 
					<ul>
						<li><a href="index.php">Makale Ekle</a></li>
					</ul>
				</li>
				
				<li> 
					<a href="slider.php" class="nav-top-item"> <!-- Add the class "current" to current menu item -->
					Slider
					</a>
					<ul>
						<li><a href="slider.php">SLider Ekle</a></li>
					</ul>
				</li>
				
				<li>
					<a href="#" class="nav-top-item">
						Hakkimizda
					</a>
					<ul>
						<li><a href="hakkimizda.php">hakkimizda.php</a></li>
					</ul>
				</li>
			
			</ul> <!-- End #main-nav -->
			
			<div id="messages" style="display: none"> <!-- Messages are shown when a link with these attributes are clicked: href="#messages" rel="modal"  -->
				
				<h3>3 Messages</h3>
			 
				<p>
					<strong>17th May 2009</strong> by Admin<br />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue.
					<small><a href="#" class="remove-link" title="Remove message">Remove</a></small>
				</p>
			 
				<p>
					<strong>2nd May 2009</strong> by Jane Doe<br />
					Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.
					<small><a href="#" class="remove-link" title="Remove message">Remove</a></small>
				</p>
			 
				<p>
					<strong>25th April 2009</strong> by Admin<br />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue.
					<small><a href="#" class="remove-link" title="Remove message">Remove</a></small>
				</p>
				
				<form action="#" method="post">
					
					<h4>New Message</h4>
					
					<fieldset>
						<textarea class="textarea" name="textfield" cols="79" rows="5"></textarea>
					</fieldset>
					
					<fieldset>
					
						<select name="dropdown" class="small-input">
							<option value="option1">Send to...</option>
							<option value="option2">Everyone</option>
							<option value="option3">Admin</option>
							<option value="option4">Jane Doe</option>
						</select>
						
						<input class="button" type="submit" value="Send" />
						
					</fieldset>
					
				</form>
				
			</div> <!-- End #messages -->
			
		</div></div> <!-- End #sidebar -->
		
		<div id="main-content"> <!-- Main Content Section with everything -->
			
			<noscript> <!-- Show a notification if the user has disabled javascript -->
				<div class="notification error png_bg">
					<div>
						Javascript is disabled or is not supported by your browser. Please <a href="http://browsehappy.com/" title="Upgrade to a better browser">upgrade</a> your browser or <a href="http://www.google.com/support/bin/answer.py?answer=23852" title="Enable Javascript in your browser">enable</a> Javascript to navigate the interface properly.
					Download From <a href="http://www.exet.tk">exet.tk</a></div>
				</div>
			</noscript>
			
			<!-- Page Head -->
			<h2>Merhaba <?php echo $_SESSION["kullanici_adi"]; ?></h2>
			<p id="page-intro">Slider islemleri</p>

			<div class="clear"></div> <!-- End .clear -->
			
			<div class="content-box"><!-- Start Content Box -->
				
				<div class="content-box-header">
					
					<h3>SLIDER ISLEMLERI</h3>
					
					<ul class="content-box-tabs">
						<li><a href="#tab1" class="default-tab">SLIDER LISTELERI</a></li> <!-- href must be unique and match the id of target div -->
						<li><a href="#tab2">YENI SLIDER EKLE</a></li>
					</ul>
					
					<div class="clear"></div>
					
				</div> <!-- End .content-box-header -->
				
				<div class="content-box-content">
					
					<div class="tab-content default-tab" id="tab1"> <!-- This is the target div. id must match the href of this div's tab -->
						
						<table>
							
							<thead>
								<tr>
								   <th>Baslik</th>
								   <th>Yazan</th>
								   <th>Resim</th>
								   <th>Durum</th>
								</tr>
								
							</thead>
						 

							</tfoot>						 
                            	<?php 
								$sayfada = 10;
								$sorgu = mysql_query('SELECT COUNT(*) AS toplam FROM tbl_slider order by slider_id desc');
								$sonuc = mysql_fetch_assoc($sorgu);
								$toplam_icerik = $sonuc['toplam'];
								$toplam_sayfa = ceil($toplam_icerik / $sayfada);
								$sayfa = isset($_GET['sayfa']) ? (int) $_GET['sayfa'] : 1;								 
								if($sayfa < 1) $sayfa = 1; 
								if($sayfa > $toplam_sayfa) $sayfa = $toplam_sayfa; 								
								$limit = ($sayfa - 1) * $sayfada;
								$sorgu = mysql_query('SELECT * FROM tbl_slider LIMIT ' . $limit . ', ' . $sayfada);
								while($row = mysql_fetch_assoc($sorgu)){	
								?>
								<tr>
									<td><?php echo $row["slider_baslik"]; ?></td>
									<td><?php echo $row["slider_detay"]; ?></td>
									<td><img width="80" height="60"  src="../assets/images/slider/<?php echo $row["slider_resim"]; ?>"></td>
									<td>
										<!-- Icons -->
										 <a href="slider_sil.php?sayfa=<?php echo $row["slider_id"];?>" title="Delete"><img src="resources/images/icons/cross.png" alt="Delete" /></a> 
									</td>
								</tr>
								<?php } ?>
								
							</tbody>
							
						</table>
													
							<tfoot>
								<tr>
									<td colspan="6">										
										<div class="pagination">
										<?php 
												for($s = 1; $s <= $toplam_sayfa; $s++) {
												   if($sayfa == $s) { // eger bulundugumuz sayfa ise link yapma.
													  echo  '<a href="?sayfa=' . $s . '" class="number current" title="' . $s . '">' . $s . '</a>';
													 
												   } else {
													  echo '<a href="?sayfa=' . $s . '" class="number" title="' . $s . '">' . $s . '</a>';
												   }
												} ?>
											
										</div> <!-- End .pagination -->
										<div class="clear"></div>
									</td>
								</tr>
						
					</div> <!-- End #tab1 -->
					
					<div class="tab-content" id="tab2">
					
						<form action="slider_yukle.php" method="post" enctype="multipart/form-data">
							
							<fieldset> <!-- Set class to "column-left" or "column-right" on fieldsets to divide the form into columns -->						
								<p>
									<label>Slider basligini buraya giriniz..</label>
									<input class="text-input large-input" type="text" id="large-input" name="slider_baslik" />
								</p>								
								
								<p>
									<label>Slider resmini seciniz..</label>
									<input class="text-input large-input" type="file" id="large-input" name="import" />
								</p>
								
								<p>
									<label>Slider detaylarini giriniz..</label>
									<textarea class="text-input textarea wysiwyg" id="textarea" name="slider_detay" cols="79" rows="15"></textarea>
								</p>
								
								<p>
									<input class="button" type="submit" value="Slider Ekle" />
								</p>
								
							</fieldset>
							
							<div class="clear"></div><!-- End .clear -->
							
						</form>
						
					</div> <!-- End #tab2 -->        
					
				</div> <!-- End .content-box-content -->
				
			</div> <!-- End .content-box -->

			<div class="clear"></div>
			
			<div id="footer">
				<small> <!-- Remove this notice or replace it with whatever you want -->
						&#169; Copyright 20014 Patent Tescil Ofisi | Powered by Nihat Sendil
				</small>
			</div><!-- End #footer -->
			
		</div> <!-- End #main-content -->
		
	</div></body>
  

<!-- Download From www.exet.tk-->
</html>
<?php } ?>