/****************************************************************************************
 * LiveZilla CommonDialogClass.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function CommonDialogClass() {
    this.alertDialogWidth = 0;
    this.alertDialogHeight = 0;
}

CommonDialogClass.prototype.createAlertDialog = function(errorMessage, buttons) {
    var dialogHtml = '<div class="lzm-alert-dialog-container" id="lzm-alert-dialog-container">';
    var dialogInnerHtml = '<div class="lzm-alert-dialog" id="lzm-alert-dialog">' +
        '<div style="background-color: #c9c9c9; padding: 6px 8px;; font-size: 13px; font-weight: bold;">' + t('Message') + '</div>' +
        '<div style="margin: 17px 13px;">' + errorMessage + '</div>' +
        '<div style="margin: 17px 13px; text-align: right;">';
    for (var i=0; i<buttons.length; i++) {
        dialogInnerHtml += '<span class="alert-button" id="alert-btn-' + buttons[i].id + '" data-id="' + buttons[i].id + '">' + buttons[i].name + '</span>';
    }
    dialogInnerHtml += '</div>' +
        '</div>';
    dialogHtml += dialogInnerHtml + '</div>';
    $('body').append('<div id="dialog-test-size-div" style="position: absolute; left: -2000px; top: -2000px; width: 1800px; height: 1800px;"></div>').trigger('create');
    $('#dialog-test-size-div').html(dialogInnerHtml.replace(/id="lzm-alert/, 'id="test-lzm-alert').replace(/id="alert-btn-/, 'id="test-alert-btn-')).trigger('create');
    this.alertDialogWidth = Math.min(Math.round($(window).width() * 0.9), 300);
    $('#test-lzm-alert-dialog').css({width: this.alertDialogWidth+'px'});
    this.alertDialogHeight = $('#test-lzm-alert-dialog').height();
    $('#dialog-test-size-div').remove();

    $('body').append(dialogHtml).trigger('create');
    this.resizeAlertDialog();
};

CommonDialogClass.prototype.removeAlertDialog = function() {
    $('#lzm-alert-dialog-container').remove();
};

CommonDialogClass.prototype.resizeAlertDialog = function() {
    if ($('#lzm-alert-dialog-container').length > 0) {
        var windowWidth = $(window).width(), windowHeight = $(window).height();
        var dialogLeft = Math.round(0.5 * (windowWidth - this.alertDialogWidth));
        var dialogTop = Math.round(0.5 * (windowHeight - this.alertDialogHeight));
        var myContainerCss = {width: windowWidth+'px', height: windowHeight+'px'};
        var myCss = {left: dialogLeft+'px', top: dialogTop+'px', width: this.alertDialogWidth+'px', height: this.alertDialogHeight+'px'};
        $('#lzm-alert-dialog-container').css(myContainerCss);
        $('#lzm-alert-dialog').css(myCss);
    }
};
