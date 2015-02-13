<?php
/****************************************************************************************
* LiveZilla functions.index.inc.php
* 
* Copyright 2014 LiveZilla GmbH
* All rights reserved.
* LiveZilla is a registered trademark.
* 
* Improper changes to this file may cause critical errors.
***************************************************************************************/ 

if(!defined("IN_LIVEZILLA"))
	die();

function getFolderPermissions()
{
	$message = "";
	
	$directories = Array(PATH_UPLOADS,PATH_CONFIG,PATH_LOG,PATH_STATS,PATH_STATS."day/",PATH_STATS."month/",PATH_STATS."year/");
	foreach($directories as $dir)
	{
		$result = testDirectory($dir);
			if(!$result)
				$message .= "Insufficient write access" . " (" . $dir . ")<br>";
	}
	if(!empty($message))
		$message = "<span class=\"lz_index_error_cat\">Write Access:<br></span> <span class=\"lz_index_red\">" . $message . "</span><a href=\"".CONFIG_LIVEZILLA_FAQ."en/?fid=changepermissions#changepermissions\" class=\"lz_index_helplink\" target=\"_blank\">Learn how to fix this problem</a>";
	return $message;
}

function getMySQL($error="")
{
	global $CONFIG;

	if(!empty($CONFIG["gl_db_host"]))
	{
		require(LIVEZILLA_PATH . "_lib/functions.internal.man.inc.php");
        $extension = (!empty($CONFIG["gl_db_ext"])) ? $CONFIG["gl_db_ext"] : "";
		$error = testDataBase($CONFIG["gl_db_host"],$CONFIG["gl_db_user"],$CONFIG["gl_db_pass"],$CONFIG["gl_db_name"],$CONFIG["gl_db_prefix"],$extension,true);
	}

	if(!function_exists("mysql_real_escape_string") && !function_exists("mysqli_real_escape_string"))
		$error = "MySQL PHP extension is not available.";
	
	if(empty($error))
		return null;
	else 
		return "<span class=\"lz_index_error_cat\">MySQL:<br></span><span class=\"lz_index_red\">" . $error ."</span>";
}

function getPhpVersion()
{
	$message = null;
	if(!checkPhpVersion(PHP_NEEDED_MAJOR,PHP_NEEDED_MINOR,PHP_NEEDED_BUILD))
		$message = "<span class=\"lz_index_error_cat\">PHP-Version:<br></span> <span class=\"lz_index_red\">" . str_replace("<!--version-->",PHP_NEEDED_MAJOR . "." . PHP_NEEDED_MINOR . "." . PHP_NEEDED_BUILD,"LiveZilla requires PHP <!--version--> or greater.<br>Installed version is " . @phpversion()) . ".</span>";
	return $message;
}

function getDisabledFunctions()
{
	global $INTERNAL,$GROUPS;
    initData(array("INTERNAL","GROUPS"));

    $currentMIV = @ini_get("max_input_vars");
    $currentMIVText = $currentMIV;
    if(empty($currentMIV))
    {
        $currentMIV = 1000;
        $currentMIVText = "unknown (default=1000)";
    }

    $message = null;
    if(count($INTERNAL) > 0 && ($miv = ((count($GROUPS)+count($INTERNAL))*75)) > $currentMIV)
        $message .= "<span class=\"lz_index_error_cat\">PHP Configuration:<br></span> <span class=\"lz_index_red\">PHP configuration \"max_input_vars\" (see php.ini) must be increased to ".$miv." (or greater).<br><br>Your current configuration is ".$currentMIVText.".</span><br><br>";
    if(!function_exists("file_get_contents") && ini_get('allow_url_fopen'))
		$message .= "<span class=\"lz_index_error_cat\">Disabled function: file_get_contents<br></span> <span class=\"lz_index_red\">LiveZilla requires the PHP function file_get_contents to be activated.</span><br><br>";
	if(!function_exists("fsockopen"))
		$message .= "<span class=\"lz_index_error_cat\">Disabled function: fsockopen<br></span> <span class=\"lz_index_red\">LiveZilla requires the PHP function fsockopen to be activated.</span><br><br>";
    if(!function_exists("iconv_mime_decode"))
        $message .= "<span class=\"lz_index_error_cat\">Missing PHP extension: ICONV<br></span> <span class=\"lz_index_orange\">LiveZilla requires the PHP extension iconv to parse emails. Please add the iconv package to your PHP configuration.</span><br><br>";

    if(isset($_GET["warnings"]))
    {
        if(!ini_get('allow_url_fopen'))
            $message .= "<span class=\"lz_index_error_cat\">Disabled wrapper: allow_url_fopen<br></span> <span class=\"lz_index_red\">LiveZilla requires allow_url_fopen to be activated.</span><br><br>";
        if(@get_magic_quotes_gpc() == 1 || strtolower(@get_magic_quotes_gpc()) == "on")
            $message .= "<span class=\"lz_index_error_cat\">PHP Magic Quotes:</span><br><span class=\"lz_index_help_text\">This PHP feature has been DEPRECATED.</span><br><br>";
    }
    return $message;
}
?>
