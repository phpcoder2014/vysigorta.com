<?php
/****************************************************************************************
 * LiveZilla chat.php
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function lzmBase64UrlDecode($str) {
    $str = str_replace('_', '=', $str);
    $str = str_replace('-', '+', $str);
    $str = str_replace(',', '/', $str);
    $str = base64_decode($str);

    return $str;
}

function lzmHash($str) {
    $str = md5($str);
    $str = sha1($str);

    return $str;
}

function lzmBase64UrlDecodeAndEscape($str) {
    $str = lzmBase64UrlDecode($str);
    $str = htmlentities($str);

    return $str;
}

function lzmBase64UrlDecodeAndHash($str) {
    $str = lzmBase64UrlDecode($str);
    $str = lzmHash($str);

    return $str;
}


$LZM_URL = dirname($_SERVER['PHP_SELF']);
require './php/common/functions.php';

//var_dump($_GET);die();

if (!empty($_REQUEST['index'])) {
    $index = !empty($_REQUEST['index']) ? $_REQUEST['index'] : '';
    $login_name = !empty($_REQUEST['login']) ? $_REQUEST['login'] : '';
    $login_passwd = !empty($_REQUEST['password']) ? $_REQUEST['password'] : '';
    $server_port = !empty($_REQUEST['port']) ? $_REQUEST['port'] : '';
    $server_profile = !empty($_REQUEST['profile']) ? $_REQUEST['profile'] : '';
    $server_protocol = !empty($_REQUEST['protocol']) ? $_REQUEST['protocol'] : '';
    $server_url = !empty($_REQUEST['url']) ? $_REQUEST['url'] : '';
    $mobile_dir = !empty($_REQUEST['mobile_dir']) ? $_REQUEST['mobile_dir'] : 'bW9iaWxl';
    $status = !empty($_REQUEST['status']) ? $_REQUEST['status'] : '';
    $app = !empty($_REQUEST['app']) ? $_REQUEST['app'] : 0;
    $web = !empty($_REQUEST['web']) ? $_REQUEST['web'] : 0;
    $volume = !empty($_REQUEST['volume']) ? $_REQUEST['volume'] : 'NjA_';
    $awayAfter = !empty($_REQUEST['away_after']) ? $_REQUEST['away_after'] : 'MA__';
    $playIncomingMessageSound = !empty($_REQUEST['play_incoming_message_sound']) ? $_REQUEST['play_incoming_message_sound'] : 'MQ__';
    $playIncomingChatSound = !empty($_REQUEST['play_incoming_chat_sound']) ? $_REQUEST['play_incoming_chat_sound'] : 'MQ__';
    $repeatIncomingChatSound = !empty($_REQUEST['repeat_incoming_chat_sound']) ? $_REQUEST['repeat_incoming_chat_sound'] : 'MQ__';
    $playIncomingTicketSound = !empty($_REQUEST['play_incoming_ticket_sound']) ? $_REQUEST['play_incoming_ticket_sound'] : 'LQ__';
    $language = !empty($_REQUEST['language']) ? $_REQUEST['language'] : '';
    $backgroundMode = !empty($_REQUEST['background_mode']) ? $_REQUEST['background_mode'] : 'MQ__';
    $loginId = !empty($_REQUEST['loginid']) ? $_REQUEST['loginid'] : '';
    $localDbPrefix = !empty($_REQUEST['local_db_prefix']) ? $_REQUEST['local_db_prefix'] : '';
    $appOs = !empty($_REQUEST['appOs']) ? $_REQUEST['appOs'] : '';
    //$deviceId = !empty($_REQUEST['device_id']) ? $_REQUEST['device_id'] : '';
    $debug = !empty($_REQUEST['debug']) ? $_REQUEST['debug'] : 0;
    $multiServerId = !empty($_REQUEST['multi_server_id']) ? $_REQUEST['multi_server_id'] : '';
} else {
    $index = !empty($_REQUEST['ndx']) ? $_REQUEST['ndx'] : '';
    $login_name = !empty($_REQUEST['lgn']) ? $_REQUEST['lgn'] : '';
    $login_passwd = !empty($_REQUEST['psswrd']) ? $_REQUEST['psswrd'] : '';
    $server_port = !empty($_REQUEST['prt']) ? $_REQUEST['prt'] : '';
    $server_profile = !empty($_REQUEST['prfl']) ? $_REQUEST['prfl'] : '';
    $server_protocol = !empty($_REQUEST['prtcl']) ? $_REQUEST['prtcl'] : '';
    $server_url = !empty($_REQUEST['rl']) ? $_REQUEST['rl'] : '';
    $mobile_dir = !empty($_REQUEST['mbl_dr']) ? $_REQUEST['mbl_dr'] : 'bW9iaWxl';
    $status = !empty($_REQUEST['stts']) ? $_REQUEST['stts'] : '';
    $app = !empty($_REQUEST['pp']) ? $_REQUEST['pp'] : 0;
    $web = !empty($_REQUEST['wb']) ? $_REQUEST['wb'] : 0;
    $volume = !empty($_REQUEST['vlm']) ? $_REQUEST['vlm'] : 'NjA_';
    $awayAfter = !empty($_REQUEST['w_ftr']) ? $_REQUEST['w_ftr'] : 'MA__';
    $playIncomingMessageSound = !empty($_REQUEST['pl_ncmng_mssg_snd']) ? $_REQUEST['pl_ncmng_mssg_snd'] : 'MQ__';
    $playIncomingChatSound = !empty($_REQUEST['pl_ncmng_cht_snd']) ? $_REQUEST['pl_ncmng_cht_snd'] : 'MQ__';
    $repeatIncomingChatSound = !empty($_REQUEST['rpt_ncmng_cht_snd']) ? $_REQUEST['rpt_ncmng_cht_snd'] : 'MQ__';
    $playIncomingTicketSound = !empty($_REQUEST['pl_ncmng_tckt_snd']) ? $_REQUEST['pl_ncmng_tckt_snd'] : 'LQ__';
    $language = !empty($_REQUEST['lngg']) ? $_REQUEST['lngg'] : '';
    $loginId = !empty($_REQUEST['lgnd']) ? $_REQUEST['lgnd'] : '';
    $backgroundMode = !empty($_REQUEST['bckgrnd_md']) ? $_REQUEST['bckgrnd_md'] : 'MQ__';
    $localDbPrefix = !empty($_REQUEST['lcl_db_prfx']) ? $_REQUEST['lcl_db_prfx'] : '';
    $appOs = (!empty($_REQUEST['pps'])) ? $_REQUEST['pps'] : '';
    //$deviceId = !empty($_REQUEST['dvc_d']) ? $_REQUEST['dvc_d'] : '';
    $debug = !empty($_REQUEST['dbg']) ? $_REQUEST['dbg'] : 0;
    $multiServerId = !empty($_REQUEST['mlt_srvr_d']) ? $_REQUEST['mlt_srvr_d'] : '';
}

setcookie('lzm-credentials', htmlentities($login_name) . '~' . lzmBase64UrlDecodeAndHash($login_passwd));

$protocolMode = (!empty($_REQUEST['p'])) ? $_REQUEST['p'] : '';

$mobileInformation = getMobileInformation();
$messageInternal = readHtmlTemplate('messageinternal.tpl');
$messageExternal = readHtmlTemplate('messageexternal.tpl');
$messageAdd = readHtmlTemplate('messageadd.tpl');
$messageAddAlt = readHtmlTemplate('messageaddalt.tpl');
$messageRepost = readHtmlTemplate('messagerepost.tpl');
$messageHeader = readHtmlTemplate('header.tpl');


/*
    <!--<meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>-->*/

?>
<!DOCTYPE HTML>
<html manifest="lzm.appcache">
<head>
    <title>
        Livezilla Mobile
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="google" content="notranslate">

    <link rel="stylesheet" type="text/css" href="./js/jquery_mobile/jquery.mobile-1.3.0.min.css"/>
    <link rel="stylesheet" type="text/css" href="./css/livezilla.css"/>
    <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">

    <script type="text/javascript" src="./js/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="./js/jquery-migrate-1.2.1.min.js"></script>
    <script type="text/javascript" src="./js/jquery_mobile/jquery.mobile-1.3.0.min.js"></script>
    <script type="text/javascript" src="./js/jquery.blockUI.js"></script>

    <script type="text/javascript" src="js/md5.js"></script>
    <script type="text/javascript" src="js/jsglobal.js"></script>
    <script type="text/javascript" src="js/wyzz/wyzz.js"></script>

    <script type="text/javascript">
        var chosenProfile = {};
        var userStatus = 0;
        var isMobile = <?php echo $mobileInformation['isMobile']; ?>;
        var isTablet = <?php echo $mobileInformation['isTablet']; ?>;
        var localDbPrefix = <?php echo "'".htmlentities($localDbPrefix)."'"; ?>;
        var mobileOS = <?php echo "'".$mobileInformation['mobileOS']."'"; ?>;
        var mobileVersion = <?php echo "'".$mobileInformation['mobileVersion']."'"; ?>;
        var mobileIsSufficient = <?php echo "'".$mobileInformation['mobileIsSufficient']."'"; ?>;
        var messageTemplates = {'internal': <?php echo "'".$messageInternal."'"; ?>,
            'external': <?php echo "'".$messageExternal."'"; ?>,
            'add': <?php echo "'".$messageAdd."'"; ?>,
            'addalt': <?php echo "'".$messageAddAlt."'"; ?>,
            'repost': <?php echo "'".$messageRepost."'"; ?>,
            'header': <?php echo "'".$messageHeader."'"; ?>
        };
        var web = <?php echo htmlentities($web); ?>;
        var app = <?php echo htmlentities($app); ?>;
        var appOs = <?php echo "'".$appOs."'"; ?>;
        var phpDebug = <?php echo htmlentities($debug); ?>;
        var debug = (phpDebug == 1) ? true : false;
        var multiServerId = <?php echo "'".htmlentities($multiServerId)."'"; ?>;

        $(document).ready(function() {
            //alert('Mobile: ' + isMobile + ',\nTablet: ' + isTablet + ',\nMobile OS: ' + mobileOS + ',\nVersion: ' + mobileVersion + ',\nSufficient: ' + mobileIsSufficient);
            var volume = lz_global_base64_url_decode(<?php echo "'".htmlentities($volume)."'"; ?>);
            var server_url = lz_global_base64_url_decode(<?php echo "'".htmlentities($server_url)."'"; ?>);
            var mobile_dir = lz_global_base64_url_decode(<?php echo "'".htmlentities($mobile_dir)."'"; ?>);
            var server_port = lz_global_base64_url_decode(<?php echo "'".htmlentities($server_port)."'"; ?>);
            var loginId = lz_global_base64_url_decode(<?php echo "'".htmlentities($loginId)."'"; ?>);
            var language = lz_global_base64_url_decode(<?php echo "'".htmlentities($language)."'"; ?>);
            var backgroundMode = lz_global_base64_url_decode(<?php echo "'".htmlentities($backgroundMode)."'"; ?>);
            var urlParts = server_url.split('/');
            var urlBase = urlParts[0];
            var urlRest = '';
            for (var i=1; i<urlParts.length; i++) {
                urlRest += '/' + urlParts[i];
            }
            server_url = urlBase + ':' + server_port + urlRest;

            var protocolMode = lz_global_base64_url_decode(<?php echo "'".htmlentities($protocolMode)."'"; ?>);
            var serverProtocol = '';
            if (protocolMode == '1') {
                serverProtocol = 'https://';
            } else if (protocolMode == '0') {
                serverProtocol = 'http://';
            } else {
                serverProtocol = lz_global_base64_url_decode(<?php echo "'".htmlentities($server_protocol)."'"; ?>)
            }

            chosenProfile = {
                index: lz_global_base64_url_decode(<?php echo "'".htmlentities($index)."'"; ?>),
                login_name: '',
                login_passwd: '',
                server_port: server_port,
                server_profile: lz_global_base64_url_decode(<?php echo "'".htmlentities($server_profile)."'"; ?>),
                server_protocol: serverProtocol,
                server_url: server_url,
                mobile_dir: mobile_dir,
                user_volume: volume,
                user_away_after: lz_global_base64_url_decode(<?php echo "'".htmlentities($awayAfter)."'"; ?>),
                play_incoming_message_sound: lz_global_base64_url_decode(<?php echo "'".htmlentities($playIncomingMessageSound)."'"; ?>),
                play_incoming_chat_sound: lz_global_base64_url_decode(<?php echo "'".htmlentities($playIncomingChatSound)."'"; ?>),
                repeat_incoming_chat_sound: lz_global_base64_url_decode(<?php echo "'".htmlentities($repeatIncomingChatSound)."'"; ?>),
                play_incoming_ticket_sound: lz_global_base64_url_decode(<?php echo "'".htmlentities($playIncomingTicketSound)."'"; ?>),
                fake_mac_address: loginId,
                language: language,
                background_mode: backgroundMode,
                login_id: loginId
            };
            userStatus = lz_global_base64_url_decode(<?php echo "'".htmlentities($status)."'"; ?>);
            if (isMobile && mobileOS == 'iOS') {
                $('#chat_page').css({'overflow-y': 'visible'});
            }

        });
    </script>
    <script type="text/javascript" src="./js/lzm/classes/CommonDeviceInterfaceClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonConfigClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonToolsClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonPermissionClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonStorageClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatServerEvaluationClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatPollServerClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatUserActionsClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatDisplayClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatDisplayHelperClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatDisplayLayoutClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonTranslationClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatEditorClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatObjectClasses.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonDialogClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/ChatGeotrackingMapClass.js"></script>
    <script type="text/javascript" src="js/lzm/chat.js"></script>
</head>
<body style="overflow-y: hidden;">

<audio id="sound-message" preload='auto'>
    <source src="../sound/message.ogg" type="audio/ogg">
    <source src="../sound/message.mp3" type="audio/mpeg">
</audio>

<audio id="sound-ringtone" preload='auto'>
    <source src="sounds/ringtone.ogg" type="audio/ogg">
    <source src="sounds/ringtone.mp3" type="audio/mpeg">
</audio>

<audio id="sound-ticket" preload="auto">
    <source src="../sound/wind.ogg" type="audio/ogg">
    <source src="../sound/wind.mp3" type="audio/mpeg">
</audio>

<div id="chat_page" data-role="page" style="overflow-y: hidden;">
    <div id="content_chat" data-role="content" style="overflow: visible;"> <!--article-->
        <div id="debugging-messages"></div>

        <div data-role="controlgroup" data-type="horizontal" style="margin: 0px 0px 0px 0px; z-index: 100;" id="user-control-panel">
            <a href="#" data-role="button" id="userstatus-button" class="lzm-button">&nbsp;</a>
            <a href="#" data-role="button" data-icon="arrow-d" data-iconpos="left" id="usersettings-button">&nbsp;</a>
            <a href="#" data-role="button" id="blank-button" style="cursor: default !important">&nbsp;</a>
            <a href="#" data-role="button" id="wishlist-button" data-icon="plus">&nbsp;</a>
        </div>
        <div id="userstatus-menu" class="mouse-menu" style="display:none;"></div>
        <div id="usersettings-menu" class="mouse-menu" style="display:none;"></div>
        <div id="minified-dialogs-menu" class="mouse-menu" style="display:none;"></div>

        <div class="lz-menu" id="new-view-select-panel"></div>

        <div class="lz-main" style="text-align:center;" id="chatframe">
            <div id="chat" style="display:block;">

                <div id="chat-container">
                    <div id="chat-container-headline"></div>
                    <div style="margin: 5px 5px 5px 5px;" id="active-chat-panel">
                        <div id="switch-center-page" style="display: none;"></div>
                    </div>
                    <div id="chat-table">
                        <div id="chat-progress" style="text-align: left; display: none;"></div>
                        <div id="chat-qrd-preview" style="text-align: left; display: none; max-height: 100px;"></div>
                        <div id="chat-buttons" style="display: none;"></div>
                        <div id="chat-action" style="display: none;">
                            <div id="chat-input-controls"></div>
                            <div id="chat-input-body">
                                <label for="chat-input" style="display: none;">Chat-Input</label>
                                <textarea data-role="none" id="chat-input" onkeypress="return catchEnterButtonPressed(event);" onkeyup="chatInputTyping(event);" onblur="doMacMagicStuff()"></textarea><br>
                            </div>
                        </div>
                        <div id="chat-title" style="display: none;"></div>
                    </div>
                </div>

                <div id="translation-container" style="display: none; z-index: 20;">
                    <div id="translation-container-headline"></div>
                    <div id="translation-container-headline2"></div>
                    <div id="translation-container-footline"></div>
                </div>
                <div id="usersettings-container" style="display: none; z-index: 20;">
                    <div id="usersettings-container-headline"></div>
                    <div id="usersettings-container-headline2"></div>
                    <div id="usersettings-container-body"></div>
                    <div id="usersettings-container-footline"></div>
                </div>
                <div id="qrd-tree">
                    <div id="qrd-tree-headline"></div>
                    <div id="qrd-tree-headline2"></div>
                    <div id="qrd-tree-body"></div>
                </div>
                <div id="operator-list">
                    <div id="operator-list-headline"></div>
                    <div id="operator-list-headline2"></div>
                    <div id="operator-list-body"></div>
                </div>
                <div id="ticket-list">
                    <div id="ticket-list-headline"></div>
                    <div id="ticket-list-headline2"></div>
                    <div id="ticket-list-body"></div>
                </div>
                <div id="visitor-list">
                    <div id="visitor-list-headline"></div>
                    <div id="visitor-list-headline2"></div>
                    <div id="visitor-list-table-div"></div>
                </div>
                <div id="archive">
                    <div id="archive-headline"></div>
                    <div id="archive-headline2"></div>
                    <div id="archive-body"></div>
                    <div id="archive-footline"></div>
                </div>
                <div id="startpage">
                    <div id="startpage-headline"></div>
                    <div id="startpage-body"></div>
                    <div id="startpage-footline"></div>
                </div>
                <div id="geotracking">
                    <div id="geotracking-headline"></div>
                    <div id="geotracking-body"></div>
                    <div id="geotracking-footline"></div>
                </div>
            </div>
            <div id="visitor-info" style="display:block;">
                <div id="visitor-info-headline"></div>
                <div id="visitor-info-headline2"></div>
                <div id="visitor-info-body"></div>
                <div id="visitor-browser-history-body"></div>
                <div id="visitor-info-footline"></div>
            </div>
            <div id="errors" style="text-align:left;display:none;"></div>
        </div>
        <div id="test-length-div" style="visibility:hidden;"></div>
    </div> <!--article-->
</div>

<div id="minimized-window-menu" style="display: none;">
    <div id="minimized-window-list"></div>
    <div id="minimized-window-button" onclick="lzm_displayHelper.showMinimizedDialogsMenu(false, event);"><span id="minimized-window-button-inner">&nbsp;</span></div>
</div>

</body>
</html>