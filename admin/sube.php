<?php include_once("includes/db.php");
session_start();
  if(!isset($_SESSION["login"])){
	echo str_repeat("<br>", 8)."<center><h1> Sisteme Yonleniyor..</h1></center>";
	header("Refresh: 2; url=login.php");
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
			
			<h1 id="sidebar-title"><a href="#">V-Y Sigorta</a></h1>
		  
			<!-- Logo (221px wide) -->
			<a href="#"><img id="logo" src="resources/images/logo.png" alt="V-Y Sigorta" /></a>
		  
			<!-- Sidebar Profile links -->
			<div id="profile-links">
				Merhaba, <a href="#" title="Edit your profile"><?php echo $_SESSION["kullanici_adi"]; ?></a><br />
				<br />
				<a href="http://www.vysigorta.com" title="V-Y Sigorta">Siteye Git</a> | <a href="logout.php" title="Sign Out">Hesabi Kapat</a>
			</div>        
			
			<ul id="main-nav">  <!-- Accordion Menu -->
				
				<li>
					<a href="referans.php" class="nav-top-item no-submenu"> <!-- Add the class "no-submenu" to menu items with no sub menu -->
						Referans
					</a> 
				</li>				
				<li>
					<a href="teklif.php" class="nav-top-item no-submenu"> <!-- Add the class "no-submenu" to menu items with no sub menu -->
						Teklifler
					</a> 
				</li>
				
				<li> 
					<a href="sigorta.php" class="nav-top-item no-submenu"><!-- Add the class "current" to current menu item -->
						Müşteri ne diyor
					</a>
				</li>				
				
				<li> 
					<a href="photo.php" class="nav-top-item no-submenu"><!-- Add the class "current" to current menu item -->
						Fotoğraf
					</a>
				</li>
				
				<li> 
					<a href="sube.php" class="nav-top-item no-submenu"><!-- Add the class "current" to current menu item -->
						Şubeler
					</a>
				</li>
			
			</ul> 			
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
			<p id="page-intro">ŞUBE ISLEMLERI</p>

			<div class="clear"></div> <!-- End .clear -->
			
			<div class="content-box"><!-- Start Content Box -->
				
				<div class="content-box-header">
					
					<h3>ŞUBELER</h3>
					
					<ul class="content-box-tabs">
						<li><a href="#tab1" class="default-tab">ŞUBE LISTELERI</a></li> <!-- href must be unique and match the id of target div -->
						<li><a href="#tab2">ŞUBE EKLE</a></li>
					</ul>
					
					<div class="clear"></div>
					
				</div> <!-- End .content-box-header -->
				
				<div class="content-box-content">
					
					<div class="tab-content default-tab" id="tab1"> <!-- This is the target div. id must match the href of this div's tab -->					
						<table>							
							<thead>
								<tr>
								   <th>ID</th>
								   <th>ŞUBE ADI</th>
								   <th>ŞUBE ADRES</th>
								   <th>Durum</th>
								</tr>
								
							</thead>
						 
							</tfoot>						 
                            	<?php 
								$sorgu = mysql_query("select * from tbl_subeler order by sube_id desc");
								while($row = mysql_fetch_array($sorgu)){	
								?>
								<tr>
									<td><?php echo $row["sube_id"]; ?></td>
									<td><?php echo $row["sube_adi"]; ?></td>
									<td><?php echo $row["sube_adres"]; ?></td>
									<td>
										<!-- Icons -->
										 <a href="sube_sil.php?sayfa=<?php echo $row["sube_id"];?>" title="Delete"><img src="resources/images/icons/cross.png" alt="Delete" /></a> 
									</td>
								</tr>
								<?php } ?>
								
							</tbody>
							
						</table>
													
							<tfoot>
								<tr>
									<td colspan="6">										
										<div class="clear"></div>
									</td>
								</tr>
						
					</div> <!-- End #tab1 -->
					
					<div class="tab-content" id="tab2">
					
						<form action="sube_yukle.php" method="post">
							
							<fieldset> <!-- Set class to "column-left" or "column-right" on fieldsets to divide the form into columns -->						
								<p>
									<label>Şube adı</label>
									<input class="text-input large-input" placeholder="şube adını giriniz" type="text" id="large-input" name="referans_link" />
								</p>								
								
								<p>
									<label>Şube adresini giriniz..</label>
									<input class="text-input large-input" placeholder="şube adresini giriniz." type="text" id="large-input" name="referans_baslik" />
								</p>								
															
								<p>
									<input class="button" type="submit" value="Şube Ekle" />
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
						&#169; Copyright 2014 vysigorta.com | Powered by Nihat Sendil
				</small>
			</div><!-- End #footer -->
			
		</div> <!-- End #main-content -->
		
	</div></body>
  

<!-- Download From www.exet.tk-->
</html>
<?php } ?>