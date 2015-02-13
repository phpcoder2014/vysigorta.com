/****************************************************************************************
 * LiveZilla ChatDisplayLayoutClass.js
 *
 * Copyright 2014 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatDisplayLayoutClass() {

}

ChatDisplayLayoutClass.prototype.resizeAll = function() {
    this.resizeUserControlPanel();
    this.resizeTicketList();
    this.resizeTicketDetails();
    this.resizeEmailDetails();
    this.resizeOptions();
    this.resizeResources();
    this.resizeAddResources();
    this.resizeEditResources();
    this.resizeTicketReply();
    this.resizeVisitorDetails();
    this.resizeVisitorInvitation();
    this.resizeOperatorForwardSelection();
    this.resizeMessageForwardDialog();
    this.resizeArchivedChat();
    this.resizeDynamicGroupDialogs();
    this.resizeTranslateOptions();
    this.resizeGeotrackingMap();
    this.resizeChatView();
    this.resizeSingleStartPage();
};

ChatDisplayLayoutClass.prototype.resizeTicketList = function() {
    if (lzm_chatDisplay.selected_view == 'tickets' && !lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile && $(window).width() > 1000) {
        var leftWidth = ($(window).width()-33-350);
        var rightWidth = (lzm_displayHelper.checkIfScrollbarVisible('ticket-list-body')) ? 305 - lzm_displayHelper.getScrollBarWidth() : 305;
        $('#ticket-list-left').css({width: leftWidth+'px'});
        $('#ticket-list-right').css({width: rightWidth+'px'});
        $('.ticket-list').css({height: ($('#ticket-list-body').height() - 12) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeTicketDetails = function() {
    var myHeight = Math.max($('#ticket-details-body').height(), $('#email-list-body').height());
    myHeight = Math.max(myHeight, $('#visitor-information-body').height());
    var myWidth = Math.max($('#ticket-details-body').width(), $('#email-list-body').width());
    myWidth = Math.max(myWidth, $('#visitor-information-body').width());
    if (myHeight > 0) {
        var historyHeight, detailsHeight;
        if (myHeight > 600) {
            historyHeight = 245;
            detailsHeight = myHeight - historyHeight - 90;
        } else {
            detailsHeight = (myHeight > 535) ? 265 : (myHeight > 340) ? 200 : 120;
            historyHeight = myHeight - detailsHeight - 90;
        }
        var newInputHeight = Math.max(detailsHeight - 48, 150);
        var commentInputHeight = Math.max(140, myHeight - 44);
        $('.ticket-history-placeholder-content').css({height: historyHeight + 'px'});
        $('.ticket-details-placeholder-content').css({height: detailsHeight + 'px'});
        $('#ticket-comment-list').css({'min-height': (detailsHeight - 22) + 'px'});
        $('#ticket-message-text').css({'min-height': (detailsHeight - 22) + 'px'});
        $('#ticket-message-details').css({'min-height': (detailsHeight - 22) + 'px'});
        $('#ticket-attachment-list').css({'min-height': (detailsHeight - 22) + 'px'});
        $('#ticket-message-list').css({'min-height': (historyHeight - 22) + 'px'});
        $('#ticket-ticket-details').css({'min-height': (historyHeight - 22) + 'px'});
        $('#ticket-new-input').css({height: newInputHeight + 'px'});
        $('#comment-text').css({'min-height': (myHeight - 22)+'px'});
        $('#comment-input').css({width: (myWidth - 28)+'px', height: commentInputHeight + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeTicketReply = function() {
    if ($('#ticket-details-body').length > 0) {
        var displayViews = {'reply': 2, 'preview': 1};
        var tabControlWidth = 0, ticketDetailsBodyHeight = $('#ticket-details-body').height();
        for (var view in displayViews) {
            if (displayViews.hasOwnProperty(view)) {
                if ($('#' + view + '-placeholder-content-' + displayViews[view]).css('display') == 'block') {
                    tabControlWidth = $('#' + view + '-placeholder-content-' + displayViews[view]).width();
                }
            }
        }
        $('.reply-placeholder-content').css({height: (ticketDetailsBodyHeight - 40) + 'px'});
        $('#message-comment-text').css({'min-height': (ticketDetailsBodyHeight - 62) + 'px'});
        $('#message-attachment-list').css({'min-height': (ticketDetailsBodyHeight - 62) + 'px'});
        if (tabControlWidth != 0) {
            $('#preview-comment-text').css({'min-height': (ticketDetailsBodyHeight - 62) + 'px'});
            $('#new-message-comment').css({width: (tabControlWidth - 28) + 'px',
                height: (ticketDetailsBodyHeight - 85) + 'px'});
        }
    }
};

ChatDisplayLayoutClass.prototype.resizeEmailDetails = function() {
    if ($('#email-list-body').length > 0) {
        var myHeight = $('#email-list-body').height() + 10;
        var listHeight = Math.floor(Math.max(myHeight / 2, 175) - 45);
        var contentHeight = (myHeight - listHeight) - 93;
        var contentWidth = $('#email-list-body').width() + 10;
        $('.email-list-placeholder-content').css({height: listHeight + 'px'});
        $('.email-placeholder-content').css({height: contentHeight + 'px'});
        $('#incoming-email-list').css({'min-height': (listHeight - 22) + 'px'});
        $('#email-text').css({'min-height': ($('.email-placeholder-content').height() - 95) + 'px'});
        $('#email-content').css({'min-height': (contentHeight - 22) + 'px'});
        $('#email-html').css({'min-height': (contentHeight - 22) + 'px'});
        $('.html-email-iframe').css({width: (contentWidth - 52) + 'px', height: (contentHeight - 40) + 'px'});
        $('#email-attachment-list').css({'min-height': (contentHeight - 22) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeOptions = function() {
    if ($('#user-settings-dialog-body').length > 0) {
        var tabContentHeight = $('#user-settings-dialog-body').height() - 40;
        $('.settings-placeholder-content').css({height: tabContentHeight+'px'});
        $('#notification-settings').css({'min-height': (tabContentHeight - 22) + 'px'});
        $('#view-select-settings').css({'min-height': (tabContentHeight - 22) + 'px'});
        var chatSettingsHeight = Math.max(35, Math.floor(tabContentHeight / 2) - 22);
        var ticketSettingsHeight = Math.max(35, Math.floor(tabContentHeight / 2) - 27);
        var backgroundSettingsHeight = 0;
        if (lzm_chatDisplay.isApp && (appOs == 'android' || appOs == 'blackberry')) {
            chatSettingsHeight = Math.max(35, Math.floor(tabContentHeight / 3) - 22);
            ticketSettingsHeight = Math.max(35, Math.floor(tabContentHeight / 3) - 27);
            backgroundSettingsHeight = Math.max(35, Math.floor(tabContentHeight / 3) - 28);
        }
        $('#chat-settings').css({'min-height': chatSettingsHeight + 'px'});
        $('#ticket-settings').css({'min-height': ticketSettingsHeight + 'px'});
        if (lzm_chatDisplay.isApp && (appOs == 'android' || appOs == 'blackberry')) {
            $('#background-settings').css({'min-height': backgroundSettingsHeight + 'px'});
        }
        var posBtnWidth = 0, posBtnHeight = 0;
        $('.position-change-buttons-up').each(function() {
            posBtnWidth = Math.max(posBtnWidth, $(this).width());
            posBtnHeight = Math.max(posBtnHeight, $(this).height());
        });
        var positionButtonPadding = Math.floor((18 - posBtnHeight) / 2) + 'px ' +
            Math.ceil((18 - posBtnWidth) / 2) + 'px ' +
            Math.ceil((18 - posBtnHeight) / 2) + 'px ' +
            Math.floor((18 - posBtnWidth) / 2) + 'px';
        $('.position-change-buttons-up').css('padding', positionButtonPadding);
        $('.position-change-buttons-down').css('padding', positionButtonPadding);
    }
};

ChatDisplayLayoutClass.prototype.resizeUserControlPanel = function() {
    var userstatusButtonWidth = 50;
    var usersettingsButtonWidth = 150;
    var mainArticleWidth = $('#content_chat').width();
    if (mainArticleWidth > 380) {
        usersettingsButtonWidth = 250;
    } else if (mainArticleWidth > 355) {
        usersettingsButtonWidth = 225;
    } else if (mainArticleWidth > 330) {
        usersettingsButtonWidth = 200;
    } else if (mainArticleWidth > 305) {
        usersettingsButtonWidth = 175;
    }
    var wishlistButtonWidth = 40;
    lzm_chatDisplay.blankButtonWidth = mainArticleWidth - userstatusButtonWidth - usersettingsButtonWidth - wishlistButtonWidth - 5;
    $('#userstatus-button').css({width: userstatusButtonWidth+'px'});
    $('#usersettings-button').css({width: usersettingsButtonWidth+'px'});
    $('#wishlist-button').css({width: wishlistButtonWidth+'px'});
    $('#blank-button').css({width: lzm_chatDisplay.blankButtonWidth+'px'});
    $('#wishlist-button').children('.ui-btn-inner').css({'padding-left': '0px'});
    $('#blank-button').find('.ui-btn-inner').css({'padding-left': '3px', 'padding-right': '5px'});
    if (lzm_chatDisplay.debuggingDisplayWidth != mainArticleWidth) {
        lzm_chatDisplay.debuggingDisplayWidth = mainArticleWidth;
    }
};

ChatDisplayLayoutClass.prototype.resizeResources = function() {
    var resultListHeight;
    if ($('#qrd-tree-body').children('div').length > 0) {
        $('.qrd-tree-placeholder-content').css({height: ($('#qrd-tree-body').height() - 40) + 'px'});
        resultListHeight = $('#qrd-tree-body').height() - $('#search-input').height() - 89;
        $('#search-results').css({'min-height': resultListHeight + 'px'});
        $('#recently-results').css({'min-height': ($('#qrd-tree-body').height() - 62) + 'px'});
        $('#all-resources').css({'min-height': ($('#qrd-tree-body').height() - 62) + 'px'});
    } else if($('#qrd-tree-dialog-body').length > 0) {
        $('.qrd-tree-placeholder-content').css({height: ($('#qrd-tree-dialog-body').height() - 40) + 'px'});
        resultListHeight = $('#qrd-tree-dialog-body').height() - $('#search-input').height() - 89;
        $('#search-results').css({'min-height': resultListHeight + 'px'});
        $('#recently-results').css({'min-height': ($('#qrd-tree-dialog-body').height() - 62) + 'px'});
        $('#all-resources').css({'min-height': ($('#qrd-tree-dialog-body').height() - 62) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeAddResources = function() {
    if ($('#qrd-add-body').length > 0 || $('#qrd-tree-dialog-body').length > 0 || $('#ticket-details-body').length > 0) {
        var qrdTextHeight = Math.max((lzm_chatDisplay.FullscreenDialogWindowHeight - 312), 100);
        var textWidth = lzm_chatDisplay.FullscreenDialogWindowWidth - 50 - lzm_displayHelper.getScrollBarWidth();
        var thisQrdTextInnerCss = {
            width: (textWidth - 2)+'px', height:  (qrdTextHeight - 20)+'px', border: '1px solid #ccc',
            'background-color': '#f5f5f5'
        };
        var thisQrdTextInputCss = {
            width: (textWidth - 2)+'px', height: (qrdTextHeight - 20)+'px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px', border: '1px solid #ccc'
        };
        var thisQrdTextInputControlsCss;
        thisQrdTextInputControlsCss = {
            width: (textWidth - 2)+'px', height: '15px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '7px 0px', 'text-align': 'left'
        };
        var thisTextInputBodyCss = {
            width: (textWidth - 2)+'px', height: (qrdTextHeight - 51)+'px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px',
            'background-color': '#ffffff', 'overflow-y': 'hidden', 'border-top': '1px solid #ccc'
        };
        var myHeight = Math.max($('#qrd-add-body').height(), $('#qrd-tree-dialog-body').height(), $('#ticket-details-body').height());
        $('#add-resource').css({'min-height': (myHeight - 61) +'px'});
        $('#qrd-add-text-inner').css(thisQrdTextInnerCss);
        $('#qrd-add-text-controls').css(thisQrdTextInputControlsCss);
        $('#qrd-add-text').css(thisQrdTextInputCss);
        $('#qrd-add-text-body').css(thisTextInputBodyCss);
        var uiWidth = Math.min(textWidth - 10, 300);
        var selectWidth = uiWidth + 10;
        $('.short-ui').css({width: uiWidth + 'px'});
        $('select.short-ui').css({width: selectWidth + 'px'});
        $('.long-ui').css({width: (textWidth - 10) + 'px'});
        $('select.long-ui').css({width: textWidth + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeEditResources = function() {
    if ($('#qrd-edit-body').length > 0) {
        var qrdTextHeight = Math.max((lzm_chatDisplay.FullscreenDialogWindowHeight - 256), 100);
        var textWidth = lzm_chatDisplay.FullscreenDialogWindowWidth - 50 - lzm_displayHelper.getScrollBarWidth();
        var thisQrdTextInnerCss = {
            width: (textWidth - 2)+'px', height:  (qrdTextHeight - 20)+'px', border: '1px solid #ccc',
            'background-color': '#f5f5f5'
        };
        var thisQrdTextInputCss = {
            width: (textWidth - 2)+'px', height: (qrdTextHeight - 20)+'px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px', border: '1px solid #ccc'
        };
        var thisQrdTextInputControlsCss;
        thisQrdTextInputControlsCss = {
            width: (textWidth - 2)+'px', height: '15px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '7px 0px', 'text-align': 'left'
        };
        var thisTextInputBodyCss = {
            width: (textWidth - 2)+'px', height: (qrdTextHeight - 51)+'px',
            'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px',
            'background-color': '#ffffff', 'overflow-y': 'hidden', 'border-top': '1px solid #ccc'
        };
        var myHeight = Math.max($('#qrd-edit-body').height(), $('#qrd-tree-dialog-body').height(), $('#ticket-details-body').height());
        $('#edit-resource').css({'min-height': (myHeight - 61) +'px'});
        $('#edit-resource-inner').css({width: textWidth + 'px'});
        $('#qrd-edit-text-inner').css(thisQrdTextInnerCss);
        $('#qrd-edit-text-controls').css(thisQrdTextInputControlsCss);
        $('#qrd-edit-text').css(thisQrdTextInputCss);
        $('#qrd-edit-text-body').css(thisTextInputBodyCss);
        var uiWidth = Math.min(textWidth - 10, 300);
        var selectWidth = uiWidth + 10;
        $('.short-ui').css({width: uiWidth + 'px'});
        $('select.short-ui').css({width: selectWidth + 'px'});
        $('.long-ui').css({width: (textWidth - 10) + 'px'});
        $('select.long-ui').css({width: textWidth + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeVisitorDetails = function() {
    if ($('#visitor-information-body').length > 0) {
        var visBodyheight = $('#visitor-information-body').height();
        var visBodyWidth = $('#visitor-information-body').width();
        var contentHeight = visBodyheight - 40;
        var upperFieldsetHeight = Math.max(Math.floor(contentHeight / 3), 120);
        var lowerFieldsetHeight = Math.max(contentHeight - upperFieldsetHeight - 49, 120);
        var inputHeight = Math.max(140, visBodyheight - 44);
        var scrollbarHeight = 0;
        $('.visitor-info-placeholder-content').css({height: contentHeight + 'px'});
        $('#visitor-comment-list').css({'min-height': upperFieldsetHeight + 'px'});
        $('#visitor-comment-text').css({'min-height': lowerFieldsetHeight + 'px'});
        $('#visitor-invitation-list').css({'min-height': (contentHeight - 22) + 'px'});
        $('#visitor-history-list').css({'min-height': (contentHeight - 22) + 'px'});
        $('#visitor-details-list').css({'min-height': (contentHeight - 22) + 'px'});
        $('#comment-text').css({'min-height': (visBodyheight - 22) + 'px'});
        $('#comment-input').css({width: (visBodyWidth - 28)+'px', height: inputHeight + 'px'});
        scrollbarHeight = (lzm_displayHelper.checkIfScrollbarVisible('visitor-info-placeholder-content-4', 'horizontal')) ?
            lzm_displayHelper.getScrollBarHeight() : 0;
        $('#matching-chats-inner').css({'min-height': (upperFieldsetHeight - 15 - scrollbarHeight) + 'px'});
        $('#chat-content-inner').css({'min-height': (lowerFieldsetHeight - 14) + 'px'});
        scrollbarHeight = (lzm_displayHelper.checkIfScrollbarVisible('visitor-info-placeholder-content-5', 'horizontal')) ?
            lzm_displayHelper.getScrollBarHeight() : 0;
        $('#matching-tickets-inner').css({'min-height': (upperFieldsetHeight - 15 - scrollbarHeight) + 'px'});
        $('#ticket-content-inner').css({'min-height': (lowerFieldsetHeight + 15) + 'px'});
        $('.browser-history-container').css({'min-height': (contentHeight - 75) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeVisitorInvitation = function() {
    if ($('#chat-invitation-body').length > 0) {
        var invTextHeight = Math.max((lzm_chatDisplay.dialogWindowHeight - 235), 100);
        var textWidth = lzm_chatDisplay.dialogWindowWidth - 39;
        if (lzm_displayHelper.checkIfScrollbarVisible('chat-invitation-body')) {
            textWidth -= lzm_displayHelper.getScrollBarWidth();
        }

        var thisInvitationTextCss = {width: textWidth+'px', height:  invTextHeight+'px'};
        var thisInvitationTextInnerCss = {width: textWidth+'px', height:  (invTextHeight - 20)+'px'};
        var thisTextInputCss = {width: textWidth+'px', height: (invTextHeight - 20)+'px'};
        var thisTextInputControlsCss;
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            thisTextInputControlsCss = {width: textWidth+'px', height: '15px'};
        }
        var thisTextInputBodyCss = {width: textWidth+'px', height: (invTextHeight - 50)+'px'};

        $('#user-invite-form').css({'min-height': ($('#chat-invitation-body').height() - 22) + 'px'});
        $('#invitation-text-div').css(thisInvitationTextCss);
        $('#invitation-text-inner').css(thisInvitationTextInnerCss);
        $('#invitation-text').css(thisTextInputCss);
        $('#invitation-text-controls').css(thisTextInputControlsCss);
        if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
            $('#invitation-text-body').css(thisTextInputBodyCss);
        }
        var langSelWidth = $('#language-selection').parent().width();
        var groupSelWidth = $('#group-selection').parent().width();
        var browserSelWidth = $('#browser-selection').parent().width();
        $('#language-selection').css({width: langSelWidth + 'px'});
        $('#group-selection').css({width: groupSelWidth + 'px'});
        $('#browser-selection').css({width: browserSelWidth + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeOperatorForwardSelection = function() {
    if ($('#operator-forward-selection-body').length > 0) {
        var fwdTextHeight = Math.max((lzm_chatDisplay.dialogWindowHeight - 195), 100);
        var selWidth = lzm_chatDisplay.dialogWindowWidth - 38;
        if (lzm_displayHelper.checkIfScrollbarVisible('operator-forward-selection')) {
            selWidth -= lzm_displayHelper.getScrollBarWidth();
        }
        $('#forward-text').css({width: selWidth + 'px', height: fwdTextHeight + 'px'});
        $('#fwd-container').css({'min-height':  ($('#operator-forward-selection-body').height() - 22) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeMessageForwardDialog = function() {
    if ($('#message-forward-placeholder').length > 0) {
        var contentHeigth = $('#ticket-details-body').height() - 40;
        $('.message-forward-placeholder-content').css({height: contentHeigth + 'px'});
        var inputMaxWidth = $('#message-forward-placeholder-content-0').width() - 18;
        if (lzm_displayHelper.checkIfScrollbarVisible('message-forward-placeholder-content-0')) {
            inputMaxWidth -= lzm_displayHelper.getScrollBarWidth();
        }
        var filesHeight = (!isNaN(parseInt($('#forward-files').height()))) ? $('#forward-files').height() + 45 : 0;
        var inputWidth = Math.min(500, inputMaxWidth);
        var textareaHeight = Math.max(100, $('#message-forward-placeholder-content-0').height() - 166 - filesHeight);
        $('#forward-email-addresses').css({width: inputWidth});
        $('#forward-subject').css({width: inputWidth});
        $('#forward-text').css({width: (inputMaxWidth - 12) + 'px', height: textareaHeight + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeArchivedChat = function() {
    if ($('#matching-chats-body').length > 0) {
        var myBodyHeight = $('#matching-chats-body').height();
        var listHeight = Math.max(200, Math.floor((myBodyHeight - 39) / 2));
        var contentHeight = myBodyHeight - listHeight - 44;
        var listScrollbarHeight = (lzm_displayHelper.checkIfScrollbarVisible('matching-chats-placeholder-content-0', 'horizontal')) ?
            lzm_displayHelper.getScrollBarHeight() : 0;
        $('.matching-chats-placeholder-content').css({'height': (myBodyHeight - 39) + 'px'});
        $('#matching-chats-inner').css({'min-height': (listHeight - 22 - listScrollbarHeight) + 'px'});
        $('#chat-content-inner').css({'min-height': (contentHeight - 22) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeFilterCreation = function() {
    var myHeight = $('#visitor-filter-body').height();
    var upperFieldsetHeight = 100;
    var lowerFieldsetHeight = myHeight - upperFieldsetHeight - 93;
    $('.visitor-filter-placeholder-content').css({height: (myHeight - 39) + 'px'});
    $('#visitor-filter-main').css({'min-height': upperFieldsetHeight + 'px'});
    $('#visitor-filter-base').css({'min-height': lowerFieldsetHeight + 'px'});
    $('#visitor-filter-reason').css({'min-height': (myHeight - 61) + 'px'});
    $('#visitor-filter-expiration').css({'min-height': (myHeight - 61) + 'px'});
};

ChatDisplayLayoutClass.prototype.resizeDynamicGroupDialogs = function() {
    if ($('#dynamic-group-body').length > 0) {
        var bodyHeight = $('#dynamic-group-body').height();
        var addNewGroupFormHeight = $('#add-new-group-form').height();
        var addPersistentMemberFormHeight = $('#add-persistent-member-form').height();
        var newGroupFormHeight = bodyHeight - 22;
        var addToGroupFormHeight = bodyHeight - addNewGroupFormHeight - addPersistentMemberFormHeight - 77;

        $('#new-group-form').css({'min-height': newGroupFormHeight + 'px'});
        $('#add-to-group-form').css({'min-height': addToGroupFormHeight + 'px'});
        $('#dynamic-group-table-div').css({'min-height': (addToGroupFormHeight - 34) + 'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeTranslateOptions = function() {
    if ($('#translate-options-body').length > 0) {
        var myHeight = $('#translate-options-body').height();
        var myWidth = $('#translate-options-body').width();
        $('.translate-options-placeholder-content').css({'height': (myHeight - 40)+'px'});
        $('#translate-my-messages').css({'min-height': (myHeight - 62)+'px'});
        $('#translate-visitor-messages').css({'min-height': (myHeight - 62)+'px'});
        $('.translation-language-select').css({'min-width': '0px', width: (myWidth - 50)+'px'});
    }
};

ChatDisplayLayoutClass.prototype.resizeGeotrackingMap = function() {
    if (lzm_chatDisplay.selected_view == 'world') {
        var myHeight = $('#geotracking').height();
        var myWidth = $('#geotracking').width();
        var iframeCss = {width: (myWidth + 60)+'px', height: (myHeight-41)+'px'};
        $('#geotracking-iframe').css(iframeCss);
    }
};

ChatDisplayLayoutClass.prototype.resizeChatView = function() {
    if ($('#no-open-chats-message').length > 0) {
        var myWidth = $('#chat-progress').width();
        var myHeight = $('#chat-progress').height();
        var textWidth = $('#no-open-chats-message').width();
        var textHeight = $('#no-open-chats-message').height();
        var textLeft = Math.round((myWidth - textWidth) / 2);
        var textTop = Math.round((myHeight - textHeight) / 2);
        var noOpenMessageCss = {left: textLeft+'px', top: textTop+'px'};

        $('#no-open-chats-message').css(noOpenMessageCss);
    }
};

ChatDisplayLayoutClass.prototype.resizeSingleStartPage = function() {
    if ($('#single-startpage-iframe').length > 0) {
        var myWidth = $('#startpage-body').width();
        var myHeight = $('#startpage-body').height();

        $('#single-startpage-iframe').css({width: (myWidth - 2)+'px', height: (myHeight - 4)+'px'});
    }
};
