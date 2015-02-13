/****************************************************************************************
 * LiveZilla chat.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
var lzm_commonConfig = {};
var lzm_commonTools = {};
lzm_commonPermissions = {};
var lzm_commonStorage = {};
var lzm_chatTimeStamp = {};
var lzm_chatDisplay = {};
var lzm_displayHelper = {};
var lzm_displayLayout = {};
var lzm_chatServerEvaluation = {};
var lzm_chatPollServer = {};
var lzm_chatUserActions = {};
var lzm_commonDialog = {};
var lzm_t = {};
var loopCounter = 0;
var lzm_chatInputEditor;
var messageEditor;
var qrdTextEditor;
var visitorsStillNeeded = [];
var deviceId = 0;
var debugBackgroundMode = false;
var debuggingLogContent = '';
var debuggingFoo = '';
var ticketLineClicked = 0;
var mobile;
var lastTypingEvent = 0;
var controlPressed = false;
var debuggingGetDate = function() {
    var myDate = new Date();
    return myDate.getSeconds() * 1000 + myDate.getMilliseconds();
};

var views = [];

var debuggingDisplayHeight = 0;
if ((app == 1) && (appOs == 'ios')) {
    var console = {};
    console.log = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'log');
        } catch(ex) {

        }
    };
    console.info = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'info');
        } catch(ex) {
        }
    };
    console.warn = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'warn');
        } catch(ex) {
        }
    };
    console.error = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'error');
        } catch(ex) {
        }
    };
}

// debugging functions
function forceResizeNow() {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
}

function debuggingEditorClicked() {
    logit('Click!');
}

function debuggingStartStopPolling() {
    var tmpDate = lzm_chatTimeStamp.getLocalTimeObject();
    var tmpHumanTime = lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage);
    if (lzm_chatPollServer.poll_regularly) {
        lzm_chatPollServer.stopPolling();
        logit(tmpHumanTime + ' - Polling stopped!');
        debugBackgroundMode = true;
    } else {
        lzm_chatPollServer.startPolling();
        logit(tmpHumanTime + ' - Polling started!');
        debugBackgroundMode = false;
    }
}

function debuggingResetViewSelectPanel() {
    lzm_chatDisplay.viewSelectArray = [{"id":"archive","name":"Chat-Archiv"},{"id":"mychats","name":"Meine Chats"},
        {"id":"tickets","name":"Tickets"},{"id":"external","name":"Besucher"},
        {"id":"internal","name":"Operatoren"},{"id":"qrd","name":"Ressourcen"}];
    lzm_chatDisplay.showViewSelectPanel = {"mychats":1,"tickets":1,"external":1,"internal":0,"qrd":0,"archive":0};
    lzm_chatDisplay.createViewSelectPanel('mychats')
}

function logit(myObject, myLevel) {
    var myError = (new Error).stack;
    var callerFile = '', callerLine = '';
    try {
        var callerInfo = myError.split('\n')[2].split('(')[1].split(')')[0].split(':');
        callerFile = callerInfo[0] + ':' + callerInfo[1];
        callerLine = callerInfo[2];
    } catch(e) {}
    if(debug) {
        try {
            console.log(myObject);
            console.log('at line ' + callerLine + ' in ' + callerFile);
        } catch(e) {}
        myLevel = (typeof myLevel != 'undefined') ? myLevel.toUpperCase() : 'WARNING';
        if (debuggingLogContent == '') {
            debuggingLogContent = myObject;
        }
        var message = 'Not readable object content';
        try {
            message = JSON.stringify(myObject);
        } catch(e) {
            if (typeof myObject.outerHTML != 'undefined') {
                message = JSON.stringify(myObject.outerHTML);
            }
        }

        var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
        var postUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url +
                '/mobile/logit.php?acid=' + acid;
        var myDataObject = {'time': lzm_chatTimeStamp.getServerTimeString(null, true), 'level': myLevel, 'message': message, 'file': callerFile, 'line': callerLine};
        $.ajax({
            type: "POST",
            url: postUrl,
            data: myDataObject,
            timeout: lzm_commonConfig.pollTimeout,
            success: function (data) {},
            error: function (jqXHR, textStatus, errorThrown) {
                try {
                    console.log('Error while sending log to the server!');
                } catch(e) {}
            },
            dataType: 'text'
        });
    } else {
        try {
            console.log(myObject);
            console.log('at line ' + callerLine + ' in ' + callerFile);
        } catch(e) {}
    }
    return null;
}

// functions called by iOs app
function webAppHasLoadedCorrectly() {
    return 'LiveZilla';
}

// wrapper arround functions inside one of the classes...
function showAppDownloadLink() {
    var appLink = '';
    if (isMobile && app != '1' && mobileIsSufficient) {
        switch(mobileOS.toLowerCase()) {
            case 'android':
            case 'blackberry':
                appLink = 'https://play.google.com/store/apps/details?id=net.livezilla.mobile.client';
                break;
            case 'ios':
                appLink = 'https://itunes.apple.com/app/livezilla/id710516100?mt=8';
                break;
        }
    }
    //appLink = 'http://www.heise.de/';
    var appInfoDidShow = (lzm_commonStorage.loadValue('app_info_did_show'));
    if (appLink != '' && (typeof appInfoDidShow == 'undefined' || appInfoDidShow != '1')) {
        lzm_commonStorage.saveValue('app_info_did_show', '1');
        var bodyString = '<div id="app-info-body">';
        bodyString += t('There is a LiveZilla App available for your mobile device');
        bodyString += '</div>';
        var buttonString = '<div id="app-info-button">' +
            '<span id="download-app" class="chat-button-line chat-button-left chat-button-right"' +
            ' style="margin-left: 4px; padding-left: 12px; padding-right: 12px; cursor:pointer; background-image: ' +
            lzm_displayHelper.addBrowserSpecificGradient('') + ';">&nbsp;' + t('Install') + '&nbsp;</span>' +
            '<span id="cancel-app" class="chat-button-line chat-button-left chat-button-right"' +
            ' style="margin-left: 4px; padding-left: 12px; padding-right: 12px; cursor:pointer; background-image: ' +
            lzm_displayHelper.addBrowserSpecificGradient('') + ';">&nbsp;' + t('Cancel') + '&nbsp;</span>' +
            '</div>';
        var appInfoDivString = '<div id="app-info-div">' + bodyString + buttonString + '</div>';

        $('#chat_page').append(appInfoDivString).trigger('create');

        $('#app-info-div').css({
            position: 'absolute', top: '0px', left: '0px', width: ($(window).width() - 2)+'px', height: '40px',
            'background-color': '#ffffc6', border: '1px solid #eeeeb5', 'z-index': '202'
        });
        $('#app-info-body').css({
            position: 'absolute', top: '0px', left: '0px', width: ($(window).width() - 202)+'px', height: '30px',
            padding: '10px 0px 0px 10px'
        });
        $('#app-info-button').css({
            position: 'absolute', top: '0px', left: ($(window).width() - 192)+'px', width: '190px', height: '30px',
            padding: '10px 0px 0px 0px'
        });


        $('#cancel-app').click(function() {
            try {
                $('#app-info-div').remove();
            } catch(ex) {
                // Do nothing
            }
        });
        $('#download-app').click(function() {
            try{
                $('#app-info-div').remove();
                openLink(appLink);
            } catch(ex) {
                // Do nothing...
            }
        });
    }
}

function showAppIsSyncing() {
    lzm_displayHelper.blockUi({message: t('Syncing data...')});
}

function chatInputEnterPressed() {
    sendTranslatedChat(grabEditorContents());
}

function doNothing() {
    // Dummy function that does nothing!
    // Needed for editor events
}

function chatInputBodyClicked() {
    var id, b_id, user_id, name;
    if(lzm_chatDisplay.active_chat_reco.indexOf('~') != -1) {
        id = lzm_chatDisplay.active_chat_reco.split('~')[0];
        b_id = lzm_chatDisplay.active_chat_reco.split('~')[1];
        viewUserData(id, b_id, 0, true);
    } else {
        if (lzm_chatDisplay.active_chat_reco == "everyoneintern") {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.active_chat_realname;
        } else if(typeof lzm_chatDisplay.thisUser.userid == 'undefined') {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.active_chat_reco;
        } else {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.thisUser.userid;
            name = lzm_chatDisplay.thisUser.name;
        }
        chatInternalWith(id, user_id, name);
    }
}

function chatInputTyping(e) {
    if (typeof e != 'undefined' && (typeof e.which == 'undefined' || e.which != 13) && (typeof e.keyCode == 'undefined' || e.keyCode != 13)) {
        lastTypingEvent = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        setTimeout(function() {
            var typingNow = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
            $('#chat-qrd-preview').html('');
            if (typingNow - lastTypingEvent > 450) {
                var editorContents = grabEditorContents().replace(/<.*?>/g, '');
                if (editorContents != '') {
                    var frequentlyUsedResources = lzm_chatServerEvaluation.cannedResources.getResourceList('usage_counter', {ty: '1,2,3,4', text: editorContents, ti: editorContents});
                    var maxIterate = Math.min(10, frequentlyUsedResources.length), furHtml = '';
                    if ($('#chat-progress').height() > 200 && frequentlyUsedResources.length > 0) {
                        for (var i=0; i<maxIterate; i++) {
                            var resourceText = (frequentlyUsedResources[i].ty == 1) ? frequentlyUsedResources[i].text.replace(/<.*?>/g, '') :
                                (frequentlyUsedResources[i].ty == 2) ? frequentlyUsedResources[i].ti + ' (' + frequentlyUsedResources[i].text + ')' :
                                frequentlyUsedResources[i].ti.replace(/<.*?>/g, '');
                            furHtml += '<div class="lzm-unselectable" style="margin: 2px; padding: 2px; text-overflow: ellipsis;' +
                                ' overflow-x: hidden; white-space: nowrap;' +
                                ' cursor: pointer;" onclick="useEditorQrdPreview(\'' + frequentlyUsedResources[i].rid + '\');">' +
                                resourceText + '</div>';
                        }
                        $('#chat-qrd-preview').html(furHtml);
                        lzm_chatDisplay.createChatWindowLayout(true);
                        $('#chat-progress').scrollTop($('#chat-progress')[0].scrollHeight);
                    }
                }
            }
        }, 500);
        lzm_chatPollServer.typingPollCounter = 0;
        lzm_chatPollServer.typingChatPartner = lzm_chatDisplay.active_chat_reco;
    } else {
        $('#chat-qrd-preview').html('');
        lzm_chatDisplay.createChatWindowLayout(true);
    }
}

function useEditorQrdPreview(resourceId) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId), resourceHtmlText;
    if (resource != null) {
        switch (resource.ty) {
            case '1':
                resourceHtmlText = ((app == 1) || isMobile) ? resource.text.replace(/<.*?>/g, '') : resource.text;
                break;
            case '2':
                var linkHtml = '<a href="' + resource.text + '" class="lz_chat_link" target="_blank">' + resource.ti + '</a>';
                resourceHtmlText = ((app == 1) || isMobile) ? resource.text : linkHtml;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+').replace(/<.*?>/g, ''));
                var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
                var fileId = resource.text.split('_')[1];
                var thisServer = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url;
                var thisFileUrl = thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    thisFileUrl += 'ws=' + multiServerId + '&';
                }
                thisFileUrl += 'acid=' + acid + '&file=' + urlFileName + '&id=' + fileId;
                var fileHtml = '<a ' +
                    'href="' + thisFileUrl + '" ' +
                    'class="lz_chat_file" target="_blank">' + resource.ti.replace(/<.*?>/g, '') + '</a>';
                resourceHtmlText = ((app == 1) || isMobile) ? thisFileUrl : fileHtml;
                break;
        }
        setEditorContents(resourceHtmlText);
    }
    $('#chat-qrd-preview').html('');
}

function slowDownPolling(doSlowDown, secondCall) {
    secondCall = (typeof secondCall != 'undefined') ? secondCall : false;
    if (doSlowDown) {
        if (lzm_chatPollServer.slowDownPolling1 > lzm_chatPollServer.slowDownPolling2) {
            lzm_chatPollServer.slowDownPolling = true;
            lzm_chatPollServer.startPolling();
        } else if (!secondCall) {
            lzm_chatPollServer.slowDownPolling1 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
            setTimeout(function() {
                slowDownPolling(true, true);
            }, 20000);
        }
    } else {
        lzm_chatPollServer.slowDownPolling = false;
        lzm_chatPollServer.slowDownPolling2 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        lzm_chatPollServer.startPolling();
    }
}

function setAppBackground(isInBackground) {
    if (isInBackground) {
        lzm_chatPollServer.appBackground = 1;
        lzm_chatPollServer.startPolling();
    } else {
        lzm_chatPollServer.appBackground = 0;
        lzm_chatPollServer.startPolling();
    }
}

function startBackgroundTask() {
    try {
        lzm_deviceInterface.startBackgroundTask();
    } catch(ex) {}
}

function setLocation(latitude, longitude) {
    lzm_chatPollServer.location = {latitude: latitude, longitude: longitude};
}

function stopPolling() {
    lzm_chatPollServer.stopPolling();
}

function startPolling() {
    lzm_chatPollServer.startPolling();
}

function resetWebApp() {
    showAppIsSyncing();
    lzm_chatServerEvaluation.resetWebApp();
    lzm_chatUserActions.resetWebApp();
    lzm_chatPollServer.resetWebApp();
    lzm_chatDisplay.resetWebApp();

    lzm_chatPollServer.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
}

function logout(askBeforeLogout, logoutFromDeviceKey, e) {
    if (typeof e != 'undefined') {
        e.stopPropagation()
    }
    logoutFromDeviceKey = (typeof logoutFromDeviceKey != 'undefined') ? logoutFromDeviceKey : false;
    lzm_chatDisplay.showUsersettingsHtml = false;
    $('#usersettings-menu').css({'display': 'none'});
    if (!askBeforeLogout ||
        (logoutFromDeviceKey && (
            (lzm_chatDisplay.openChats.length == 0 && confirm(t('Do you really want to log out?'))) ||
            (lzm_chatDisplay.openChats.length != 0 && confirm(t('There are still open chats, do you want to leave them?'))))
        ) ||
        (!logoutFromDeviceKey &&
            (lzm_chatDisplay.openChats.length == 0 || confirm(t('There are still open chats, do you want to leave them?')))
        )) {
            lzm_chatDisplay.stopRinging([]);
            var ticketFilterPersonal = (lzm_chatPollServer.dataObject.p_dt_fp == '1') ? true : false;
            var ticketFilterGroup = (lzm_chatPollServer.dataObject.p_dt_fg == '1') ? true : false;
            lzm_commonStorage.saveValue('qrd_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatServerEvaluation.cannedResources.getResourceList()));
            lzm_commonStorage.saveValue('qrd_request_time_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatServerEvaluation.resourceLastEdited));
            lzm_commonStorage.saveValue('qrd_id_list_' + lzm_chatServerEvaluation.myId, JSON.stringify([]));
            lzm_commonStorage.saveValue('ticket_max_read_time_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketMaxRead));
            lzm_commonStorage.saveValue('ticket_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketReadArray));
            lzm_commonStorage.saveValue('ticket_unread_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketUnreadArray));
            lzm_commonStorage.saveValue('ticket_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketFilter));
            lzm_commonStorage.saveValue('ticket_sort_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketSort));
            lzm_commonStorage.saveValue('email_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.emailReadArray));
            lzm_commonStorage.saveValue('accepted_chats_' + lzm_chatServerEvaluation.myId, lzm_chatUserActions.acceptedChatCounter);
            lzm_commonStorage.saveValue('qrd_search_categories_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.qrdSearchCategories));
            lzm_commonStorage.saveValue('qrd_recently_used_' + lzm_chatServerEvaluation.myId, JSON.stringify([]));
            lzm_commonStorage.deleteKeyValuePair('qrd_recently_used' + lzm_chatServerEvaluation.myId);
            lzm_commonStorage.saveValue('qrd_selected_tab_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.selectedResourceTab));
            lzm_commonStorage.saveValue('archive_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.chatArchiveFilter));
            lzm_commonStorage.saveValue('first_visible_view_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.firstVisibleView));
            lzm_commonStorage.saveValue('ticket_filter_personal_' + lzm_chatServerEvaluation.myId, JSON.stringify(ticketFilterPersonal));
            lzm_commonStorage.saveValue('ticket_filter_group_' + lzm_chatServerEvaluation.myId, JSON.stringify(ticketFilterGroup));
            lzm_chatDisplay.askBeforeUnload = false;
            lzm_displayHelper.blockUi({message: t('Signing off...')});
            lzm_chatPollServer.logout();
            setTimeout(function() {
                if (!lzm_chatPollServer.serverSentLogoutResponse) {
                    lzm_chatPollServer.finishLogout();
                }
            }, 10000);
    }
}

function inviteOtherOperator(guest_id, guest_b_id, chat_id, invite_id, invite_name, invite_group, chat_no) {
    lzm_chatUserActions.inviteOtherOperator(guest_id, guest_b_id, chat_id, invite_id, invite_name, invite_group,
        chat_no);
}

function createActiveChatHtml() {
    if (lzm_chatDisplay.lastChatSendingNotification == '' && lzm_chatDisplay.active_chat_reco != '') {
        lzm_chatDisplay.createChatHtml(null, lzm_chatDisplay.active_chat_reco);
    } else if (lzm_chatDisplay.lastChatSendingNotification != '') {
        openLastActiveChat('panel');
    }
    lzm_displayHelper.removeBrowserNotification();
}

function openLastActiveChat(caller) {
    var now = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    if (now - lzm_chatDisplay.lastActiveCalledAt > 1000 || lzm_chatDisplay.lastActiveCallCounter < 5) {
        lzm_chatDisplay.lastActiveCalledAt = now;
        lzm_chatDisplay.lastActiveCallCounter++;
        var chatToOpen = '';
        if (typeof caller != 'undefined' && caller == 'notification') {
            chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
        } else if (typeof caller != 'undefined' && caller == 'panel' && lzm_chatDisplay.lastChatSendingNotification != '') {
            chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
        } else {
            chatToOpen = lzm_chatDisplay.lastActiveChat;
        }
        lzm_chatDisplay.lastChatSendingNotification = '';
        var id, b_id, chat_id, userid, name, userChat = lzm_chatServerEvaluation.userChats.getUserChat(chatToOpen), operator = null, group = null;
        if (typeof chatToOpen != 'undefined' && chatToOpen != '' && userChat != null && (userChat.status == 'new' ||
            userChat.status == 'read' || $.inArray(chatToOpen, lzm_chatDisplay.closedChats) == -1)) {
            if (chatToOpen.indexOf('~') != -1) {
                id = chatToOpen.split('~')[0];
                b_id = chatToOpen.split('~')[1];
                chat_id = lzm_chatServerEvaluation.userChats.getUserChat(chatToOpen).chat_id;
                viewUserData(id, b_id, chat_id, true);
            } else {
                id = chatToOpen;
                operator = lzm_chatServerEvaluation.operators.getOperator(id);
                group = lzm_chatServerEvaluation.groups.getGroup(id);
                if (operator != null) {
                    userid = operator.userid;
                    name = operator.name;
                } else if (group != null) {
                    userid = group.id;
                    name = group.name;
                } else if (id == 'everyoneintern') {
                    userid = id;
                    name = t('All operators');
                } else {
                    userid = id;
                    name = id;
                }
                chatInternalWith(id, userid, name);
            }
            setTimeout(function() {
                setFocusToEditor();
                lzm_chatDisplay.lastActiveCallCounter = 0;
            },150);
        } else {
            var lastActiveUserChat = lzm_chatServerEvaluation.userChats.getLastActiveUserChat();
            if (lastActiveUserChat != null) {
                if (typeof lastActiveUserChat.b_id != 'undefined') {
                    viewUserData(lastActiveUserChat.id, lastActiveUserChat.b_id, lastActiveUserChat.chat_id, true);
                } else {
                    id = lastActiveUserChat.id;
                    operator = lzm_chatServerEvaluation.operators.getOperator(id);
                    group = lzm_chatServerEvaluation.groups.getGroup(id);
                    if (operator != null) {
                        userid = operator.userid;
                        name = operator.name;
                    } else if (group != null) {
                        userid = group.id;
                        name = group.name;
                    } else if (id == 'everyoneintern') {
                        userid = id;
                        name = t('All operators');
                    } else {
                        userid = id;
                        name = id;
                    }
                    chatInternalWith(id, userid, name);
                }
            }
        }
    }
}

function chatInternalWith(id, userid, name, fromOpList) {
    if (lzm_chatDisplay.lastActiveChat != id) {
        $('#chat-qrd-preview').html('');
    }
    fromOpList = (typeof fromOpList != 'undefined') ? fromOpList : false;
    var group = lzm_chatServerEvaluation.groups.getGroup(id);
    var i = 0, myAction = 'chat', meIsInGroup = false;
    if (group != null && typeof group.members != 'undefined') {
        for (i=0; i<group.members.length; i++) {
            if (group.members[i].i == lzm_chatServerEvaluation.myId) {
                meIsInGroup = true;
            }
        }
        if (meIsInGroup) {
            myAction = 'chat';
        } else if (lzm_commonPermissions.checkUserPermissions(lzm_chatServerEvaluation.myId, 'group', '', group)) {
            myAction = 'join';
        } else {
            myAction = 'no_perm';
        }
    }
    if (myAction == 'no_perm') {
        showNoPermissionMessage();
    } else {
        var tmpArray = [];
        for (i=0; i<lzm_chatDisplay.closedChats.length; i++) {
            if (lzm_chatDisplay.closedChats[i] != id) {
                tmpArray.push(lzm_chatDisplay.closedChats[i]);
            }
        }
        lzm_chatDisplay.closedChats = tmpArray;
        lzm_chatDisplay.lastActiveChat = id;
        lzm_chatUserActions.chatInternalWith(id, userid, name, fromOpList);
        if (myAction == 'join') {
            lzm_chatUserActions.saveDynamicGroup('add', group.id, '', lzm_chatServerEvaluation.myId, {});
        }
    }
}

function setUserStatus(statusValue, myName, myUserId, e) {
    e.stopPropagation();
    var previousStatusValue = lzm_chatPollServer.user_status;
    lzm_chatDisplay.setUserStatus(statusValue, myName, myUserId);
    if (statusValue != 2 && previousStatusValue != 2 && statusValue != previousStatusValue) {
        lzm_chatPollServer.startPolling();
    }
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.setOperatorStatus(parseInt(statusValue));
        } catch(e) {}
    }
}

function viewUserData(id, b_id, chat_id, freeToChat) {
    if (lzm_chatDisplay.lastActiveChat != id + '~' + b_id) {
        $('#chat-qrd-preview').html('');
    }
    lzm_chatDisplay.lastActiveChat = id + '~' + b_id;
    lzm_chatUserActions.viewUserData(id, b_id, chat_id, freeToChat);
}

function showVisitorInvitation(id) {
    if (lzm_commonPermissions.checkUserPermissions('', 'chats', 'send_invites', {})) {
        if (visitorHasNotCanceled(id) || confirm(t('This visitor has already declined an invitation.\nInvite this visitor again?'))) {
            var storedInvitationId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-invitation' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == id) {
                        storedInvitationId = key;
                    }
                }
            }
            if (storedInvitationId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedInvitationId);
            } else {
                var aVisitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
                aVisitor = (aVisitor != null) ? aVisitor : {id: '', b_id: ''};
                lzm_chatDisplay.showVisitorInvitation(aVisitor);
            }
        }
    } else {
        showNoPermissionMessage();
    }
}

function startVisitorChat(id) {
    if (lzm_commonPermissions.checkUserPermissions('', 'chats', 'start_new', {})) {
        lzm_chatPollServer.pollServerSpecial({visitorId: id, browserId: id + '_OVL'}, 'start_overlay');
    } else {
        showNoPermissionMessage();
    }
}

function visitorHasNotCanceled(id) {
    var rtValue = true;
    var aVisitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
    aVisitor = (aVisitor != null) ? aVisitor : {id: '', b_id: ''};
    if (typeof aVisitor.r != 'undefined' && aVisitor.r.length > 0) {
        for (var i=0; i< aVisitor.r.length; i++) {
            if (aVisitor.r[i].de == 1) {
                rtValue = false;
            }
        }
    }
    return rtValue;
}

function inviteExternalUser(id, b_id, text) {
    lzm_chatUserActions.inviteExternalUser(id, b_id, text);
}

function cancelInvitation(id) {
    var inviter = '';
    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
    try {
        inviter = visitor.r[0].s;
    } catch(e) {}
    if ((lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites_others', {})) ||
        (lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && (inviter == lzm_chatDisplay.myId || inviter == ''))) {
        lzm_chatUserActions.cancelInvitation(id);
    } else {
        showNoPermissionMessage();
    }
}

function selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group, forward_text, chat_no) {
    lzm_chatUserActions.selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group,
        forward_text, chat_no);
}

function catchEnterButtonPressed(e) {
    return lzm_chatDisplay.catchEnterButtonPressed(e);
}

function handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId) {
    lzm_chatUserActions.handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId);
}

function selectVisitor(e, visitorId) {
    lzm_chatGeoTrackingMap.selectedVisitor = visitorId;
    $('#visitor-list').data('selected-visitor', visitorId);
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');
}

function showVisitorInfo(userId, userName,  chatId, activeTab) {
    activeTab = (typeof activeTab != 'undefined') ? activeTab : 0;
    userName = (typeof userName != 'undefined') ? userName : '';
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
        limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
        filter: lzm_chatPollServer.chatArchiveFilter};
    window['tmp-ticket-values'] = {page: lzm_chatPollServer.ticketPage, limit: lzm_chatPollServer.ticketLimit,
        query: lzm_chatPollServer.ticketQuery, filter: lzm_chatPollServer.ticketFilter,
        sort: lzm_chatPollServer.ticketSort};
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.chatArchiveLimit = 1000;
    lzm_chatPollServer.chatArchiveQuery = '';
    lzm_chatPollServer.chatArchiveFilter = '';
    lzm_chatPollServer.chatArchiveFilterExternal = userId;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.ticketLimit = 1000;
    lzm_chatPollServer.ticketQuery = userId;
    lzm_chatPollServer.ticketFilter = '0123';
    lzm_chatPollServer.ticketSort = '';
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.resetChats = true;
    var storedInvitationId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-information' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == userId) {
                storedInvitationId = key;
            }
        }
    }
    if (storedInvitationId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedInvitationId);
    } else {
        var thisUser = {id: userId, unique_name: userName};
        if (typeof userId != 'undefined') {
            var visitor = lzm_chatServerEvaluation.visitors.getVisitor(userId);
            thisUser = (visitor != null) ? visitor : thisUser;
        }

        if (typeof userId != 'undefined' && userId != '') {
            lzm_chatDisplay.infoUser = thisUser;
            lzm_chatDisplay.showVisitorInformation(thisUser, chatId, activeTab);
            switchTicketListPresentation(ticketFetchTime, 0);
            switchArchivePresentation(chatFetchTime, 0);
        }
    }
    lzm_chatPollServer.startPolling();
}

function showFilterCreation(visitorId) {
    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
    if (visitor != null) {
        lzm_chatDisplay.showFilterCreation(visitor);
    }
}

function saveFilter(type) {
    type = (type == 'add') ? 0 : (type == 'edit') ? 1 : 2;
    var activeCheck = ($('#filter-active').attr('checked') == 'checked') ? 1 : 0;
    var ipCheck = ($('#filter-ip-check').attr('checked') == 'checked') ? 1 : 0;
    var idCheck = ($('#filter-id-check').attr('checked') == 'checked') ? 1 : 0;
    var lgCheck = ($('#filter-lg-check').attr('checked') == 'checked') ? 1 : 0;
    var chatCheck = ($('#filter-chat-check').attr('checked') == 'checked') ? 1 : 0;
    var expires = (!isNaN(parseInt($('#filter-expire-after').val()))) ? parseInt($('#filter-expire-after').val()) : 7;
    expires = expires * 24 * 60 * 60;// + lzm_chatTimeStamp.getServerTimeString(null, true);
    expires = ($('#filter-exp-check').attr('checked') == 'checked') ? expires : -1;
    var filter = {creator: lzm_chatDisplay.myId, editor: lzm_chatDisplay.myId, vip: $('#filter-ip').val(), vid: $('#filter-id').val(),
        expires: expires, fname: $('#filter-name').val(), freason: $('#filter-reason').val(), fid: md5(Math.random().toString()),
        state: activeCheck, type: type, exertion: $('#filter-type').val(), lang: $('#filter-lg').val(), active_vid: idCheck,
        active_vip: ipCheck, active_lang: lgCheck, active_chats: chatCheck};
    lzm_chatPollServer.pollServerSpecial(filter, 'visitor-filter');
}

function loadChatInput(active_chat_reco) {
    return lzm_chatUserActions.loadChatInput(active_chat_reco);
}

function saveChatInput(active_chat_reco, text) {
    lzm_chatUserActions.saveChatInput(active_chat_reco, text);
}

function doMacMagicStuff() {
    if (app == 0) {
        $(window).trigger('resize');
        setTimeout(function() {
            lzm_chatDisplay.createHtmlContent(lzm_chatPollServer.thisUser, lzm_chatDisplay.active_chat_reco);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(true);
        }, 10);
    }
}

function showTranslateOptions(visitorChat, language) {
    if (lzm_chatServerEvaluation.otrs != '') {
        lzm_chatDisplay.showTranslateOptions(visitorChat, language);
    } else {
        var noGTranslateKeyWarning1 = t('LiveZilla can translate your conversations in real time. This is based upon Google Translate.');
        var noGTranslateKeyWarning2 = t('To use this functionality, you have to add a Google API key.');
        var noGTranslateKeyWarning3 = t('For further information, see LiveZilla Server Admin -> LiveZilla Server Configuration -> Chats.');
        var noGTranslateKeyWarning = t('<!--phrase1--><br /><br /><!--phrase2--><br /><!--phrase3-->',
            [['<!--phrase1-->', noGTranslateKeyWarning1], ['<!--phrase2-->', noGTranslateKeyWarning2], ['<!--phrase3-->', noGTranslateKeyWarning3]]);
        lzm_commonDialog.createAlertDialog(noGTranslateKeyWarning, [{id: 'ok', name: t('Ok')}]);
        $('#alert-btn-ok').click(function() {
            lzm_commonDialog.removeAlertDialog();
        });
    }
}

function sendTranslatedChat(chatMessage) {
    var chatReco = (typeof lzm_chatDisplay.active_chat_reco != 'undefined' && lzm_chatDisplay.active_chat_reco != '') ? lzm_chatDisplay.active_chat_reco : lzm_chatDisplay.lastActiveChat;
    var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(chatReco), visitorChat = chatReco + '~00000';
    if (visitorBrowser[1] != null) {
        visitorChat = visitorBrowser[0].id + '~' + visitorBrowser[1].id + '~' + visitorBrowser[1].chat.id;
    }
    if (lzm_chatServerEvaluation.otrs != '' &&
        typeof lzm_chatDisplay.chatTranslations[visitorChat] != 'undefined' && lzm_chatDisplay.chatTranslations[visitorChat].tmm != null &&
        lzm_chatDisplay.chatTranslations[visitorChat].tmm.translate &&
        lzm_chatDisplay.chatTranslations[visitorChat].tmm.sourceLanguage != lzm_chatDisplay.chatTranslations[visitorChat].tmm.targetLanguage) {
        lzm_chatUserActions.translateTextAndSend(visitorChat, chatMessage);
    } else {
        sendChat(chatMessage);
    }
}

function sendChat(chatMessage, translatedChatMessage, visitorChat) {
    translatedChatMessage = (typeof translatedChatMessage != 'undefined') ? translatedChatMessage : '';
    var chat_reco = (typeof lzm_chatDisplay.active_chat_reco != 'undefined' && lzm_chatDisplay.active_chat_reco != '') ?
        lzm_chatDisplay.active_chat_reco : lzm_chatDisplay.lastActiveChat;
    visitorChat = (typeof visitorChat != 'undefined') ? visitorChat : chat_reco + '~00000';
    if (lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat) != null ||
        lzm_chatServerEvaluation.userChats.getUserChat(chat_reco) != null) {
        lzm_chatUserActions.deleteChatInput(chat_reco);
        try {
            lzm_chatServerEvaluation.userChatObjects.setUserChat(chat_reco, {status: 'read'});
        } catch(e) {}
        chatMessage = (typeof chatMessage != 'undefined' && chatMessage != '') ? chatMessage : grabEditorContents();
        if (chatMessage != '') {
            lzm_chatPollServer.typingChatPartner = '';
            var new_chat = {};
            new_chat.id = md5(String(Math.random())).substr(0, 32);
            new_chat.rp = '';
            new_chat.sen = lzm_chatServerEvaluation.myId;
            new_chat.rec = '';
            new_chat.reco = chat_reco;
            var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
            new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
            new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            lzm_chatServerEvaluation.chatMessageCounter++;
            new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
            new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
            var chatText = chatMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, "<br />");
            chatText = chatText.replace(/<script/g,'&lt;script').replace(/<\/script/g,'&lt;/script');
            chatText = lzm_chatServerEvaluation.addLinks(chatText);
            new_chat.text = chatText;
            if (translatedChatMessage != '') {
                var translatedText = translatedChatMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, "<br />");
                translatedText = translatedText.replace(/<script/g,'&lt;script').replace(/<\/script/g,'&lt;/script');
                translatedText = lzm_chatServerEvaluation.addLinks(translatedText);
                new_chat.tr = translatedText;
            }
            var os = '';
            if (isMobile) {
                os = mobileOS;
            }
            clearEditorContents(os, lzm_chatDisplay.browserName, 'send');
            lzm_chatUserActions.sendChatMessage(new_chat, translatedChatMessage, visitorChat);

            lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            lzm_chatDisplay.createChatHtml(lzm_chatPollServer.thisUser, chat_reco);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(true);
        }
    } else {
        inviteExternalUser(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.b_id);
    }
    if(isMobile || app == 1) {
        setTimeout(function() {doMacMagicStuff();}, 5);
    }
}

function createUserControlPanel() {
    var counter=1;
    var repeatThis = setInterval(function() {
        lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
            lzm_chatServerEvaluation.myUserId);
        counter++;
        if (counter >= 60 || lzm_chatServerEvaluation.myName != '' || lzm_chatServerEvaluation.myUserId != '') {
            clearInterval(repeatThis);
            //showAppDownloadLink();
            lzm_displayHelper.unblockUi();
        }
    },250);
}

function testDrag(change) {
    var thisVisitorList = $('#visitor-list');
    if (typeof change == 'undefined' || change == '' || change == 0) {
        var y = window.event.pageY;
        lzm_chatDisplay.visitorListHeight = thisVisitorList.height() + $('#chat').position().top + thisVisitorList.position().top - y + 11;
    } else {
        var newHeight = lzm_chatDisplay.visitorListHeight + change;
        if (newHeight >= 62) {
            lzm_chatDisplay.visitorListHeight = newHeight;
        }
    }
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
    if (lzm_chatDisplay.selected_view == 'external') {
        lzm_chatDisplay.createVisitorList();
    }
    lzm_chatDisplay.createChatHtml(lzm_chatDisplay.thisUser, lzm_chatDisplay.active_chat_reco);
    return false;
}

function manageUsersettings(e) {
    e.stopPropagation();
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    /*removeEditor();
    if (lzm_chatDisplay.displayWidth == 'small') {
        lzm_chatServerEvaluation.settingsDialogue = true;
        lzm_chatDisplay.settingsDialogue = true;
    }*/
    var storedSettingsId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'settings') {
                storedSettingsId = key;
            }
        }
    }
    if (storedSettingsId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
    } else {
        lzm_chatUserActions.manageUsersettings();
    }
}

function saveUserSettings() {
    var firstVisibleView = null;
    var showViewSelectPanel = {
        'home': $('#show-home').prop('checked') ? 1 : 0,
        'world': $('#show-world').prop('checked') ? 1 : 0,
        'mychats': $('#show-mychats').prop('checked') ? 1 : 0,
        'tickets': $('#show-tickets').prop('checked') ? 1 : 0,
        'external': $('#show-external').prop('checked') ? 1 : 0,
        'internal': $('#show-internal').prop('checked') ? 1 : 0,
        'qrd': $('#show-qrd').prop('checked') ? 1 : 0,
        'archive': $('#show-archive').prop('checked') ? 1 : 0/*,
        'filter': $('#show-filter').prop('checked') ? 1 : 0*/
    };
    var viewSelectArray = [], viewSelectObject = {}, i = 0, thisColumn, columnIsVisible;
    var allViewsArray = Object.keys(lzm_chatDisplay.allViewSelectEntries);
    for (i=0; i<allViewsArray.length; i++) {
        viewSelectObject[allViewsArray[i]] =
            {name: lzm_chatDisplay.allViewSelectEntries[allViewsArray[i]].title, icon: lzm_chatDisplay.allViewSelectEntries[allViewsArray[i]].icon};
    }
    $('.show-view-div').each(function() {
        var viewId = $(this).data('view-id');
        if (firstVisibleView == null && showViewSelectPanel[viewId] != 0) {
            firstVisibleView = viewId;
        }
        viewSelectArray.push({id: viewId, name: viewSelectObject[viewId].name, icon: viewSelectObject[viewId].icon});
    });
    lzm_chatDisplay.viewSelectArray = viewSelectArray;
    var tableNames = ['visitor', 'archive', 'ticket'];
    var tableColumns = {};
    for (var j=0; j<tableNames.length; j++) {
        tableColumns[tableNames[j]] = {general: [], custom: []};
        for (i=0; i<lzm_chatDisplay.mainTableColumns[tableNames[j]].length; i++) {
            thisColumn = lzm_chatDisplay.mainTableColumns[tableNames[j]][i];
            thisColumn.display = ($('#display-' + tableNames[j] + '-column-' + thisColumn.cid).prop('checked')) ? 1 : 0;
            tableColumns[tableNames[j]].general.push(thisColumn);
        }
        for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
            var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
            if (myCustomInput != null && parseInt(myCustomInput.id) < 111 && myCustomInput.active == '1') {
                columnIsVisible = ($('#display-' + tableNames[j] + '-column-custom-' + myCustomInput.id).prop('checked')) ? 1 : 0;
                thisColumn = {cid: myCustomInput.id, display: columnIsVisible};
                tableColumns[tableNames[j]].custom.push(thisColumn);
            }
        }
    }
    var settings = {
        volume: $('#volume-slider').val(),
        awayAfterTime: $('#away-after-time').val(),
        playNewMessageSound: $('#sound-new-message').prop('checked') ? 1 : 0,
        playNewChatSound: $('#sound-new-chat').prop('checked') ? 1 : 0,
        repeatNewChatSound: $('#sound-repeat-new-chat').prop('checked') ? 1 : 0,
        backgroundMode: $('#background-mode').prop('checked') ? 1 : 0,
        saveConnections: $('#save-connections').prop('checked') ? 1 : 0,
        ticketsRead: $('#tickets-read').prop('checked') ? 1 : 0,
        playNewTicketSound: $('#sound-new-ticket').prop('checked') ? 1 : 0,
        showViewSelectPanel: showViewSelectPanel,
        viewSelectArray: viewSelectArray,
        autoAccept: $('#auto-accept').prop('checked') ? 1 : 0,
        tableColumns: tableColumns,
        vibrateNotifications: $('#vibrate-notifications').prop('checked') ? 1 : 0
    };
    if (appOs == 'blackberry') {
        settings.backgroundMode = 1;
    }
    lzm_chatUserActions.saveUserSettings(settings, multiServerId, app==1);
    lzm_chatDisplay.createViewSelectPanel(firstVisibleView);
    if (lzm_chatDisplay.selected_view == 'internal') {
        lzm_chatDisplay.createVisitorList();
    }
}

function manageTranslations() {
    if (lzm_chatDisplay.displayWidth == 'small') {
        lzm_chatServerEvaluation.settingsDialogue = true;
        lzm_chatDisplay.settingsDialogue = true;
    }
    lzm_chatUserActions.manageTranslations();
}

function finishSettingsDialogue() {
    lzm_chatServerEvaluation.settingsDialogue = false;
    lzm_chatDisplay.settingsDialogue = false;
    $('#usersettings-container').css({display: 'none'});
    if (lzm_chatDisplay.selected_view == 'mychats') {
        initEditor(loadChatInput(lzm_chatDisplay.active_chat_reco), 'finishSettings');
    }
}

function editTranslations() {
    lzm_chatUserActions.editTranslations($('#existing-language').val(), $('#new-language').val());
}

function saveTranslations(numberOfStrings) {
    finishSettingsDialogue();
    var stringObjects = [];
    for (var i=0; i<numberOfStrings; i++) {
        var thisStringObject = {en: $('#orig-string-'+i).val()};
        thisStringObject[lzm_chatDisplay.editThisTranslation] = $('#trans-string-'+i).val();
        stringObjects.push(thisStringObject);
    }
    lzm_t.saveTranslations(lzm_chatDisplay.editThisTranslation, stringObjects);
    lzm_chatDisplay.editThisTranslation = '';
    $('#translation-container').css('display', 'none');
}

function cancelTranslations() {
    finishSettingsDialogue();
    lzm_chatDisplay.editThisTranslation = '';
    $('#translation-container').css('display', 'none');
}

function t(translateString, placeholderArray) {
    return this.lzm_t.translate(translateString, placeholderArray);
}

function openOrCloseFolder(resourceId, onlyOpenFolders) {
    var folderDiv = $('#folder-' + resourceId);
    if (folderDiv.html() != "") {
        var markDiv = $('#resource-' + resourceId + '-open-mark');
        var bgCss;
        if (folderDiv.css('display') == 'none') {
            folderDiv.css('display', 'block');
            bgCss = {'background-image': lzm_displayHelper.addBrowserSpecificGradient('url("img/minus.png")'),
                'background-repeat': 'no-repeat', 'background-position': 'center'};
            markDiv.css(bgCss);
            if ($.inArray(resourceId, lzm_chatDisplay.openedResourcesFolder) == -1) {
                lzm_chatDisplay.openedResourcesFolder.push(resourceId);
            }
        } else if (!onlyOpenFolders) {
            folderDiv.css('display', 'none');
            bgCss = {'background-image': lzm_displayHelper.addBrowserSpecificGradient('url("img/plus.png")'),
                'background-repeat': 'no-repeat', 'background-position': 'center'};
            markDiv.css(bgCss);
            var tmpOpenedFolder = [];
            for (var i=0; i<lzm_chatDisplay.openedResourcesFolder.length; i++) {
                if (resourceId != lzm_chatDisplay.openedResourcesFolder[i]) {
                    tmpOpenedFolder.push(lzm_chatDisplay.openedResourcesFolder[i]);
                }
            }
            lzm_chatDisplay.openedResourcesFolder = tmpOpenedFolder;
        }
    }
}

function handleResourceClickEvents(resourceId, onlyOpenFolders) {
    removeQrdContextMenu();
    onlyOpenFolders = (typeof onlyOpenFolders != 'undefined') ? onlyOpenFolders : false;
    lzm_chatDisplay.selectedResource = resourceId;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null) {
        $('.resource-div').removeClass('selected-resource-div');
        $('.qrd-search-line').removeClass('selected-table-line');
        $('.qrd-recently-line').removeClass('selected-table-line');
        lzm_chatDisplay.highlightSearchResults(lzm_chatServerEvaluation.cannedResources.getResourceList(), false);
        $('#resource-' + resourceId).addClass('selected-resource-div');
        $('#qrd-search-line-' + resourceId).addClass('selected-table-line');
        $('#qrd-recently-line-' + resourceId).addClass('selected-table-line');
        $('.qrd-change-buttons').addClass('ui-disabled');
        switch (Number(resource.ty)) {
            case 0:
                openOrCloseFolder(resourceId, onlyOpenFolders);
                if ($.inArray(resourceId, ['3', '5']) == -1) {
                    if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                        $('#edit-qrd').removeClass('ui-disabled');
                    }
                    if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                        $('#add-qrd').removeClass('ui-disabled');
                    }
                    if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                        $('#delete-qrd').removeClass('ui-disabled');
                    }
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-or-edit-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            case 1:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#view-qrd').removeClass('ui-disabled');
                $('#preview-qrd').removeClass('ui-disabled');
                $('#send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-or-edit-qrd').removeClass('ui-disabled');
                }
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            case 2:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#view-qrd').removeClass('ui-disabled');
                $('#preview-qrd').removeClass('ui-disabled');
                $('#send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                $('#add-qrd-attachment').addClass('ui-disabled');
                break;
            default:
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
                $('#preview-qrd').removeClass('ui-disabled');
                $('#send-qrd-preview').removeClass('ui-disabled');
                $('#insert-qrd-preview').removeClass('ui-disabled');
                $('#add-qrd-attachment').removeClass('ui-disabled');
                break;
        }
    }
}

function addQrd() {
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'add-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        lzm_chatUserActions.addQrd();
    }
}

function deleteQrd() {
    removeQrdContextMenu();
    if (confirm(t('Do you want to delete this entry including subentries irrevocably?'))) {
        lzm_chatUserActions.deleteQrd();
    }
}

function renameQrd() {
    // Perhaps not needed
}

function editQrd() {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
            if ((lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) && resource.ty == 1) {
                showNotMobileMessage();
            } else {
                var storedPreviewId = '';
                for (var key in lzm_chatDisplay.StoredDialogs) {
                    if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                        if (lzm_chatDisplay.StoredDialogs[key].type == 'edit-resource' &&
                            typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                            lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                            storedPreviewId = key;
                        }
                    }
                }
                if (storedPreviewId != '') {
                    lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
                } else {
                    lzm_chatUserActions.editQrd(resource);
                }
            }
        } else {
            showNoPermissionMessage();
        }
    }
}

function previewQrd(chatPartner, qrdId, inDialog, menuEntry) {
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'preview-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        chatPartner = (typeof chatPartner != 'undefined') ? chatPartner : '';
        qrdId = (typeof qrdId != 'undefined') ? qrdId : lzm_chatDisplay.selectedResource;
        $('#preview-qrd').addClass('ui-disabled');
        lzm_chatUserActions.previewQrd(chatPartner, qrdId, inDialog, menuEntry);
    }
}

function getQrdDownloadUrl(resource) {
    var downloadUrl = lzm_chatServerEvaluation.serverProtocol + lzm_chatServerEvaluation.serverUrl + '/getfile.php?';
    if (multiServerId != '') {
        downloadUrl += 'ws=' + multiServerId + '&';
    }
    downloadUrl += 'acid=' + lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5) +
        '&file=' + resource.ti + '&id=' + resource.rid;
    return downloadUrl;
}

function showQrd(chatPartner, caller) {
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    removeEditor();
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'qrd-tree' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] == chatPartner) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        lzm_chatDisplay.createQrdTreeDialog(lzm_chatServerEvaluation.cannedResources.getResourceList(), chatPartner);
    }
}

function cancelQrd(closeToTicket) {
    cancelQrdPreview(0);
    lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
    if (closeToTicket != '') {
        var dialogId = lzm_chatDisplay.ticketDialogId[closeToTicket] + '_reply';
        if (typeof lzm_chatDisplay.ticketDialogId[closeToTicket] == 'undefined' || closeToTicket.indexOf('_reply') != -1) {
            dialogId = closeToTicket;
        }

        lzm_displayHelper.maximizeDialogWindow(dialogId);
    }
    openLastActiveChat();
}

function cancelQrdPreview(animationTime) {
    $('#preview-qrd').removeClass('ui-disabled');
    $('#qrd-preview-container').remove();
}

function sendQrdPreview(resourceId, chatPartner) {
    resourceId = (resourceId != '') ? resourceId : lzm_chatDisplay.selectedResource;
    lzm_chatServerEvaluation.cannedResources.riseUsageCounter(resourceId);
    var resourceHtmlText;
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null) {
        switch (resource.ty) {
            case '1':
                resourceHtmlText = resource.text;
                break;
            case '2':
                var linkHtml = '<a href="' + resource.text + '" class="lz_chat_link" target="_blank">' + resource.ti + '</a>';
                resourceHtmlText = linkHtml;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
                var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
                var fileId = resource.text.split('_')[1];
                var thisServer = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url;
                var fileHtml = '<a ' +
                    'href="' + thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    fileHtml += 'ws=' + multiServerId + '&';
                }
                fileHtml += 'acid=' + acid +
                    '&file=' + urlFileName +
                    '&id=' + fileId + '" ' +
                    'class="lz_chat_file" target="_blank">' + resource.ti + '</a>';
                resourceHtmlText = fileHtml;
                break;
        }
        var chatText = loadChatInput(chatPartner);
        if ((app == 1) || isMobile) {
            chatText = (chatText != '') ? chatText + ' ' : chatText;
            var resourceTextText = resourceHtmlText.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a.*?>/gi, '$2 ($1)').replace(/<.*?>/g, '').replace(/&[a-zA-Z0-9#]*?;/g, ' ');
            saveChatInput(chatPartner, chatText + resourceTextText);
        } else {
            chatText = (chatText != '') ? '<div>' + chatText + '</div>' : chatText;
            saveChatInput(chatPartner, chatText + resourceHtmlText);
        }
        cancelQrd();
        $('#qrd-tree-body').remove();
        $('#qrd-tree-footline').remove();
    }
}

function changeFile() {
    var maxFileSize = lzm_chatServerEvaluation.global_configuration.php_cfg_vars.upload_max_filesize;
    var file = $('#file-upload-input')[0].files[0];
    if(!file) {
        $('#file-upload-name').html('');
        $('#file-upload-size').html('');
        $('#file-upload-type').html('');
        $('#file-upload-progress').css({display: 'none'});
        $('#file-upload-numeric').html('');
        $('#file-upload-error').html('');
        $('#cancel-file-upload-div').css({display: 'none'});
        return;
    }

    var thisUnit = (file.size <= 10000) ? 'B' : (file.size <= 10240000) ? 'kB' : 'MB';
    var thisFileSize = (file.size <= 10000) ? file.size : (file.size <= 1024000) ? file.size / 1024 : file.size / 1048576;
    thisFileSize = Math.round(thisFileSize * 10) / 10;
    $('#file-upload-name').html(t('File name: <!--file_name-->', [['<!--file_name-->', file.name]]));
    $('#file-upload-size').html(t('File size: <!--file_size--> <!--unit-->', [['<!--file_size-->', thisFileSize],['<!--unit-->', thisUnit]]));
    $('#file-upload-type').html(t('File type: <!--file_type-->', [['<!--file_type-->', file.type]]));
    $('#file-upload-progress').css({display: 'none'});
    $('#file-upload-numeric').html('0%');
    $('#file-upload-error').html('');
    $('#cancel-file-upload-div').css({display: 'block'});

    if (file.size > maxFileSize) {
        $('#file-upload-input').val('');
        $('#file-upload-error').html(t('File size too large'));
    }
}

function uploadFile(fileType, parentId, rank, toAttachment) {
    $('#file-upload-progress').css({display: 'block'});
    $('#cancel-file-upload').removeClass('ui-disabled');
    var file = $('#file-upload-input')[0].files[0];

    lzm_chatPollServer.uploadFile(file, fileType, parentId, rank, toAttachment);
}

function cancelFileUpload() {
    lzm_chatPollServer.fileUploadClient.abort();
    $('#cancel-file-upload').addClass('ui-disabled');
}

function openQrdContextMenu(e, chatPartner, resourceId) {
    handleResourceClickEvents(resourceId, true);
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    var scrolledDownY = $('#qrd-tree-body').scrollTop();
    var scrolledDownX = $('#qrd-tree-body').scrollLeft();
    var parentOffset = $('#qrd-tree-body').offset();
    var yValue = e.pageY - parentOffset.top;
    var xValue = e.pageX - parentOffset.left;
    if (resource != null) {
        resource.chatPartner = chatPartner;

        lzm_chatDisplay.showContextMenu('qrd-tree', resource, xValue + scrolledDownX, yValue + scrolledDownY);
        e.preventDefault();
    }
}

function removeQrdContextMenu() {
    $('#qrd-tree-context').remove();
}

function openTicketContextMenu(e, ticketId, inDialog) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    removeTicketFilterMenu();
    selectTicket(ticketId, false, inDialog);
    var scrolledDownY, scrolledDownX, parentOffset;
    var place = (!inDialog) ? 'ticket-list' : 'visitor-information';
    scrolledDownY = $('#' + place +'-body').scrollTop();
    scrolledDownX = $('#' + place +'-body').scrollLeft();
    parentOffset = $('#' + place +'-body').offset();
    var xValue = e.pageX - parentOffset.left + scrolledDownX;
    var yValue = e.pageY - parentOffset.top + scrolledDownY;

    var ticket = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    lzm_chatDisplay.showTicketContextMenu = true;
    lzm_chatDisplay.showContextMenu(place, ticket, xValue, yValue);
    e.stopPropagation();
    e.preventDefault();
}

function showSubMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    lzm_chatDisplay.showSubMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight);
}

function showSuperMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight) {
    lzm_chatDisplay.showSuperMenu(place, category, objectId, contextX, contextY, menuWidth, menuHeight);
}

function removeTicketContextMenu() {
    lzm_chatDisplay.showTicketContextMenu = false;
    $('#ticket-list-context').remove();
    $('#visitor-information-context').remove();
}

function openTicketFilterMenu(e, filter) {
    e.stopPropagation();
    removeTicketContextMenu();
    if (lzm_chatDisplay.showTicketFilterMenu) {
        removeTicketFilterMenu();
    } else {
        var parentOffset = $('#ticket-filter').offset();
        var xValue = parentOffset.left;
        var yValue = parentOffset.top + 24;
        lzm_chatDisplay.showTicketFilterMenu = true;
        lzm_chatDisplay.showContextMenu('ticket-filter', {filter: filter,
            filter_personal: (lzm_chatPollServer.dataObject.p_dt_fp == 1),
            filter_group: (lzm_chatPollServer.dataObject.p_dt_fg == 1)}, xValue, yValue);
        e.preventDefault();
    }
}

function removeTicketFilterMenu() {
    lzm_chatDisplay.showTicketFilterMenu = false;
    $('#ticket-filter-context').remove();
}

function openTicketMessageContextMenu(e, ticketId, messageNumber, fromButton) {
    if (messageNumber != '') {
        handleTicketMessageClick(ticketId, messageNumber);
    } else {
        messageNumber = $('#ticket-history-table').data('selected-message');
    }
    var ticket = {}, xValue, yValue;
    var parentOffset = $('#ticket-history-placeholder-content-0').offset();
    var buttonPressed = '';
    if(!fromButton) {
        xValue = e.pageX - parentOffset.left + $('#ticket-history-placeholder-content-0').scrollLeft();
        yValue = e.pageY - parentOffset.top + $('#ticket-history-placeholder-content-0').scrollTop();
    } else {
        xValue = e.pageX - parentOffset.left;
        yValue = e.pageY - parentOffset.top;
        buttonPressed = 'ticket-message-actions';
    }
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }

    lzm_chatDisplay.showTicketMessageContextMenu = true;
    lzm_chatDisplay.showContextMenu('ticket-details', {ti: ticket, msg: messageNumber}, xValue, yValue, buttonPressed);
    e.preventDefault();
}

function removeTicketMessageContextMenu() {
    lzm_chatDisplay.showTicketMessageContextMenu = false;
    $('#ticket-details-context').remove();
}

function toggleTicketFilter(status, e) {
    e.stopPropagation();
    removeTicketFilterMenu();
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    var filterList = lzm_chatPollServer.ticketFilter.split('');
    if ($.inArray(status.toString(), filterList) != -1) {
        var pattern = new RegExp(status.toString());
        lzm_chatPollServer.ticketFilter = lzm_chatPollServer.ticketFilter.replace(pattern, '');
    } else {
        filterList.push(status);
        filterList.sort();
        lzm_chatPollServer.ticketFilter = filterList.join('');
    }
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function toggleTicketFilterPersonal(type, e) {
    e.stopPropagation();
    removeTicketFilterMenu();
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    if (type == 0) {
        if (lzm_chatPollServer.dataObject.p_dt_fp == '1') {
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fp');
        } else {
            lzm_chatPollServer.addPropertyToDataObject('p_dt_fp', '1');
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fg');
        }
    } else if (type == 1) {
        if (lzm_chatPollServer.dataObject.p_dt_fg == '1') {
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fg');
        } else {
            lzm_chatPollServer.addPropertyToDataObject('p_dt_fg', '1');
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fp');
        }
    }
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function pageTicketList(page) {
    $('.ticket-list-page-button').addClass('ui-disabled');
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketPage = page;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function switchTicketListPresentation(ticketFetchTime, counter, ticketId) {
    var loadingHtml, myWidth, myHeight;
    if (counter == 0) {
        if ($('#matching-tickets-table').length == 0) {
            loadingHtml = '<div id="ticket-list-loading"></div>';
            $('#ticket-list-body').append(loadingHtml).trigger('create');
            myWidth = $('#ticket-list-body').width() + 10;
            myHeight = $('#ticket-list-body').height() + 10;
            $('#ticket-list-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        } else {
            loadingHtml = '<div id="matching-ticket-list-loading"></div>';
            $('#visitor-info-placeholder-content-5').append(loadingHtml).trigger('create');
            myWidth = $('#visitor-info-placeholder-content-4').width() + 28;
            myHeight = $('#visitor-info-placeholder-content-4').height() + 48;
            $('#matching-ticket-list-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        }
    }
    if (ticketFetchTime != lzm_chatServerEvaluation.ticketFetchTime || counter >= 40) {
        if (typeof ticketId != 'undefined') {
            changeTicketReadStatus(ticketId, 'read', true, true);
        }
        if ($('#matching-tickets-table').length == 0) {
            lzm_chatDisplay.createTicketList(lzm_chatServerEvaluation.tickets,  lzm_chatServerEvaluation.ticketGlobalValues,
                lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
                false);
        } else {
            $('#matching-ticket-list-loading').remove();
            selectTicket('', true, true);
        }
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchTicketListPresentation(ticketFetchTime, counter, ticketId);}, delay);
    }
}

function showTicketDetails(ticketId, fromContext, emailId, chatId, dialogId) {
    var email = {id: ''}, chat = {cid: ''}, i;
    dialogId = (typeof dialogId != 'undefined') ? dialogId : '';
    if (typeof emailId != 'undefined' && emailId != '') {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            if (lzm_chatServerEvaluation.emails[i].id == emailId) {
                email = lzm_chatServerEvaluation.emails[i];
                email['dialog-id'] = dialogId
            }
        }
    }
    if (typeof chatId != 'undefined' && chatId != '') {
        for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                chat = lzm_chatServerEvaluation.chatArchive.chats[i];
                chat['dialog-id'] = dialogId;
            }
        }
    }
    if (ticketId != '') {
        selectTicket(ticketId);
        changeTicketReadStatus(ticketId, 'read', false, true);
    }
    if (!fromContext && lzm_chatDisplay.showTicketContextMenu) {
        removeTicketContextMenu();
    } else {
        removeTicketContextMenu();
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'ticket-details' &&
                    typeof lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] == ticketId) {
                    storedPreviewId = key;
                }
            }
        }
        if (storedPreviewId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        } else {
            var ticket = {};
            for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                    ticket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
            var isNew = (ticketId == '') ? true : false;
            lzm_chatDisplay.ticketDialogId[ticketId] = lzm_chatDisplay.showTicketDetails(ticket, isNew, email, chat, dialogId);
        }
    }
}

function showMessageForward(ticketId, messageNo) {
    removeTicketMessageContextMenu();
    var message = {}, ticketSender = '', group = '';
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
            ticketSender = lzm_chatDisplay.ticketListTickets[i].messages[0].fn;
            group = (typeof lzm_chatDisplay.ticketListTickets[i].editor != 'undefined' && lzm_chatDisplay.ticketListTickets[i].editor != false) ?
                lzm_chatDisplay.ticketListTickets[i].editor.g : lzm_chatDisplay.ticketListTickets[i].gr;
        }
    }
    lzm_chatDisplay.showMessageForward(message, ticketId, ticketSender, group);
}

function sendForwardedMessage(message, text, emailAddresses, emailSubject, ticketId, group, messageNo) {
    removeTicketMessageContextMenu();
    if (message.id == '') {
        for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
                text = message.mt;
                emailAddresses = message.em;
                emailSubject = (typeof message.s != 'undefined') ? message.s : '';
                group = (typeof lzm_chatDisplay.ticketListTickets[i].editor != 'undefined' && lzm_chatDisplay.ticketListTickets[i].editor != false) ?
                lzm_chatDisplay.ticketListTickets[i].editor.g : lzm_chatDisplay.ticketListTickets[i].gr;
            }
        }
    }
    var ticket = {mid: message.id, gr: group, em: emailAddresses, su: emailSubject, text: text, id: ticketId};
    lzm_chatPollServer.pollServerTicket(ticket, [], 'forward-to');
}

function moveMessageToNewTicket(ticketId, messageNo) {
    var message = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
        }
    }
    var ticket = {mid: message.id, id: ticketId};
    lzm_chatPollServer.pollServerTicket(ticket, [], 'move-message');
}

function selectTicket(ticketId, noUserInteraction, inDialog) {
    noUserInteraction = (typeof noUserInteraction != 'undefined') ? noUserInteraction : false;
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    var ticket, messageText, i;
    if (!inDialog) {
        if ($.inArray(ticketId, ['next', 'previous']) != -1) {
            if (lzm_chatDisplay.selectedTicketRow != '') {
                for (var j=0; j<lzm_chatDisplay.ticketListTickets.length; j++) {
                    if (lzm_chatDisplay.ticketListTickets[j].id == lzm_chatDisplay.selectedTicketRow) {
                        try {
                            ticketId = (ticketId == 'next') ?  lzm_chatDisplay.ticketListTickets[j + 1].id : lzm_chatDisplay.ticketListTickets[j - 1].id;
                        } catch(e) {
                            ticketId = lzm_chatDisplay.ticketListTickets[j].id;
                        }
                    }
                }
            } else {
                ticketId = lzm_chatDisplay.ticketListTickets[0].id
            }
        }
    } else {
        try {
            ticketId = (ticketId != '') ? ticketId : lzm_chatDisplay.ticketListTickets[0].id;
        } catch (e) {}
    }
    removeTicketContextMenu(inDialog);
    $('.ticket-list-row').removeClass('selected-table-line');
    if (ticketId != '' && !noUserInteraction && !lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile &&
        lzm_chatDisplay.selectedTicketRow == ticketId &&
        lzm_commonTools.checkTicketReadStatus(ticketId, lzm_chatDisplay.ticketReadArray) == -1 &&
        lzm_chatTimeStamp.getServerTimeString(null, false, 1) - ticketLineClicked >= 500) {
        changeTicketReadStatus(ticketId, 'read', false, true);
    }
    ticketLineClicked = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    lzm_chatDisplay.selectedTicketRow = ticketId;
    ticket = {};
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    if (!inDialog) {
        $('#ticket-list-row-' + ticketId).addClass('selected-table-line');
        if ($(window).width() > 1000) {
            try {
                messageText = lzm_commonTools.htmlEntities(ticket.messages[ticket.messages.length - 1].mt)
                    .replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
                $('#ticket-list-right').html(messageText);
            } catch(e) {}
        }
    } else/* if ($('#matching-ticket-list-row-' + ticketId).length > 0)*/ {
        $('#matching-ticket-list-row-' + ticketId).addClass('selected-table-line');
        messageText = '';
        try {
            messageText = lzm_commonTools.htmlEntities(ticket.messages[ticket.messages.length - 1].mt)
                .replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
        } catch (e) {}
        try {
            $('#ticket-content-inner').html('<legend>' + t('Text') + '</legend>' + messageText);
        } catch(e) {}
    }
}

function handleTicketMessageClick(ticketId, messageNumber) {
    removeTicketMessageContextMenu();
    if (!$('#message-details-inner').data('edit')) {
        var ticket = {}, i;
        for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                ticket = lzm_chatDisplay.ticketListTickets[i];
            }
        }
        $('.message-line').removeClass('selected-table-line');
        $('#ticket-history-table').data('selected-message', messageNumber);
        $('#message-line-' + ticketId + '_' + messageNumber).addClass('selected-table-line');

        var attachmentsHtml = lzm_displayHelper.createTicketAttachmentTable(ticket, {id:''}, messageNumber, false);
        var commentsHtml = lzm_displayHelper.createTicketCommentTable(ticket, messageNumber, '');
        var detailsHtml = lzm_displayHelper.createTicketMessageDetails(ticket.messages[messageNumber], {id: ''}, false, {cid: ''}, false);
        var messageHtml = lzm_commonTools.htmlEntities(ticket.messages[messageNumber].mt).replace(/\n/g, '<br />');
        $('#ticket-message-text').html('<legend>' + t('Message') + '</legend>' + messageHtml);
        $('#ticket-message-details').html('<legend>' + t('Details') + '</legend>' + detailsHtml);
        $('#ticket-attachment-list').html('<legend>' + t('Attachments') + '</legend>' + attachmentsHtml);
        $('#ticket-comment-list').html('<legend>' + t('Comments') + '</legend>' + commentsHtml);

        $('#message-details-inner').data('message', ticket.messages[messageNumber]);
        $('#message-details-inner').data('email', {id: ''});
        $('#message-details-inner').data('is-new', false);
        $('#message-details-inner').data('chat', {cid: ''});
        $('#message-details-inner').data('edit', false);
    }
}

function toggleMessageEditMode() {
    var message = $('#message-details-inner').data('message');
    var edit = !$('#message-details-inner').data('edit');
    var detailsHtml = '<legend>' + t('Details') + '</legend>' + lzm_displayHelper.createTicketMessageDetails(message, {id: ''}, false, {cid: ''}, edit);
    var messageHtml = (edit) ? '<legend>' + t('Message') + '</legend><textarea id="change-message-text" data-role="none">' + message.mt + '</textarea>' :
        '<legend>' + t('Message') + '</legend>' + lzm_commonTools.htmlEntities(message.mt).replace(/\n/g, '<br />');
    $('#ticket-message-details').html(detailsHtml);
    $('#ticket-message-text').html(messageHtml);
    if (edit) {
        $('#ticket-message-details').css({'background-color': '#ffffe1'});
        $('#ticket-message-text').css({'background-color': '#ffffe1'});
        $('#change-message-text').css({width: '99%', height: ($('.ticket-details-placeholder-content').height() - 44)+'px',
            'border-radius': '4px', padding: '2px', border: '1px solid #ccc'});
    } else {
        $('#ticket-message-details').css({'background-color': '#ffffff'});
        $('#ticket-message-text').css({'background-color': '#ffffff'});
    }

    $('#message-details-inner').data('message', message);
    $('#message-details-inner').data('email', {id: ''});
    $('#message-details-inner').data('is-new', false);
    $('#message-details-inner').data('chat', {cid: ''});
    $('#message-details-inner').data('edit', edit);
    if (parseInt($('#ticket-details-placeholder-tabs-row').data('selected-tab')) >= 2) {
        $('#ticket-details-placeholder-tab-1').click();
    }
}

function handleTicketCommentClick(commentNo, commentText) {
    $('.comment-text-line').remove();
    var commentTextHtml = '<tr class="comment-text-line"><td colspan="3">' + commentText + '</td></tr>';
    $('.comment-line').removeClass('selected-table-line');
    $('#comment-line-' + commentNo).addClass('selected-table-line');
    $('#comment-table').data('selected-comment', commentNo);
    $('#comment-line-' + commentNo).after(commentTextHtml);
    $('#comment-table').trigger('create');

}

function handleTicketAttachmentClick(attachmentNo) {
    $('.attachment-line').removeClass('selected-table-line');
    $('#attachment-line-' + attachmentNo).addClass('selected-table-line');
    $('#attachment-table').data('selected-attachment', attachmentNo);
    $('#message-attachment-table').data('selected-attachment', attachmentNo);
    $('#remove-attachment').removeClass('ui-disabled');
}

function saveTicketDetails(ticket, channel, status, group, editor, language, name, email, company, phone, message, attachments, comments, customFields, chat, mc) {
    mc = (typeof mc != 'undefined') ? mc : '';
    chat = (typeof chat != 'undefined') ? chat : {cid: ''};
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatUserActions.saveTicketDetails(ticket, channel, status, group, editor, language, name, email, company, phone, message, attachments, comments, customFields, chat, mc);
    if (chat.cid == '') {
        switchTicketListPresentation(ticketFetchTime, 0, ticket.id);
    }
}

function setTicketOperator(ticketId, operatorId) {
    var myTicket = null, i = 0;
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            myTicket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    if (myTicket != null) {
        var ticketGroup = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.g : myTicket.gr;
        var ticketStatus = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.st : 0;
        saveTicketDetails(myTicket, myTicket.t, ticketStatus, ticketGroup, operatorId, myTicket.l, '', '', '', '', '');
    }
}

function setTicketGroup(ticketId, groupId) {
    var myTicket = null, i = 0;
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            myTicket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    if (myTicket != null) {
        var ticketEditor = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.ed : '';
        var ticketStatus = (typeof myTicket.editor != 'undefined' && myTicket.editor != false) ? myTicket.editor.st : 0;
        saveTicketDetails(myTicket, myTicket.t, ticketStatus, groupId, ticketEditor, myTicket.l, '', '', '', '', '');
    }
}

function changeTicketStatus(myStatus, fromKey, inDialog) {
    removeTicketContextMenu();
    if (lzm_chatDisplay.selectedTicketRow != '') {
        fromKey = (typeof fromKey != 'undefined') ? fromKey : false;
        inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
        if (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'change_ticket_status', {}) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_open', {}) && myStatus == 0) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_progress', {}) && myStatus == 1) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_closed', {}) && myStatus == 2) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_deleted', {}) && myStatus == 3)) {
            showNoPermissionMessage();
        } else {
            var myTicket = {}, i = 0;
            for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == lzm_chatDisplay.selectedTicketRow) {
                    myTicket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
            var ticketGroup = myTicket.gr;
            var ticketEditor = -1;
            if (typeof myTicket.editor != 'undefined' && myTicket.editor != false) {
                ticketGroup = myTicket.editor.g;
                ticketEditor = myTicket.editor.ed;
            }
            var previousTicketStatus = (typeof myTicket.editor != 'undefined') ? myTicket.editor.st : 0;
            if (!fromKey) {
                saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
            } else {
                var deleteTicketMessage1 = t('Do you really want to remove this ticket irrevocably?');
                var deleteTicketMessage2 = t('You have replied to this request. Do you really want to remove this ticket?');
                var deleteTicketMessage3 = t('You have replied to this request. Do you really want to remove this ticket irrevocably?');
                var opHasAnswered = false, deletionConfirmed = false;
                for (i=0; i<myTicket.messages.length; i++) {
                    if (myTicket.messages[i].t == 1) {
                        opHasAnswered = true;
                    }
                }
                if (myStatus != 3) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                    deletionConfirmed = true;
                } else if (myStatus == 3 && previousTicketStatus != 3 && !opHasAnswered) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                    deletionConfirmed = true;
                } else if (myStatus == 3 && previousTicketStatus != 3 && opHasAnswered && confirm(deleteTicketMessage2)) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                    deletionConfirmed = true;
                } else if (myStatus == 3 && previousTicketStatus == 3 && !opHasAnswered && confirm(deleteTicketMessage1)) {
                    lzm_chatUserActions.deleteTicket(myTicket.id);
                    deletionConfirmed = true;
                } else if (myStatus == 3 && previousTicketStatus == 3 && opHasAnswered && confirm(deleteTicketMessage3)) {
                    lzm_chatUserActions.deleteTicket(myTicket.id);
                    deletionConfirmed = true;
                }
            }
            if (fromKey && myStatus == 3 && deletionConfirmed) {
                for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                    if (lzm_chatDisplay.ticketListTickets[i].id == lzm_chatDisplay.selectedTicketRow) {
                        myTicket = lzm_chatDisplay.ticketListTickets[i];
                        if (typeof myTicket.editor == 'undefined' || myTicket.editor == false) {
                            var myTime = lzm_chatTimeStamp.getServerTimeString(null, true);
                            lzm_chatDisplay.ticketListTickets[i].editor = {ed: "",g: myTicket.gr, id: myTicket.id,
                                st: myStatus, ti: myTime, u: myTime, w: 2000000000};
                        } else {
                            lzm_chatDisplay.ticketListTickets[i].editor.st = myStatus;
                        }
                    }
                }
                lzm_chatDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,
                    lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery,
                    lzm_chatPollServer.ticketFilter, true);
            }

        }
    }
}

function sendTicketMessage(ticket, receiver, bcc, subject, message, comment, attachments, messageId) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatUserActions.sendTicketReply(ticket, receiver, bcc, subject, message, comment, attachments, messageId);
    switchTicketListPresentation(ticketFetchTime, 0, ticket.id);
}

function addOrEditResourceFromTicket(ticketId) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        if (resource.ty == 0) {
            lzm_chatUserActions.addQrd(ticketId, true);
        } else if (resource.ty == 1) {
            resource.text = lzm_chatDisplay.ticketResourceText[ticketId];
            lzm_chatUserActions.editQrd(resource, ticketId, true);
        }
    }
}

function saveQrdFromTicket(resourceId, resourceText) {
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(resourceId);
    if (resource != null) {
        resource.text = resourceText.replace(/\n/g, '<br />');
        lzm_chatPollServer.pollServerResource(resource);
    }
}

function addQrdAttachment(closeToTicket) {
    lzm_chatServerEvaluation.cannedResources.riseUsageCounter(lzm_chatDisplay.selectedResource);
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        cancelQrd(closeToTicket);
        var resources1 = $('#reply-placeholder-content-1').data('selected-resources');
        var resources2 = $('#ticket-details-placeholder-content-1').data('selected-resources');
        var resources = (typeof resources1 != 'undefined') ? resources1 : (typeof resources2 != 'undefined') ? resources2 : [];
        resources.push(resource);
        $('#reply-placeholder-content-1').data('selected-resources', resources);
        $('#ticket-details-placeholder-content-1').data('selected-resources', resources);
        lzm_chatDisplay.updateAttachmentList();
    }
}

function insertQrdIntoTicket(ticketId) {
    lzm_chatServerEvaluation.cannedResources.riseUsageCounter(lzm_chatDisplay.selectedResource);
    var resource = lzm_chatServerEvaluation.cannedResources.getResource(lzm_chatDisplay.selectedResource);
    if (resource != null) {
        lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
        lzm_displayHelper.maximizeDialogWindow(lzm_chatDisplay.ticketDialogId[ticketId] + '_reply');
        var replyText = '';//$('#ticket-reply-input').val();
        switch(resource.ty) {
            case '1':
                replyText += resource.text
                    .replace(/^<p>/gi,'').replace(/^<div>/gi,'')
                    .replace(/<p>/gi,'<br>').replace(/<div>/gi,'<br>')
                    .replace(/<br>/gi,'\n').replace(/<br \/>/gi, '\n');
                if (replyText.indexOf('openLink') != -1) {
                    replyText = replyText.replace(/<a.*openLink\('(.*?)'\).*>(.*?)<\/a>/gi, '$2 ($1)');
                } else {
                    replyText = replyText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, '$2 ($1)');
                }
                replyText = replyText.replace(/<.*?>/g, '').replace(/&nbsp;/gi, ' ')
                    .replace(/&.*?;/g, '');
                break;
            case '2':
                replyText += resource.ti + ':\n' + resource.text;
                break;
            default:
                var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
                var fileId = resource.text.split('_')[1];
                var urlParts = lzm_commonTools.getUrlParts(lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url, 0);
                var thisServer = ((urlParts.protocol == 'http://' && urlParts.port == 80) || (urlParts.protocol == 'https://' && urlParts.port == 443)) ?
                    urlParts.protocol + urlParts.urlBase + urlParts.urlRest : urlParts.protocol + urlParts.urlBase + ':' + urlParts.protocol + urlParts.urlRest;
                replyText += thisServer + '/getfile.php?';
                if (multiServerId != '') {
                    replyText += 'ws=' + multiServerId + '&';
                }
                replyText += 'file=' + urlFileName + '&id=' + fileId;
        }

        //$('#ticket-reply-input').val(replyText);
        insertAtCursor('ticket-reply-input', replyText);
        $('#ticket-reply-input-resource').val(resource.rid);

        if (/*resource.oid == lzm_chatDisplay.myId && */resource.ty == 1) {
            $('#ticket-reply-input-save').removeClass('ui-disabled');
        } else {
            $('#ticket-reply-input-save').addClass('ui-disabled');
        }
    }
}

function setAllTicketsRead() {
    lzm_chatPollServer.stopPolling();
    var maxTicketUpdated = 0;
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        maxTicketUpdated = Math.max(lzm_chatDisplay.ticketListTickets[i].u, maxTicketUpdated);
    }
    if (maxTicketUpdated > lzm_chatPollServer.ticketMaxRead) {
        lzm_chatPollServer.ticketMaxRead = maxTicketUpdated;
        lzm_chatDisplay.ticketGlobalValues.mr = maxTicketUpdated;
    }
    lzm_chatPollServer.resetTickets = true;
    lzm_chatDisplay.ticketReadArray = [];
    lzm_chatDisplay.ticketUnreadArray = [];
    lzm_chatDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,
        lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
        true);
    lzm_chatPollServer.startPolling();
}

function changeTicketReadStatus(ticketId, status, doNotUpdate, forceRead) {
    removeTicketContextMenu();
    doNotUpdate = (typeof doNotUpdate != 'undefined') ? doNotUpdate : false;
    forceRead = (typeof forceRead != 'undefined') ? forceRead : false;
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    var ticket = {id: '', u: 0}, i;
    for (i=0; i<lzm_chatServerEvaluation.tickets.length; i++) {
        if (lzm_chatServerEvaluation.tickets[i].id == ticketId) {
            ticket = lzm_chatServerEvaluation.tickets[i];
        }
    }
    if ((ticket.id != '' && status == 'read' && ticket.u > lzm_chatPollServer.ticketMaxRead) ||
        (ticket.id != '' && status != 'read' && true)) {
        if (ticket.id == '') {
            for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                    ticket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
        }
        if (status == 'read') {
            var timestamp = Math.max(lzm_chatTimeStamp.getServerTimeString(null, true), ticket.u);
            if (forceRead) {
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticketId, lzm_chatDisplay.ticketReadArray);
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.addTicketToReadStatusArray(ticket,
                    lzm_chatDisplay.ticketReadArray, lzm_chatDisplay.ticketListTickets, false);
            } else if (ticket.u > lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketReadArray) == -1) {
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.addTicketToReadStatusArray(ticket,
                    lzm_chatDisplay.ticketReadArray, lzm_chatDisplay.ticketListTickets, false);
            } else {
                lzm_chatDisplay.ticketUnreadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketUnreadArray);
            }
        } else {
            if (ticket.u <= lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketUnreadArray) == -1) {
                lzm_chatDisplay.ticketUnreadArray.push({id: ticket.id, timestamp: lzm_chatTimeStamp.getServerTimeString(null, true)});
            } else {
                lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketReadArray);
            }
        }
        if (!doNotUpdate) {
            lzm_chatDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,
                lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
                true);
        }
    }
}

function sortTicketsBy(sortCriterium) {
    if (sortCriterium != lzm_chatPollServer.ticketSort) {
        $('.ticket-list-page-button').addClass('ui-disabled');
        var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.ticketSort = sortCriterium;
        lzm_chatPollServer.resetTickets = true;
        lzm_chatPollServer.startPolling();
        switchTicketListPresentation(ticketFetchTime, 0);
    }
}

function searchTickets(searchString) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketQuery = searchString;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.resetTickets = true;
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function cancelTicketReply(windowId, dialogId) {
    lzm_displayHelper.removeDialogWindow(windowId);
    lzm_displayHelper.maximizeDialogWindow(dialogId);
    $('#reply-ticket-details').removeClass('ui-disabled');
    //$('.ticket-buttons').removeClass('ui-disabled');
    //$('#ticket-reply').remove();
}

function showMessageReply(ticketId, messageNo, groupId) {
    var i, ticket;
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    var selectedGroup = lzm_chatServerEvaluation.groups.getGroup(groupId);

    lzm_chatDisplay.showMessageReply(ticket, messageNo, selectedGroup);
}

function addComment(ticketId, menuEntry) {
    var messageNo = $('#ticket-history-table').data('selected-message');
    var ticket = {}, message = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
            message = ticket.messages[messageNo];
        }
    }
    lzm_chatDisplay.addMessageComment(ticket.id, message, menuEntry);
}

function toggleEmailList() {
    if ($('#email-list-container').length == 0) {
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'email-list') {
                    storedPreviewId = key;
                }
            }
        }
        if (storedPreviewId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        } else {
            lzm_chatDisplay.showEmailList();
            lzm_chatPollServer.stopPolling();
            lzm_chatPollServer.emailUpdateTimestamp = 0;
            lzm_chatPollServer.addPropertyToDataObject('p_de_a', lzm_chatPollServer.emailAmount);
            lzm_chatPollServer.addPropertyToDataObject('p_de_s', 0);
            lzm_chatPollServer.startPolling();
        }
    } else {
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.removePropertyFromDataObject('p_de_a');
        lzm_chatPollServer.removePropertyFromDataObject('p_de_s');
        lzm_chatPollServer.emailAmount = 20;
        lzm_chatPollServer.startPolling();
    }
}

function deleteEmail() {
    var emailId = $('#email-placeholder').data('selected-email-id');
    var emailNo = $('#email-placeholder').data('selected-email');
    lzm_chatDisplay.emailDeletedArray.push(emailId);
    $('#email-list-line-' + emailNo).children('td:first').css('background-image', 'url(\'img/205-close16c.png\')');
    $('#reset-emails').removeClass('ui-disabled');
    $('#delete-email').addClass('ui-disabled');
    $('#create-ticket-from-email').addClass('ui-disabled');
    if ($('#email-list-line-' + (emailNo + 1)).length > 0) {
        $('#email-list-line-' + (emailNo + 1)).click();
    }
}

function saveEmailListChanges(emailId, assign) {
    var i, emailChanges = [], ticketsCreated = [], emailListObject = {};
    if (emailId != '') {
        var editorId = (assign) ? lzm_chatDisplay.myId : '';
        if (emailId instanceof Array) {
            for (i=0; i<emailId.length; i++) {
                emailChanges.push({id: emailId[i], status: '0', editor: editorId})
            }
        } else {
            emailChanges = [{
                id: emailId, status: '0', editor: editorId
            }];
        }
    } else {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            emailListObject[lzm_chatServerEvaluation.emails[i].id] = lzm_chatServerEvaluation.emails[i];
        }

        for (i=0; i<lzm_chatDisplay.emailDeletedArray.length; i++) {
            emailChanges.push({id: lzm_chatDisplay.emailDeletedArray[i], status: '1', editor: ''})
        }

        for (i=0; i<lzm_chatDisplay.ticketsFromEmails.length; i++) {
            var thisEmail = emailListObject[lzm_chatDisplay.ticketsFromEmails[i]['email-id']];
            emailChanges.push({id: thisEmail.id, status: '1', editor: ''});
            ticketsCreated.push({
                name: thisEmail.n,
                email: thisEmail.e,
                subject: thisEmail.s,
                //text: thisEmail.text,
                text: lzm_chatDisplay.ticketsFromEmails[i].message,
                group: lzm_chatDisplay.ticketsFromEmails[i].group,
                cid: thisEmail.id,
                channel: lzm_chatDisplay.ticketsFromEmails[i].channel,
                company: lzm_chatDisplay.ticketsFromEmails[i].company,
                phone: lzm_chatDisplay.ticketsFromEmails[i].phone,
                language: lzm_chatDisplay.ticketsFromEmails[i].language,
                status: lzm_chatDisplay.ticketsFromEmails[i].status,
                editor: (lzm_chatDisplay.ticketsFromEmails[i].editor != -1) ? lzm_chatDisplay.ticketsFromEmails[i].editor : '',
                attachment: thisEmail.attachment,
                comment: lzm_chatDisplay.ticketsFromEmails[i].comment,
                custom: lzm_chatDisplay.ticketsFromEmails[i].custom
            });
        }
    }
    lzm_chatUserActions.saveEmailChanges(emailChanges, ticketsCreated);
}

function showHtmlEmail(emailIdEnc) {
    var htmlEmailUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url + '/email.php?ws=' + multiServerId + '&id=' + emailIdEnc;
    openLink(htmlEmailUrl);
}

function pageArchiveList(page) {
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatPollServer.chatArchivePage = page;
    lzm_chatPollServer.resetChats = true;
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function searchArchive(searchString) {
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatPollServer.chatArchiveQuery = searchString.replace(/^ +/, '').replace(/ +$/, '').toLowerCase();
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.resetChats = true;
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function openArchiveFilterMenu(e, filter) {
    filter = (filter != '') ? filter : lzm_chatPollServer.chatArchiveFilter;
    e.stopPropagation();
    if (lzm_chatDisplay.showArchiveFilterMenu) {
        removeArchiveFilterMenu();
    } else {
        var parentOffset = $('#archive-filter').offset();
        var xValue = parentOffset.left;
        var yValue = parentOffset.top + 24;
        lzm_chatDisplay.showArchiveFilterMenu = true;
        lzm_chatDisplay.showContextMenu('archive-filter', {filter: filter}, xValue, yValue);
        e.preventDefault();
    }
}

function showArchivedChat(cpId, cpName, chatId, chatType) {
    if (chatType == 1) {
        showVisitorInfo(cpId, cpName, chatId, 4);
    } else {
        var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
        lzm_chatPollServer.stopPolling();
        window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
            limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
            filter: lzm_chatPollServer.chatArchiveFilter};
        lzm_chatPollServer.chatArchivePage = 1;
        lzm_chatPollServer.chatArchiveLimit = 1000;
        lzm_chatPollServer.chatArchiveQuery = '';
        lzm_chatPollServer.chatArchiveFilter = '';
        if (chatType == 0) {
            lzm_chatPollServer.chatArchiveFilterInternal = cpId
        } else {
            lzm_chatPollServer.chatArchiveFilterGroup = cpId
        }
        lzm_chatPollServer.resetChats = true;
        lzm_chatDisplay.showArchivedChat(lzm_chatServerEvaluation.chatArchive.chats, cpId, cpName, chatId, chatType);
        switchArchivePresentation(chatFetchTime, 0);
        lzm_chatPollServer.startPolling();
    }
}

function selectArchivedChat(chatId, inDialog) {
    $('.archive-list-line').removeClass('selected-table-line');
    $('#dialog-archive-list-line-' + chatId).addClass('selected-table-line');
    $('#archive-list-line-' + chatId).addClass('selected-table-line');
    if (inDialog) {
        $('#matching-chats-table').data('selected-chat-id', chatId);
        var thisChat = {};
        for (var i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                thisChat = lzm_chatServerEvaluation.chatArchive.chats[i];
            }
        }
        var chatHtml;
        try {
            chatHtml = '<legend>' + t('Text') + '</legend>' +
                '<div style="margin-top: -10px; margin-left: -10px;">' + thisChat.chtml.replace(/\.\/images\//g, 'img/') + '</div>';
        } catch(e) {
            chatHtml = '<legend>' + t('Text') + '</legend>';
        }
        if (chatId != '') {
            $('#create-ticket-from-chat').removeClass('ui-disabled');
        }
        $('#chat-content-inner').html(chatHtml);
    }
}

function removeArchiveFilterMenu() {
    lzm_chatDisplay.showArchiveFilterMenu = false;
    $('#archive-filter-context').remove();
}

function toggleArchiveFilter(filter, e) {
    e.stopPropagation();
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    removeArchiveFilterMenu();
    var filterList = lzm_chatPollServer.chatArchiveFilter.split('');
    if ($.inArray(filter.toString(), filterList) != -1) {
        var pattern = new RegExp(filter.toString());
        lzm_chatPollServer.chatArchiveFilter = lzm_chatPollServer.chatArchiveFilter.replace(pattern, '');
    } else {
        filterList.push(filter);
        filterList.sort();
        lzm_chatPollServer.chatArchiveFilter = filterList.join('');
    }
    if (lzm_chatPollServer.chatArchiveFilter == '') {
        lzm_chatPollServer.chatArchiveFilter = '012';
    }
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.startPolling();
    lzm_chatPollServer.resetChats = true;
    switchArchivePresentation(archiveFetchTime, 0);
}

function switchArchivePresentation(archiveFetchTime, counter) {
    var loadingHtml, myWidth, myHeight;
    if (counter == 0) {
        if ($('#matching-chats-table').length == 0) {
            loadingHtml = '<div id="archive-loading"></div>';
            $('#archive-body').append(loadingHtml).trigger('create');
            myWidth = $('#archive-body').width() + 10;
            myHeight = $('#archive-body').height() + 10;
            $('#archive-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        } else {
            loadingHtml = '<div id="matching-archive-loading"></div>';
            $('#visitor-info-placeholder-content-4').append(loadingHtml).trigger('create');
            myWidth = $('#visitor-info-placeholder-content-4').width() + 28;
            myHeight = $('#visitor-info-placeholder-content-4').height() + 48;
            $('#matching-archive-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        }
    }
    if (archiveFetchTime != lzm_chatServerEvaluation.archiveFetchTime || counter >= 40) {
        if ($('#matching-chats-table').length == 0) {
            lzm_chatDisplay.createArchive();
            $('#archive-loading').remove();
        } else {
            $('#matching-archive-loading').remove();
            selectArchivedChat($('#matching-chats-table').data('selected-chat-id'), true);
        }
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchArchivePresentation(archiveFetchTime, counter);}, delay);
    }
}

function createDynamicGroup() {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', {o: lzm_chatDisplay.myId})) {
        lzm_chatDisplay.createDynamicGroup();
    } else {
        showNoPermissionMessage();
    }
}

function saveNewDynamicGroup() {
    var newGroupName = $('#new-dynamic-group-name').val().replace(/^ */, '').replace(/ *$/, '');
    lzm_chatDisplay.doNotUpdateOpList = false;
    if (newGroupName != '') {
        lzm_chatUserActions.saveDynamicGroup('create', '', newGroupName, '');
        $('#operator-list-line-new-' + lzm_chatDisplay.newDynGroupHash).html('<th class="lzm-unselectable" colspan="2"' +
            ' style="text-align: left; cursor: pointer; padding: 3px 8px 3px 4px;">' +
            '<span class="operator-list-icon" style="background-image: url(\'img/lz_group_dynamic_14.png\');"></span>&nbsp;&nbsp;' +
            newGroupName + '</th>');
    } else {
        $('#operator-list-line-new-' + lzm_chatDisplay.newDynGroupHash).remove();
        lzm_chatDisplay.createOperatorList();
    }
}

function deleteDynamicGroup(id) {
    var group = lzm_chatServerEvaluation.groups.getGroup(id);
    if (group != null && typeof group.members != 'undefined') {
        if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', group)) {
            lzm_chatUserActions.saveDynamicGroup('delete', id, '', '');
            lzm_chatServerEvaluation.groups.setGroupProperty(id, 'is_active', false);
            if (lzm_chatDisplay.selected_view == 'internal') {
                lzm_chatDisplay.createOperatorList();
            } else if (lzm_chatDisplay.selected_view == 'mychats') {
                lzm_chatDisplay.createActiveChatPanel(false, true);
            }
        } else {
            showNoPermissionMessage();
        }
    }
}

function addToDynamicGroup(id, browserId, chatId) {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', {o: lzm_chatDisplay.myId})) {
        lzm_chatDisplay.addToDynamicGroup(id, browserId, chatId);
    } else {
        showNoPermissionMessage();
    }
}

function removeFromDynamicGroup(id, groupId) {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'group', '', lzm_chatServerEvaluation.groups.getGroup(groupId))) {
        var browserId = '';
        if (id.indexOf('~') != -1) {
            browserId = id.split('~')[1];
            id = id.split('~')[0];
            var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(id, browserId);
            var visitor = (visitorBrowser[0] != null) ? visitorBrowser[0] : lzm_chatServerEvaluation.visitors.getVisitor(id);
            var visitorName = (visitorBrowser[1] != null && visitorBrowser[1].cname != '') ? visitorBrowser[1].cname :
                (visitor != null) ? visitor.unique_name : id + '~' + browserId;
            var group = lzm_chatServerEvaluation.groups.getGroup(groupId);
            var groupName = (group != null) ?group.name : '';
        }
        lzm_chatUserActions.saveDynamicGroup('remove', groupId, '', id, {browserId: browserId});
    } else {
        showNoPermissionMessage();
    }
}

function selectDynamicGroup(groupId) {
    $('.dynamic-group-line').removeClass('selected-table-line');
    $('#dynamic-group-line-' + groupId).addClass('selected-table-line');
    $('#dynamic-group-table').data('selected-group', groupId);
}

function openVisitorListContextMenu(e, visitorId, isChatting, wasDeclined, invitationStatus) {
    e.stopPropagation();
    lzm_chatGeoTrackingMap.selectedVisitor = visitorId;
    $('#visitor-list').data('selected-visitor', visitorId);
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');

    var visitor = lzm_chatServerEvaluation.visitors.getVisitor(visitorId);
    visitor = (visitor != null) ? visitor : {};
    var invitationLogo = (invitationStatus == 'requested') ? 'img/632-skills_not.png' : 'img/632-skills.png';
    if (lzm_chatDisplay.showVisitorListContextMenu) {
        removeVisitorListContextMenu();
    } else {
        var scrolledDownY = $('#visitor-list-table-div').scrollTop();
        var scrolledDownX = $('#visitor-list-table-div').scrollLeft();
        var parentOffset = $('#visitor-list-table-div').offset();
        var yValue = e.pageY - parentOffset.top + scrolledDownY;
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        lzm_chatDisplay.showVisitorListContextMenu = true;
        lzm_chatDisplay.showContextMenu('visitor-list-table-div', {visitor: visitor, chatting: isChatting, declined: wasDeclined,
            status: invitationStatus, logo: invitationLogo}, xValue, yValue);
    }
    e.preventDefault();
}

function removeVisitorListContextMenu() {
    lzm_chatDisplay.showVisitorListContextMenu = false;
    $('#visitor-list-table-div-context').remove();
}

function openOperatorListContextMenu(e, type, id, groupId, lineCounter) {
    e.stopPropagation();
    var chatPartner = null, browser = {}, lineId = id + '_' + lineCounter;
    switch (type) {
        case 'group':
            if (id != 'everyoneintern') {
                chatPartner = lzm_chatServerEvaluation.groups.getGroup(id);
            } else {
                chatPartner = {id: id, name: t('All operators')};
            }
            break;
        case 'operator':
            chatPartner = lzm_chatServerEvaluation.operators.getOperator(id);
            break;
        case 'visitor':
            chatPartner = lzm_chatServerEvaluation.visitors.getVisitor(id.split('~')[0]);
            if (typeof chatPartner.b != 'undefined') {
                for (var i=0; i<chatPartner.b.length; i++) {
                    if (chatPartner.b[i].id == id.split('~')[1]) {
                        browser = chatPartner.b[i];
                    }
                }
            } else {
                browser = {id: ''};
            }
            break;
    }
    if (chatPartner != null) {
        selectOperatorLine(id, lineCounter);
        var scrolledDownY = $('#operator-list-body').scrollTop();
        var scrolledDownX = $('#operator-list-body').scrollLeft();
        var parentOffset = $('#operator-list-body').offset();
        var yValue = e.pageY - parentOffset.top + scrolledDownY;
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        lzm_chatDisplay.showContextMenu('operator-list', {type: type, 'chat-partner': chatPartner, groupId: groupId,
            'browser': browser, 'line-id': lineId}, xValue, yValue);
    }
    e.preventDefault();
}

function selectOperatorLine(id, lineCounter) {
    var lineId = id.replace(/~/, '_') + '_' + lineCounter;
    $('.operator-list-line').removeClass('selected-op-table-line');
    $('#operator-list-line-' + lineId).addClass('selected-op-table-line');
}

function removeOperatorListContextMenu() {
    $('#operator-list-context').remove();
}

function disableInternalChat(chatId) {
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(chatId);
    if (userChat != null) {
        var tmpArray = [];
        for (var i=0; i<lzm_chatServerEvaluation.myDynamicGroups.length; i++) {
            if (lzm_chatServerEvaluation.myDynamicGroups[i] != chatId) {
                tmpArray.push(lzm_chatServerEvaluation.myDynamicGroups[i]);
            }
        }
        lzm_chatServerEvaluation.myDynamicGroups = tmpArray;
        lzm_chatServerEvaluation.userChats.setUserChat(chatId, {status: 'left'});
        if (lzm_chatDisplay.active_chat_reco == chatId) {
            var group = lzm_chatServerEvaluation.groups.getGroup(chatId);
            if (group != null) {
                chatInternalWith(group.id, group.id, group.name);
            }
        }
    }
}

function addJoinedMessageToChat(chat_reco, visitorName, groupName) {
    groupName = (typeof groupName != 'undefined') ? groupName : '';
    var chatText = (groupName != '') ? t('<!--vis_name--> joins <!--group_name-->.',[['<!--vis_name-->', visitorName], ['<!--group_name-->', groupName]]) :
        t('<!--vis_name--> joins the chat.',[['<!--vis_name-->', visitorName]]);
    var new_chat = {};
    new_chat.id = md5(String(Math.random())).substr(0, 32);
    new_chat.rp = '';
    new_chat.sen = '0000000';
    new_chat.rec = '';
    new_chat.reco = chat_reco;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
    lzm_chatServerEvaluation.chatMessageCounter++;
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
    new_chat.text = chatText;
    lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);

}

function addLeftMessageToChat(chat_reco, visitorName, groupName) {
    groupName = (typeof groupName != 'undefined') ? groupName : '';
    var chatText = (groupName != '') ? t('<!--vis_name--> has left <!--group_name-->.',[['<!--vis_name-->', visitorName], ['<!--group_name-->', groupName]]) :
        t('<!--vis_name--> has left the chat.',[['<!--vis_name-->', visitorName]]);
    var new_chat = {};
    new_chat.id = md5(String(Math.random())).substr(0, 32);
    new_chat.rp = '';
    new_chat.sen = '0000000';
    new_chat.rec = '';
    new_chat.reco = chat_reco;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
    lzm_chatServerEvaluation.chatMessageCounter++;
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
    new_chat.text = chatText;
    lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
}

function addOpLeftMessageToChat(chat_reco, members, newIdList) {
    for (var i=0; i<members.length; i++) {
        if (members[i].id != lzm_chatServerEvaluation.myId && members[i].st != 0 &&
            (lzm_chatServerEvaluation.userChats.getUserChat(chat_reco).accepted == 'undefined' || !lzm_chatServerEvaluation.userChats.getUserChat(chat_reco).accepted) &&
            $.inArray(members[i].id, newIdList) == -1) {
            var operator = lzm_chatServerEvaluation.operators.getOperator(members[i].id);
            if (operator != null) {
                var new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = chat_reco;
                var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                lzm_chatServerEvaluation.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                new_chat.text = t('<!--this_op_name--> has left the chat.', [['<!--this_op_name-->', operator.name]]);
                lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            }
        }
    }
    lzm_chatServerEvaluation.setChatAccepted(chat_reco, true);
}

function addDeclinedMessageToChat(id, b_id, chatPartners) {
    var userChat = lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id);
    for (var i=0; i<chatPartners.past.length; i++) {
        if ($.inArray(chatPartners.past[i], chatPartners.present) == -1) {
            var operator = lzm_chatServerEvaluation.operators.getOperator(chatPartners.past[i]);
            if (operator != null) {
                var new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = id + '~' + b_id;
                var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                lzm_chatServerEvaluation.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                new_chat.text = t('<!--this_op_name--> has declined the chat.', [['<!--this_op_name-->', operator.name]]);
                lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
            }
            if (chatPartners.past[i] == lzm_chatServerEvaluation.myId) {
                if (userChat != null) {
                    lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'declined'});
                    lzm_chatDisplay.createActiveChatPanel(false, true);
                    if (lzm_chatDisplay.active_chat_reco == id + '~' + b_id) {
                        lzm_chatDisplay.removeSoundPlayed(id + '~' + b_id);
                        lzm_chatUserActions.viewUserData(id, b_id, userChat.chat_id);
                    }
                }
            }
        }
    }
}

function removeFromOpenChats(chat, deleteFromChat, resetActiveChat, member, caller) {
    var i, new_chat;

    var inChatWith = '';
    for (i=0; i<member.length; i++) {
        if (member[i].st == 0) {
            inChatWith = member[i].id;
        }
    }
    if (inChatWith != '' && inChatWith != lzm_chatServerEvaluation.myId && lzm_chatServerEvaluation.userChats.getUserChat(chat).status != 'left') {
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
        var operator = lzm_chatServerEvaluation.operators.getOperator(inChatWith);
        var opName = (operator != null) ? operator.name : t('Another operator');
        new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = chat;
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_op_name--> has accepted the chat.', [['<!--this_op_name-->',opName]]);
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
        new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = chat;
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_op_name--> has left the chat.', [['<!--this_op_name-->', lzm_chatServerEvaluation.myName]]);
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
    }
    if (deleteFromChat) {
        lzm_chatServerEvaluation.userChats.setUserChat(chat, {status: 'left'});
    }
    var tmpOpenchats = [];
    for (i=0; i<lzm_chatDisplay.openChats.length; i++) {
        if (chat != lzm_chatDisplay.openChats[i]) {
            tmpOpenchats.push(lzm_chatDisplay.openChats[i]);
        }
    }
    lzm_chatDisplay.openChats = tmpOpenchats;
    lzm_chatUserActions.open_chats = tmpOpenchats;
    if (resetActiveChat) {
        if (lzm_chatDisplay.active_chat_reco == chat) {
            setTimeout(function() {
                lzm_chatUserActions.viewUserData(chat.split('~')[0], chat.split('~')[1], 0, true);
            }, 20);
        }
    }
}

function isVisitorNeededInGui(id) {
    var visitorIsNeeded = false;
    var visitorAlreadyInList = false;
    var removeVisitorFromList = false;
    for (var i=0; i<visitorsStillNeeded.length; i++) {
        if (visitorsStillNeeded[i].id == id) {
            visitorAlreadyInList = true;
            if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - visitorsStillNeeded[i].time < 120000) {
                visitorIsNeeded = true;
            } else {
                removeVisitorFromList = true;
            }
        }
    }
    if (!visitorAlreadyInList) {
        visitorIsNeeded = true;
        visitorsStillNeeded.push({id: id, time: lzm_chatTimeStamp.getServerTimeString(null, false, 1)});
    }
    var userChats = lzm_chatServerEvaluation.userChats.getUserChatList();
    for (var key in userChats) {
        if (userChats.hasOwnProperty(key)) {
            var openChatId = key.split('~')[0];
            if (openChatId == id && $.inArray(key, lzm_chatDisplay.closedChats) == -1) {
                visitorIsNeeded = true;
            }
        }
    }

    if (lzm_chatDisplay.ShowVisitorId == id) {
        visitorIsNeeded = true;
    }

    if (!visitorIsNeeded && removeVisitorFromList) {
        var tmpList = [];
        for (var j=0; j<visitorsStillNeeded.length; j++) {
            if (visitorsStillNeeded[j].id != id) {
                tmpList.push(visitorsStillNeeded[j]);
            }
        }
        visitorsStillNeeded = tmpList;
    }
    return visitorIsNeeded;
}

function markVisitorAsLeft(id, b_id) {
    if ($.inArray(lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id).status, ['left','declined']) == -1) {
        var visitorName = '';
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
        if (visitor != null) {
            for (var l=0; l<visitor.b.length; l++) {
                if (visitor.b[l].id == b_id) {
                    visitorName = (visitor.b[l].cname != '') ? visitor.b[l].cname : visitor.unique_name;
                }
            }
        }
        addLeftMessageToChat(id + '~' + b_id, lzm_commonTools.htmlEntities(visitorName));
    }
    lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'left'});
    if (lzm_chatDisplay.active_chat_reco == id + '~' + b_id) {
        removeFromOpenChats(id + '~' + b_id, false, true, [], 'markVisitorAsLeft');
    }
}

function markVisitorAsBack(id, b_id, chat_id, member) {
    var chatIsMine = false;
    for (var j=0; j<member.length; j++) {
        if (member[j].id == lzm_chatServerEvaluation.myId) {
            chatIsMine = true;
            break;
        }
    }
    if (chatIsMine) {
        removeFromOpenChats(id + '~' + b_id, false, true, member, 'markVisitorAsBack');
        addChatInfoBlock(id, b_id);
        lzm_chatServerEvaluation.userChats.setUserChat(id + '~' + b_id, {status: 'new'});

        var tmpClosedChats = [];
        for (var i=0; i<lzm_chatDisplay.closedChats.length; i++) {
            if (lzm_chatDisplay.closedChats[i] != id + '~' + b_id) {
                tmpClosedChats.push(lzm_chatDisplay.closedChats[i]);
            }
        }
        lzm_chatDisplay.closedChats = tmpClosedChats;

        var visitorName = '';
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
        if (visitor != null) {
            for (var l=0; l<visitor.b.length; l++) {
                if (visitor.b[l].id == b_id) {
                    visitorName = (visitor.b[l].cname != '') ? visitor.b[l].cname : visitor.unique_name;
                    break;
                }
            }
        }

        var new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = id + '~' + b_id;
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_vis_name--> is in chat with <!--this_op_name-->',
            [['<!--this_vis_name-->', lzm_commonTools.htmlEntities(visitorName)],['<!--this_op_name-->', lzm_chatServerEvaluation.myName]]);
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);

        lzm_chatServerEvaluation.browserChatIdList.push(chat_id);
        if (isAutoAcceptActive()) {
            if (visitor != null) {
                lzm_chatUserActions.acceptChat(id, b_id, chat_id,
                    id + '~' + b_id, visitor.lang);
            }
        }
    } else {
        if (lzm_chatServerEvaluation.userChats.getUserChat(id + '~' + b_id).status != 'left') {
            markVisitorAsLeft(id, b_id);
        }
    }
}

function handleVisitorCommentClick(selectedLine) {
    var thisUser = $('#visitor-information').data('visitor');
    var commentText = thisUser.c[selectedLine].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
    $('#visitor-comment-list').data('selected-row', selectedLine);
    $('.visitor-comment-line').removeClass('selected-table-line');
    $('#visitor-comment-line-' + selectedLine).addClass('selected-table-line');
    $('#visitor-comment-text').html('<legend>' + t('Comment') + '</legend>' + commentText);
}

function addChatInfoBlock(id, b_id) {
    if (b_id != '') {
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(id);
        if (visitor != null) {
            for (var j=0; j<visitor.b.length; j++) {
                if (visitor.b[j].id == b_id) {
                    if (typeof visitor.b[j].chat != 'undefined') {
                        var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(visitor.b[j].chat.f * 1000, true);

                        var tUoperators = '';
                        var operators = lzm_chatServerEvaluation.operators.getOperatorList();
                        for (var i=0; i<operators.length; i++) {
                            if (typeof visitor.b[j].chat != 'undefined' && typeof visitor.b[j].chat.pn != 'undefined' &&
                                typeof visitor.b[j].chat.pn.memberIdList != 'undefined' &&
                                $.inArray(operators[i].id, visitor.b[j].chat.pn.memberIdList) != -1) {
                                    tUoperators +=  operators[i].name + ', ';
                            }
                        }
                        tUoperators = tUoperators.replace(/, *$/,'');
                        var name = (visitor.b[j].cname != '') ? visitor.b[j].cname : visitor.unique_name;
                        var customFields = '';
                        for (var key in visitor.b[j].chat.cf) {
                            if (visitor.b[j].chat.cf.hasOwnProperty(key)) {
                                var inputText = (lzm_chatServerEvaluation.inputList.getCustomInput(key).type != 'CheckBox') ?
                                    lzm_commonTools.htmlEntities(visitor.b[j].chat.cf[key]) :
                                    (visitor.b[j].chat.cf[key] == 1) ? t('Yes') : t('No');
                                customFields += '<tr><td>' + lzm_chatServerEvaluation.inputList.getCustomInput(key).name + '</td>' +
                                    '<td>' + inputText + '</td></tr>';
                            }
                        }

                        var new_chat = {
                            date: visitor.b[j].chat.f,
                            cmc: lzm_chatServerEvaluation.chatMessageCounter,
                            id : md5(String(Math.random())).substr(0, 32),
                            rec: id + '~' + b_id,
                            reco: lzm_chatDisplay.myId,
                            rp: '0',
                            sen: id + '~' + b_id,
                            sen_id: id,
                            sen_b_id: b_id,
                            text: '',
                            date_human: lzm_commonTools.getHumanDate(tmpDate, 'date', lzm_chatDisplay.userLanguage),
                            time_human: lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage),
                            info_header: {
                                group: visitor.b[j].chat.gr,
                                operators: tUoperators,
                                name: name,
                                mail: visitor.b[j].cemail,
                                company: visitor.b[j].ccompany,
                                phone: visitor.b[j].cphone,
                                question: visitor.b[j].chat.eq,
                                chat_id: visitor.b[j].chat.id,
                                cf: customFields
                            }
                        };
                        lzm_chatServerEvaluation.chatMessageCounter++;
                    }
                    break;
                }
            }
        }
        lzm_chatServerEvaluation.userChats.setUserChatMessage(new_chat);
    }
}

function isAutoAcceptActive () {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'must_auto_accept', {}) ||
       (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'can_auto_accept', {}) && lzm_chatDisplay.autoAcceptChecked == 1)) {
        return true;
    } else {
        return false;
    }
}

function playIncomingMessageSound(sender, receivingChat, chatId, text) {
    receivingChat = (typeof receivingChat != 'undefined' && receivingChat != '') ? receivingChat : sender;
    lzm_chatDisplay.lastChatSendingNotification = receivingChat;
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    text = (typeof text != 'undefined') ? text : '';
    if (lzm_chatDisplay.playNewMessageSound == 1 &&
        ($.inArray(sender, lzm_chatDisplay.openChats) != -1 || sender.indexOf('~') == -1 || lzm_chatDisplay.playNewChatSound != 1 )) {
        lzm_chatDisplay.playSound('message', sender, text);
    }
    var notificationSound;
    if (lzm_chatDisplay.playNewMessageSound != 1) {
        notificationSound = 'DEFAULT'
    } else {
        notificationSound = 'NONE'
    }
    text = (typeof text != 'undefined') ? text : '';
    var i, senderId, senderBid, senderName = t('Visitor');
    if (sender.indexOf('~') != -1) {
        senderId = sender.split('~')[0];
        senderBid = sender.split('~')[1];
        var visitor = lzm_chatServerEvaluation.visitors.getVisitor(senderId);
        if (visitor != null) {
            for (var j=0; j<visitor.b.length; j++) {
                if (visitor.b[j].id == senderBid) {
                    senderName = (typeof visitor.b[j].cname != 'undefined' && visitor.b[j].cname != '') ? visitor.b[j].cname : visitor.unique_name;
                }
            }
        }

    } else {
        senderId = sender;
        var operator = lzm_chatServerEvaluation.operators.getOperator(senderId);
        senderName = (operator != null) ? operator.name : senderName;
    }
    text = text.replace(/<.*?>/g,'').replace(/<\/.*?>/g,'');
    var notificationText = t('<!--sender-->: <!--text-->',[['<!--sender-->',senderName],['<!--text-->',text]]).substr(0, 250);
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.showNotification(t('LiveZilla'), notificationText, notificationSound, sender, receivingChat, "1");
        } catch(ex) {
            try {
                lzm_deviceInterface.showNotification(t('LiveZilla'), notificationText, notificationSound, sender, receivingChat);
            } catch(e) {
                logit('Error while showing notification');
            }
        }
    }
    if (lzm_chatDisplay.selected_view != 'mychats' || $('.dialog-window-container').length > 0) {
        if (sender.indexOf('~') == -1 ||
            ((lzm_chatServerEvaluation.userChats.getUserChat(sender) != null && lzm_chatServerEvaluation.userChats.getUserChat(sender).accepted) ||
                isAutoAcceptActive())) {
            lzm_displayHelper.showBrowserNotification({
                text: notificationText,
                subject: t('New Chat Message'),
                action: 'openChatFromNotification(\'' + receivingChat + '\'); closeOrMinimizeDialog();',
                timeout: 10
            });
        }
    }
}

function closeOrMinimizeDialog() {
    $('#minimize-dialog').click();
    $('#close-dialog').click()
}

function openChatFromNotification(chatPartner, type) {
    type = (typeof type != 'undefined') ? type : '';
    selectView('mychats');
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        lzm_chatDisplay.lastChatSendingNotification = chatPartner;
    }
    if (lzm_chatDisplay.lastChatSendingNotification != '') {
        openLastActiveChat('notification');
    }
    if (type == 'push') {
        showAppIsSyncing();
    }
}

function leaveChat() {
    var leaveChat = false;
    removeEditor();
    if (lzm_chatDisplay.thisUser.b_id != '') {
        lzm_chatServerEvaluation.setChatAccepted(lzm_chatDisplay.active_chat_reco, false);
        var thisBId = lzm_chatDisplay.active_chat_reco.split('~')[1];
        for (var i=0; i<lzm_chatDisplay.thisUser.b.length; i++) {
            if (lzm_chatDisplay.thisUser.b[i].id == thisBId) {
                lzm_chatDisplay.thisUser.b_id = lzm_chatDisplay.thisUser.b[i].id;
                lzm_chatDisplay.thisUser.b_chat_id = lzm_chatDisplay.thisUser.b[i].chat.id;
                break;
            }
        }
        if (lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco) != null) {
            if (lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco).status == 'declined') {
                lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
                lzm_chatUserActions.setActiveChat('', '', '', { id:'', b_id:'', b_chat:{ id:'' } });
                lzm_chatDisplay.createActiveChatPanel(false, true, false);
                lzm_chatDisplay.createHtmlContent(lzm_chatDisplay.thisUser, lzm_chatDisplay.active_chat_reco);
                leaveChat = true;
            } else if (lzm_chatServerEvaluation.userChats.getUserChat(lzm_chatDisplay.active_chat_reco).status == 'left' ||
                lzm_chatDisplay.thisUser.is_active == false ||
                confirm(t('Do you really want to close this Chat?'))) {
                lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
                lzm_chatUserActions.leaveExternalChat(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.b_id, lzm_chatDisplay.thisUser.b_chat.id, 0);
                leaveChat = true;
            }
        }
    } else {
        lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
        lzm_chatUserActions.leaveInternalChat(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.userid, lzm_chatDisplay.thisUser.name);
        leaveChat = true;
    }

    if (leaveChat) {
        var senders = Object.keys(lzm_chatServerEvaluation.userChats.getUserChatList());
        var newActiveChat = '';
        for (var j=(senders.length - 1); j>=0; j--) {
            if ($.inArray(senders[j], lzm_chatDisplay.closedChats) == -1 &&
                $.inArray(lzm_chatServerEvaluation.userChats.getUserChat(senders[j]).status, ['left', 'declined']) == -1) {
                newActiveChat = senders[j];
                break;
            }
        }
        if (newActiveChat == '') {
            for (var k=(senders.length - 1); k>=0; k--) {
                if (lzm_chatServerEvaluation.userChats.getUserChat(senders[k]).type == 'external' &&
                    $.inArray(senders[k], lzm_chatDisplay.closedChats) == -1) {
                    newActiveChat = senders[k];
                    break;
                }
            }
        }

        lzm_chatDisplay.lastActiveChat = newActiveChat;
        lzm_chatDisplay.lastActiveCallCounter = 0;
        openLastActiveChat();
    }
}

function fillStringsFromTranslation() {
    if (loopCounter > 49 || lzm_t.translationArray.length != 0) {
        for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
            //USe untranslated strings here. The translation is done when creating the panel!
            if (lzm_chatDisplay.viewSelectArray[i].id == 'mychats')
                lzm_chatDisplay.viewSelectArray[i].name = 'My Chats';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'tickets')
                lzm_chatDisplay.viewSelectArray[i].name = 'Tickets';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'external')
                lzm_chatDisplay.viewSelectArray[i].name = 'Visitors';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'archive')
                lzm_chatDisplay.viewSelectArray[i].name = 'Chat Archive';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'internal')
                lzm_chatDisplay.viewSelectArray[i].name = 'Operators';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'qrd')
                lzm_chatDisplay.viewSelectArray[i].name = 'Resources';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'filter')
                lzm_chatDisplay.viewSelectArray[i].name = 'Filter';
            if (lzm_chatDisplay.viewSelectArray[i].id == 'world')
                lzm_chatDisplay.viewSelectArray[i].name = 'Map';
        }
        lzm_chatDisplay.createViewSelectPanel();
    } else {
        loopCounter++;
        setTimeout(function() {fillStringsFromTranslation();}, 50);
    }
}

function openLink(url) {
    if (app == 1) {
        try {
            lzm_deviceInterface.openExternalBrowser(url);
        } catch(ex) {
            logit('Opening device browser failed');
        }
    } else if (web == 1) {
        window.open(url, '_blank');
    }
}

function downloadFile(address) {
    if (app == 1) {
        try {
            lzm_deviceInterface.openFile(address);
        } catch(ex) {
            logit('Downloading file in device failed');
        }
    } else if (web == 1) {
        window.open(address, '_blank');
    }
}

function tryNewLogin(logoutOtherInstance) {
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,lzm_chatPollServer.chosenProfile.server_url, logoutOtherInstance);
}

function initEditor(myText, caller) {
    if ((app == 1) || isMobile) {
        setEditorContents(myText)
    } else {
        lzm_chatInputEditor.init(myText, 'initEditor_' + caller);
    }
}

function removeEditor() {
    if ((app == 1) || isMobile) {
        // do nothing here
    } else {
        lzm_chatInputEditor.removeEditor();
     }
}

function setFocusToEditor() {
    if ((app == 1) || isMobile) {
        $('#chat-input').focus();
    }
}

function grabEditorContents() {
    if ((app == 1) || isMobile) {
        return $('#chat-input').val();
    } else {
        return lzm_chatInputEditor.grabHtml();
    }
}

function setEditorContents(myText) {
    if ((app == 1) || isMobile) {
        $('#chat-input').val(myText)
    } else {
        lzm_chatInputEditor.setHtml(myText)
    }
}

function clearEditorContents(os, browser, caller) {
    if ((app == 1) || isMobile) {
        if (appOs != 'blackberry') {
            $('#chat-input').val('');
        } else if (typeof caller != 'undefined' && caller == 'send') {
            var activeChat = lzm_chatDisplay.active_chat_reco, cpId = '', cpUserId = '', cpName = '', cpChatId = '';
            var operator = lzm_chatServerEvaluation.operators.getOperator(activeChat);
            var group = lzm_chatServerEvaluation.groups.getGroup(activeChat);
            var visitorBrowser = lzm_chatServerEvaluation.visitors.getVisitorBrowser(activeChat);
            if (activeChat == 'everyoneintern') {
                cpId = activeChat; cpUserId = activeChat; cpName = t('All Operators');
            } else if (operator != null) {
                cpId = operator.id; cpUserId = operator.userid; cpName = operator.name;
            } else if(group != null) {
                cpId = group.id; cpUserId = group.id; cpName = group.name;
            } else if (visitorBrowser[1] != null) {
                cpId = visitorBrowser[0].id; cpUserId = visitorBrowser[1].id; cpChatId = visitorBrowser[1].chat.id;
            }
            chatInternalWith('', '', '');
            saveChatInput(activeChat, null);
            if (cpChatId == '') {
                chatInternalWith(cpId, cpUserId, cpName);
            } else {
                viewUserData(cpId, cpUserId, cpChatId, true);
            }
        }
    } else {
        lzm_chatInputEditor.clearEditor(os, browser);
    }
}

function setEditorDisplay(myDisplay) {
    if ((app == 1) || isMobile) {
        $('#chat-input').css({display: myDisplay});
    } else {
        $('#chat-input-body').css({display: myDisplay});
    }
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function minimizeDialogWindow(dialogId, windowId) {
    try {
        if (typeof lzm_chatDisplay.dialogData.editors != 'undefined') {
            for (var i=0; i<lzm_chatDisplay.dialogData.editors.length; i++) {
                if (typeof window[lzm_chatDisplay.dialogData.editors[i].instanceName] != 'undefined') {
                    lzm_chatDisplay.dialogData.editors[i].text = window[lzm_chatDisplay.dialogData.editors[i].instanceName].grabHtml();
                    window[lzm_chatDisplay.dialogData.editors[i].instanceName].removeEditor();
                }
            }
        }
    } catch(e) {}
    var selectedView = (lzm_chatDisplay.dialogData['no-selected-view'] == true) ? '' : lzm_chatDisplay.selected_view;

    lzm_displayHelper.minimizeDialogWindow(dialogId, windowId, lzm_chatDisplay.dialogData, selectedView);
}

function maximizeDialogWindow(dialogId) {
    lzm_displayHelper.maximizeDialogWindow(dialogId);
}

function blinkPageTitle(message) {
    var doBlinkTitle = true, blinkStatus = 0;

    var blink = function() {
        if (doBlinkTitle) {
            var newTitle = (blinkStatus == 0)
                ? t('<!--site_name--> (<!--message-->)', [['<!--site_name-->',lzm_chatServerEvaluation.siteName], ['<!--message-->', message]])
                : lzm_chatServerEvaluation.siteName;
            $('title').html(newTitle);
            blinkStatus = 1 - blinkStatus;
            setTimeout(function() {
                blink()
            }, 5000);
        } else {
            $('title').html(lzm_chatServerEvaluation.siteName);
        }
    };

    blink();
    $(window).mousemove(function() {
        doBlinkTitle = false;
        blink();
    });
}

function debuggingShowDisplayHeight() {
    if ($(window).height() != debuggingDisplayHeight) {
        debuggingDisplayHeight = $(window).height();
        if (app == 1) {
            lzm_deviceInterface.showToast($(window).height());
        } else {
            logit($(window).height());
        }
    }
}

function getCredentials() {
    var cookieName = 'lzm-credentials';
    var cookieValue = document.cookie;
    var cookieStart = (cookieValue.indexOf(" " + cookieName + "=") != -1) ? cookieValue.indexOf(" " + cookieName + "=") : cookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    if (cookieStart == -1) {
        cookieValue = {'login_name': '', 'login_passwd': ''};
    } else {
        cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (cookieValue.indexOf(";", cookieStart) != -1) ? cookieValue.indexOf(";", cookieStart) : cookieValue.length;
        cookieValue = cookieValue.substring(cookieStart,cookieEnd);
        cookieValue = {
            'login_name': lz_global_base64_url_decode(cookieValue.split('%7E')[0]),
            'login_passwd': cookieValue.split('%7E')[1]
        };
    }

    chosenProfile.login_name = cookieValue.login_name;
    chosenProfile.login_passwd = cookieValue.login_passwd;

    // Call this twice for some unknown reason...
    deleteCredentials();
    deleteCredentials();
}

function deleteCredentials() {
    var cookieName = 'lzm-credentials';
    var completeCookieValue = document.cookie;
    var cookieStart = (completeCookieValue.indexOf(" " + cookieName + "=") != -1) ? completeCookieValue.indexOf(" " + cookieName + "=") : completeCookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    if (cookieStart == -1) {
        return false;
    } else {
        cookieStart = completeCookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (completeCookieValue.indexOf(";", cookieStart) != -1) ? completeCookieValue.indexOf(";", cookieStart) : completeCookieValue.length;
        var cookieValue = completeCookieValue.substring(cookieStart,cookieEnd);
        var pattern = new RegExp(cookieName + '=' + cookieValue,'');
        completeCookieValue = completeCookieValue.replace(pattern, cookieName + '=0');
        document.cookie = completeCookieValue;

        return true;
    }
}

function handleContextMenuClick(e) {
    e.stopPropagation();
}

function showNotMobileMessage() {
    alert(t('This functionality is not available on mobile devices.'));
}

function showNoPermissionMessage() {
    alert(t('You have no permission for this action. Permissions can be granted in the User Management panel (LiveZilla Server Admin)'));
}

function handleWindowResize(scrollDown) {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
    var thisChatProgress = $('#chat-progress');
    if (scrollDown) {
        setTimeout(function() {
            thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);
        }, 10);
    }
}

function setViewSelectPanel2ImagesAndText(newSelViewIndex) {
    if (views.length > 0) {
        newSelViewIndex = (typeof newSelViewIndex != 'undefined') ? newSelViewIndex : $('#radio-this-text').data('selected-view-index');
        setTimeout(function(){$('#radio-this-text span.ui-btn-text').text(views[newSelViewIndex].text);
            $('#radio-left-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
                'background-position': '-144px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
                'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '12px'});
            $('#radio-right-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
                'background-position': '-108px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
                'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '18px'});
        },5);
        $('#radio-this-text').data('selected-view-index', newSelViewIndex);
    }
}

function insertAtCursor(myField, myValue) {
    myField = document.getElementById(myField);
    //IE support
    if (document.selection) {
        myField.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function selectView(id) {
    if (id != lzm_chatDisplay.selected_view) {
        lzm_chatUserActions.saveChatInput(lzm_chatUserActions.active_chat_reco);
        removeEditor();
        lzm_chatDisplay.selected_view = id;
        lzm_chatDisplay.createHtmlContent(lzm_chatPollServer.thisUser, lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'qrd') {
            lzm_chatDisplay.createQrdTree('view-select-panel', lzm_chatDisplay.lastActiveChat);
        } else {
            cancelQrdPreview();
            $('#qrd-tree-body').remove();
            $('#qrd-tree-footline').remove();
        }
        if (lzm_chatDisplay.selected_view == 'tickets') {
            lzm_chatDisplay.createTicketList(lzm_chatServerEvaluation.tickets, lzm_chatServerEvaluation.ticketGlobalValues,
                lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
                false);
        }
        if (lzm_chatDisplay.selected_view != 'mychats') {
            lzm_chatUserActions.setActiveChat('', '', '', { id:'', b_id:'', b_chat:{ id:'' } });
        }
        if (lzm_chatDisplay.selected_view == 'external' && !lzm_chatDisplay.VisitorListCreated && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.updateVisitorList();
        }
        if (lzm_chatDisplay.selected_view == 'archive') {
            if ($('#chat-archive-table').length == 0) {
                lzm_chatDisplay.createArchive();
            } else {
                lzm_chatDisplay.updateArchive();
            }
        }
        finishSettingsDialogue();
        lzm_chatDisplay.toggleVisibility();
        if (lzm_chatDisplay.selected_view == 'mychats') {
            createActiveChatHtml();
        }
        if (lzm_chatDisplay.selected_view != 'external') {
            if (!mobile && app != 1) {
                delete messageEditor;
            }
            $('#chat-invitation-container').remove();
        }
        if (lzm_chatDisplay.selected_view == 'world') {
            lzm_displayLayout.resizeGeotrackingMap();
            setTimeout(function() {lzm_displayLayout.resizeGeotrackingMap();}, 20);
            if ($('#geotracking-body').data('src') == '') {
                var gtKey = (lzm_chatServerEvaluation.crc3 != null) ? lzm_chatServerEvaluation.crc3[6] : '';
                var myServerAddress = 'https://ssl.livezilla.net';
                var geoTrackingUrl = 'https://ssl.livezilla.net/geo/map/index.php?web=1&pvc=' + lzm_commonConfig.lz_version + '&key=' + gtKey;
                //var myServerAddress = 'http://livezilla.name';
                //var geoTrackingUrl = 'http://livezilla.name/oburger/geo-test/iframe.html';
                //var myServerAddress = 'http://192.168.0.23'
                //var geoTrackingUrl = 'http://192.168.0.23/livezilla5/mobile/geo-test/iframe.html';
                $('#geotracking-body').data('src', geoTrackingUrl);
                $('#geotracking-iframe').attr('src', geoTrackingUrl);
                lzm_chatGeoTrackingMap.setIframe($('#geotracking-iframe')[0]);
                lzm_chatGeoTrackingMap.setReceiver(myServerAddress);
                //$('#geotracking-iframe').get(0).contentWindow.location.href = geoTrackingUrl;
            }
            if (!lzm_chatGeoTrackingMap.delayAddIsInProgress)
                lzm_chatGeoTrackingMap.addOrQueueVisitor();
            if (lzm_chatGeoTrackingMap.selectedVisitor != null) {
                lzm_chatGeoTrackingMap.setSelection(lzm_chatGeoTrackingMap.selectedVisitor, '');
            }
        }
        if (lzm_chatDisplay.selected_view == 'external' && typeof $('#visitor-list').data('selected-visitor') != 'undefined') {
            selectVisitor(null, $('#visitor-list').data('selected-visitor'));
        }

        lzm_chatDisplay.lastChatSendingNotification = '';
        lzm_chatDisplay.createViewSelectPanel();
    }
}

function orderViewPanel(viewArray, selectedViewId) {
    var viewSelectArray = [], viewSelectObject = {}, i = 0;
    var showViewSelectPanel = {};
    for (i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
        viewSelectObject[lzm_chatDisplay.viewSelectArray[i].id] = lzm_chatDisplay.viewSelectArray[i].name;
        showViewSelectPanel[lzm_chatDisplay.viewSelectArray[i].id] =
            ($('#show-' + lzm_chatDisplay.viewSelectArray[i].id).prop('checked')) ? 1 : 0;
    }
    for (i=0; i<viewArray.length; i++) {
        viewSelectArray.push({id: viewArray[i], name : viewSelectObject[viewArray[i]]});
    }
    var settingsHtml = lzm_displayHelper.createViewSelectSettings(viewSelectArray, showViewSelectPanel);
    $('#view-select-settings').html(settingsHtml).trigger('create');

    var viewId = '';
    $('.show-view-div').click(function() {
        $('.show-view-div').removeClass('selected-panel-settings-line');
        $(this).addClass('selected-panel-settings-line');
        viewId = $(this).data('view-id');
        lzm_chatDisplay.togglePositionChangeButtons(viewId);
    });
    $('.position-change-buttons-up').click(function() {
        var myIndex = $.inArray(viewId, viewArray);
        if (myIndex != 0) {
            var replaceId = viewArray[myIndex - 1];
            for (var i=0; i<viewArray.length; i++) {
                viewArray[i] = (i == myIndex) ? replaceId : (i == myIndex - 1) ? viewId : viewArray[i];
            }
            orderViewPanel(viewArray, viewId);
        }
    });
    $('.position-change-buttons-down').click(function() {
        var myIndex = $.inArray(viewId, viewArray);
        if (myIndex != viewArray.length - 1) {
            var replaceId = viewArray[myIndex + 1];
            for (var i=0; i<viewArray.length; i++) {
                viewArray[i] = (i == myIndex) ? replaceId : (i == myIndex + 1) ? viewId : viewArray[i];
            }
            orderViewPanel(viewArray, viewId);
        }
    });
    $('#show-view-div-' + selectedViewId).click();
}

function moveViewSelectPanel(target) {
    if (target == 'left' || target == 'right') {
        try {
            for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
                var j = 0;
                if (lzm_chatDisplay.firstVisibleView == lzm_chatDisplay.viewSelectArray[i].id) {
                    if (target == 'left') {
                        target = lzm_chatDisplay.viewSelectArray[i].id;
                        for (j=i-1; j>=0; j--) {
                            if (lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.viewSelectArray[j].id] != 0 &&
                                (lzm_chatDisplay.viewSelectArray[j].id != 'world' || lzm_chatServerEvaluation.crc3 == null || lzm_chatServerEvaluation.crc3[2] != -2)) {
                                target = lzm_chatDisplay.viewSelectArray[j].id;
                                break;
                            }
                        }
                    } else {
                        target = lzm_chatDisplay.viewSelectArray[i].id;
                        for (j=i+1; j<lzm_chatDisplay.viewSelectArray.length; j++) {
                            if (lzm_chatDisplay.showViewSelectPanel[lzm_chatDisplay.viewSelectArray[j].id] != 0 &&
                                (lzm_chatDisplay.viewSelectArray[j].id != 'world' || lzm_chatServerEvaluation.crc3 == null || lzm_chatServerEvaluation.crc3[2] != -2)) {
                                target = lzm_chatDisplay.viewSelectArray[j].id;
                                break;
                            }
                        }
                    }
                }
            }
        } catch(e) {}
    }
    lzm_chatDisplay.firstVisibleView = target;
    lzm_chatDisplay.createViewSelectPanel(target);
}

// Extend the standard regexp functionality
RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function capitalize(myString) {
    myString = myString.replace(/^./, function (char) {
        return char.toUpperCase();
    });
    return myString;
}

function blockVisitorListUpdate() {
    setTimeout(function() {
        if (lzm_chatDisplay.visitorListScrollingWasBlocked && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.updateVisitorList();
        }
    },2000);
}

var mapMessageReceiver = null;

function setMapType(myType) {
    lzm_chatGeoTrackingMap.setMapType(myType);
    var buttonId = myType.toLowerCase() + '-map';
    var blueButtonBackground = lzm_displayHelper.addBrowserSpecificGradient('', 'blue');
    var defaultButtonBackground = lzm_displayHelper.addBrowserSpecificGradient('');
    lzm_chatGeoTrackingMap.selectedMapType = myType;
    $('#geotracking-footline').html(lzm_displayHelper.createGeotrackingFootline());
}

function zoomMap(direction) {
    lzm_chatGeoTrackingMap.zoom(direction);
}

/**
 * Some stuff done on load of the chat page
 */
$(document).ready(function () {
    lzm_displayHelper = new ChatDisplayHelperClass();
    lzm_displayLayout = new ChatDisplayLayoutClass();
    getCredentials();
    lzm_displayHelper.blockUi({message: null});

    // initiate lzm class objects
    if ((app == 1) && typeof lzm_deviceInterface == 'undefined') {
        lzm_deviceInterface = new CommonDeviceInterfaceClass();
    }
    if (app == 1) {
        var tmpDeviceId = lzm_deviceInterface.loadDeviceId();
        if (tmpDeviceId != 0) {
            deviceId = tmpDeviceId;
        }
    }
    if (app == 1 || isMobile) {
        var chatInputTextArea = document.getElementById("chat-input");
        chatInputTextArea.onfocus = function() {
            moveCaretToEnd(chatInputTextArea);
            // Work around Chrome's little problem
            window.setTimeout(function() {
                moveCaretToEnd(chatInputTextArea);
            }, 1);
        };
    }
    lzm_commonConfig = new CommonConfigClass();
    lzm_commonTools = new CommonToolsClass();
    lzm_commonPermissions = new CommonPermissionClass();
    lzm_commonStorage = new CommonStorageClass(localDbPrefix, (app == 1));
    lzm_chatTimeStamp = new ChatTimestampClass(0);
    var userConfigData = {
        userVolume: chosenProfile.user_volume,
        awayAfter: (typeof chosenProfile.user_away_after != 'undefined') ? chosenProfile.user_away_after : 0,
        playIncomingMessageSound: (typeof chosenProfile.play_incoming_message_sound != 'undefined') ? chosenProfile.play_incoming_message_sound : 0,
        playIncomingChatSound: (typeof chosenProfile.play_incoming_chat_sound != 'undefined') ? chosenProfile.play_incoming_chat_sound : 0,
        repeatIncomingChatSound: (typeof chosenProfile.repeat_incoming_chat_sound != 'undefined') ? chosenProfile.repeat_incoming_chat_sound : 0,
        playIncomingTicketSound: (typeof chosenProfile.play_incoming_ticket_sound != 'undefined') ? chosenProfile.play_incoming_ticket_sound : 0,
        language: (typeof chosenProfile.language != 'undefined') ? chosenProfile.language : 'en',
        backgroundMode: (typeof chosenProfile.background_mode != 'undefined') ? chosenProfile.background_mode : 1
    };
    lzm_chatInputEditor = new ChatEditorClass('chat-input', isMobile, (app == 1), (web == 1));
    lzm_chatDisplay = new ChatDisplayClass(lzm_chatTimeStamp.getServerTimeString(), lzm_commonConfig, lzm_commonTools,
        lzm_chatInputEditor, (web == 1), (app == 1), isMobile, messageTemplates, userConfigData, multiServerId);
    lzm_commonDialog = new CommonDialogClass();
    lzm_chatServerEvaluation = new ChatServerEvaluationClass(lzm_commonTools, chosenProfile, lzm_chatTimeStamp);
    lzm_chatPollServer = new ChatPollServerClass(lzm_commonConfig, lzm_commonTools, lzm_chatDisplay,
        lzm_chatServerEvaluation, lzm_commonStorage, chosenProfile, userStatus, web, app, isMobile, multiServerId);
    lzm_t = new CommonTranslationClass(chosenProfile.server_protocol, chosenProfile.server_url, chosenProfile.mobile_dir, false, chosenProfile.language);
    lzm_chatUserActions = new ChatUserActionsClass(lzm_commonTools, lzm_chatPollServer, lzm_chatDisplay,
        lzm_chatServerEvaluation, lzm_t, lzm_commonStorage, lzm_chatInputEditor, chosenProfile);
    lzm_chatGeoTrackingMap = new ChatGeotrackingMapClass();
    mapMessageReceiver = function(_event) {
        if (_event.origin == lzm_chatGeoTrackingMap.receiver) {
            switch(_event.data.function) {
                case 'get-url':
                lzm_chatGeoTrackingMap.urlIsSet = true;
                    break;
                case 'get-visitor':
                    lzm_chatGeoTrackingMap.selectedVisitor = _event.data.params;
                    $('#visitor-list').data('selected-visitor', _event.data.params);
                    $('#geotracking-footline').html(lzm_displayHelper.createGeotrackingFootline());
                    break;
                case 'get-zoomlevel':
                    lzm_chatGeoTrackingMap.zoomLevel = _event.data.params;
                    break;
                default:
                    logit('Unknown message received: ' + JSON.stringify(_event.data));
                    break;
            }
        }
    };
    window.addEventListener('message', mapMessageReceiver, false);
    lzm_chatServerEvaluation.userLanguage = lzm_t.language;
    lzm_chatDisplay.userLanguage = lzm_t.language;
    lzm_chatUserActions.userLanguage = lzm_t.language;

    if (lzm_chatDisplay.viewSelectArray.length == 0) {
        lzm_chatDisplay.viewSelectArray = [];
        var viewSelectIdArray = Object.keys(lzm_chatDisplay.allViewSelectEntries);
        for (var i=0; i<viewSelectIdArray.length; i++) {
            lzm_chatDisplay.viewSelectArray.push({id: viewSelectIdArray[i], name: lzm_chatDisplay.allViewSelectEntries[viewSelectIdArray[i]].title,
                icon: lzm_chatDisplay.allViewSelectEntries[viewSelectIdArray[i]].icon});
        }
    }
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(false);
    if (lzm_chatDisplay.mainTableColumns.visitor.length == 0) {
        lzm_displayHelper.fillColumnArray('visitor', 'general', []);
    }
    if (lzm_chatDisplay.mainTableColumns.archive.length == 0) {
        lzm_displayHelper.fillColumnArray('archive', 'general', []);
    }
    if (lzm_chatDisplay.mainTableColumns.ticket.length == 0) {
        lzm_displayHelper.fillColumnArray('ticket', 'general', []);
    }

    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,
        lzm_chatPollServer.chosenProfile.server_url);

    createUserControlPanel();
    fillStringsFromTranslation();

    mobile = (isMobile) ? 1 : 0;

    // do things on window resize
    $(window).resize(function () {
        setTimeout(function() {
            lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
                lzm_chatServerEvaluation.myUserId);
            lzm_chatDisplay.createViewSelectPanel();
            if (lzm_chatDisplay.selected_view == 'external') {
                lzm_chatDisplay.createVisitorList();
            }
            if (lzm_chatDisplay.selected_view == 'mychats') {
                lzm_chatDisplay.createActiveChatPanel(false, false);
            }
            lzm_chatDisplay.createChatWindowLayout(false, false);
            var resizeTimeout = (isMobile || (app == 1)) ? 100 : 100;
            setTimeout(function() {
                handleWindowResize(true);
                    setTimeout(function() {
                        handleWindowResize(true);
                    }, 500);
                if (isMobile || (app == 1)) {
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 2500);
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 10000);
                }
            }, resizeTimeout);
        }, 10);
    });

    $('.logout_btn').click(function () {
        logout(true);
    });

    $('#stop_polling').click(function () {
        stopPolling();
    });

    $('#userstatus-button').click(function (e) {
        e.stopPropagation();
        var thisUserstatusMenu = $('#userstatus-menu');
        if (lzm_chatDisplay.showUserstatusHtml == false) {
            lzm_chatDisplay.showUserstatusMenu(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
                lzm_chatServerEvaluation.myUserId);
            thisUserstatusMenu.css({'display':'block'});
            lzm_chatDisplay.showUserstatusHtml = true;
        } else {
            thisUserstatusMenu.css({'display':'none'});
            lzm_chatDisplay.showUserstatusHtml = false;
        }
        if (!mobile && app != 1) {
            delete messageEditor;
        }
        $('#chat-invitation-container').remove();
    });

    $('#usersettings-button').click(function (e) {
        e.stopPropagation();
        var thisUsersettingsMenu = $('#usersettings-menu');
        if (lzm_chatDisplay.showUsersettingsHtml == false) {
            lzm_chatDisplay.showUsersettingsMenu();
            thisUsersettingsMenu.css({'display':'block'});
            lzm_chatDisplay.showUsersettingsHtml = true;
        } else {
            thisUsersettingsMenu.css({'display':'none'});
            lzm_chatDisplay.showUsersettingsHtml = false;
        }
        if (!mobile && app != 1) {
            delete messageEditor;
        }
        $('#chat-invitation-container').remove();
    });

    $('#wishlist-button').click(function() {
        openLink('http://wishlistmobile.livezilla.net/');
    });

    $('#blank-button').click(function() {
        if(debug) {
            debuggingStartStopPolling();
        }
    });

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });

    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });

    $('body').mouseover(function(){lzm_chatPollServer.wakeupFromAutoSleep();});

    $('body').click(function(e) {
        // Hide user settings menu
        $('#usersettings-menu').css({'display':'none'});
        lzm_chatDisplay.showUsersettingsHtml = false;
        // Hide user status menu
        $('#userstatus-menu').css({'display':'none'});
        lzm_chatDisplay.showUserstatusHtml = false;
        // Hide minimized dialogs menu
        lzm_displayHelper.showMinimizedDialogsMenu(true);
        // Remove all kinds of context menus
        removeTicketContextMenu();
        removeArchiveFilterMenu();
        removeQrdContextMenu();
        removeTicketMessageContextMenu();
        removeTicketFilterMenu();
        removeVisitorListContextMenu();
        removeOperatorListContextMenu();
        if ($('.operator-list-line-new').length > 0) {
            saveNewDynamicGroup();
        }
    });

    $('body').keyup(function(e) {
        var keyCode = (typeof e.which != 'undefined') ? e.which : e.keyCode;
        if (keyCode == 17) {
            controlPressed = false;
        }
        if ($('#email-list').length > 0 && (keyCode == 46)) {
            deleteEmail();
        }
        if ($('#ticket-list-body').length > 0 && $('.dialog-window-container').length == 0 && !controlPressed) {
            var newStatus = 0;
            switch(keyCode) {
                case 79:
                    changeTicketStatus(0);
                    break;
                case 80:
                    changeTicketStatus(1);
                    break;
                case 67:
                    changeTicketStatus(2);
                    break;
                case 46:
                case 68:
                    changeTicketStatus(3, true);
                    break;
                case 40:
                    selectTicket('next');
                    break;
                case 38:
                    selectTicket('previous');
                    break;
            }
        }
    });
    $('body').keydown(function(e) {
        var keyCode = (typeof e.which != 'undefined') ? e.which : e.keyCode;
        if (keyCode == 17) {
            controlPressed = true;
        }
    });

    $(window).on('beforeunload', function(){
        if (lzm_chatDisplay.askBeforeUnload)
            return t('Are you sure you want to leave or reload the client? You may lose data because of that.');
    });

});
