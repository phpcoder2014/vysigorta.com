/****************************************************************************************
 * LiveZilla CommonTranslationClass.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

/**
 *
 * @constructor
 */
function CommonTranslationClass(protocol, url, mobileDir, runningFromApp, language) {
    this.translationArray = [];
    this.manageTranslationArray = [];
    this.protocol = protocol;
    this.url = url;
    this.mobileDir = mobileDir;
    this.availableLanguages = [];
    this.language = 'en';
    if (typeof language != 'undefined' && language != 'undefined' && language != '') {
        this.language = language
    } else if (typeof navigator.language != 'undefined') {
        this.language = navigator.language;
    } else if (typeof navigator.userLanguage != 'undefined') {
        this.language = navigator.userLanguage;
    }
    if (this.language.indexOf('-') != -1) {
        this.language = this.language.split('-')[0];
    } else if (this.language.indexOf('_') != -1) {
        this.language = this.language.split('_')[0];
    }
    this.fillTranslationArray(runningFromApp, this.language, 'default');
}

CommonTranslationClass.prototype.translate = function(translateString, placeholderArray) {
    var translatedString = translateString;
    var notInArray = true;
    for (var stringIndex=0; stringIndex<this.translationArray.length; stringIndex++) {
        if (this.translationArray[stringIndex]['orig'] == translateString) {
            if (this.translationArray[stringIndex][this.language] != null)
                translatedString =  this.translationArray[stringIndex][this.language];
            notInArray = false;
            break;
        }
    }

    if (typeof placeholderArray != 'undefined') {
        for (var i=0; i<placeholderArray.length; i++) {
            translatedString = this.stringReplace(translatedString, placeholderArray[i][0], placeholderArray[i][1]);
        }
    }

    return translatedString;
};

CommonTranslationClass.prototype.stringReplace = function(myString, placeholder, replacement) {
    return myString.replace(placeholder, replacement);
} ;

CommonTranslationClass.prototype.fillTranslationArray = function(fromApp, language, type) {
    var thisClass = this;
    if (typeof language == 'undefined' || language == '') {
        language = thisClass.language;
    }

    if (!fromApp) {
        var url = (thisClass.url.indexOf('#') != -1) ? thisClass.url.split('#')[0] : thisClass.url;
    $.ajax({
        type: "GET",
        url: thisClass.protocol + url + '/' + thisClass.mobileDir + '/php/translation/index.php',
        data: {
            g_language: language
        },
        success: function (data) {
            if (typeof type == 'undefined' || type != 'manage') {
                thisClass.translationArray = JSON.parse(lz_global_base64_decode(data));
            } else {
                thisClass.manageTranslationArray = JSON.parse(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            try {
                logit('Status-Text : ' + textStatus);
                logit(jqXHR);
                logit('Error-Text : ' + errorThrown);
            } catch(e) {}
        },
        dataType: 'text'
    });
    } else {
        thisClass.translationArray = [
            {"orig":"No profile selected","de":"Kein Profil ausgewählt"},
            {"orig":"Profiles","de":"Profile"},
            {"orig":"New profile","de":"Profil anlegen"},
            {"orig":"Edit profile","de":"Profil ändern"},
            {"orig":"Delete profile","de":"Profil löschen"},
            {"orig":"Profile Name:","de":"Profilname:"},
            {"orig":"Server Profiles","de":"Server-Profile"},
            {"orig":"Server Protocol","de":"Server-Protokoll"},
            {"orig":"Server Url:","de":"Server-Url:"},
            {"orig":"Mobile Directory:","de":"Mobil-Verzeichnis:"},
            {"orig":"Server version","de":"Server-Version"},
            {"orig":"Port","de":"Port"},
            {"orig":"Delete this server profile?","de":"Dieses Server-Profil löschen?"},
            {"orig":"Save this new profile?","de":"Das neue Profil speichern?"},
            {"orig":"Save changes?","de":"Änderungen speichern?"},
            {"orig":"Leave profile configuration?","de":"Die Profil-Einstellungen verlassen?"},
            {"orig":"This will discard unsaved configuration changes.","de":"Dies verwirft ungesicherte Änderungen."},
            {"orig":"Username","de":"Anmeldename"},
            {"orig":"Password","de":"Passwort"},
            {"orig":"Username:","de":"Anmeldename:"},
            {"orig":"Password:","de":"Passwort:"},
            {"orig":"Save login data","de":"Anmelde-Daten speichern"},
            {"orig":"Log in","de":"Anmelden"},
            {"orig":"Back","de":"Zurück"},
            {"orig":"available","de":"verfügbar"},
            {"orig":"busy","de":"beschäftigt"},
            {"orig":"offline","de":"abgemeldet"},
            {"orig":"away","de":"abwesend"},
            {"orig":"Save profile","de":"Profil speichern"},
            {"orig":"The server did not respond for more then <!--number_of_seconds--> seconds.","de":"Der Server antwortet nicht seit mehr als <!--number_of_seconds--> Sekunden."},
            {"orig":"The server returned an error","de":"Der Server gab eine Fehlermeldung zurück"},
            {"orig":"Error code : <!--http_error-->","de":"Fehler-Code: <!--http_error-->"},
            {"orig":"Error text : <!--http_error_text-->","de":"Fehler-Text: <!--http_error_text-->"},
            {"orig":"The operator <!--op_login_name--> is already logged in.","de":"Der Operator <!--op_login_name--> ist bereits angemeldet."},
            {"orig":"Wrong username or password.","de":"Benutzername oder Passwort falsch."},
            {"orig":"Do you want to log off the other instance?","de":"Möchten Sie sich trotzdem anmelden und den anderen Benutzer abmelden?"},
            {"orig":"This server requires secure connection (SSL). Please activate HTTPS in the server profile and try again.","de":"Dieser Server erlaubt keine unverschlüsselten Verbindungen. Bitte aktivieren Sie SSL (HTTPS) im Serverprofil."},
            {"orig":"Session timed out.","de":"Die Session ist abgelaufen."},
            {"orig":"You've been logged off by another operator!", "de":"Sie wurden durch einen anderen Operator abgemeldet."},
            {"orig":"You have to change your password.","de":"Sie müssen Ihr Passwort ändern."},
            {"orig":"You are not an administrator.","de":"Sie sind kein Administrator."},
            {"orig":"This LiveZilla server has been deactivated by the administrator.","de":"Dieser LiveZilla-Server wurde vom Administrator deaktiviert."},
            {"orig":"If you are the administrator, please activate this server under LiveZilla Server Admin -> Server Configuration -> Server.","de":"Wenn Sie der Administrator sind, aktivieren Sie diesen Server bitte unter LiveZilla Server Admin -> Server Konfiguration -> Server."},
            {"orig":"There are problems with the database connection.","de":"Es bestehen Probleme mit der Datenbank-Verbindung."},
            {"orig":"Available","de":"Verfügbar"},
            {"orig":"Busy","de":"Beschäftigt"},
            {"orig":"Away","de":"Abwesend"},
            {"orig":"Cancel","de":"Abbrechen"},
            {"orig":"Cannot connect to the LiveZilla Server. The target URI seems to be wrong or your network is down.","de":"Der LiveZilla-Server konnte nicht erreicht werden, die Ziel-URL ist falsch oder Ihr Netzwerk ist inaktiv."},
            {"orig":"Please check / validate the URI (Server Profile)","de":"WICHTIG: Überprüfen Sie die URL (Server-Profile)"},
            {"orig":"Further information","de":"Weitere Informationen"},
            {"orig":"The remote server has returned an error: (<!--http_error-->) <!--http_error_text-->","de":"Der Remoteserver hat einen Fehler zurückgegeben: (<!--http_error-->) <!--http_error_text-->"},
            {"orig":"You need at least LiveZilla server version <!--config_version--> to run this app.","de":"Sie benötigen den LiveZilla-Server mindestens in Version <!--config_version-->, um diese App zu nutzen."},
            {"orig":"The server response had an invalid structure.","de":"Der Server lieferte eine ungültige Antwort."},
            {"orig":"Either the server URL is wrong (presumably) or the server is not working properly.","de":"Entweder ist die URL des Servers nicht korrekt oder der Server antwortet nicht ordnungsgemäß."},
            {"orig":"An error occured while loading the web application.","de":"Beim Laden der Web-Anwendung ist ein Fehler aufgetreten."},
            {"orig":"Check your server and the connection of your mobile device.","de":"Überprüfen Sie Ihren Server und die Netzwerkverbindung Ihres Mobilgerätes."},
            {"orig":"Loading the web application timed out.","de":"Das Laden der Web-Anwendung benötigte zu lange."},
            {"orig":"Autologin", "de":"Bei jedem Start anmelden"},
            {"orig": "<!--limit1--> <!--limit2--> <!--limit3--> <!--limit4-->", "de": "<!--limit1--> <!--limit2--> <!--limit3--> <!--limit4-->"},
            {"orig": "No operator licences are available or all operator licences are in use.", "de": "Ihre Lizenzierung erlaubt keine weiteren Anmeldungen."},
            {"orig": "Any new connections are denied until a licence becomes available.", "de": "Es sind keine Plätze verfügbar oder alle verfügbaren Plätze sind belegt."},
            {"orig": "In order to add additional operator seats, please purchase the according amount of operator licences.", "de": "Um weitere Operatoren anzumelden, müssen Sie weitere Lizenzen erwerben oder in der Server-Konfiguration hinterlegen."},
            {"orig": "Thanks for your understanding.", "de": "Vielen Dank für Ihr Verständnis."},
            {"orig": "Buy PRO License", "de": "PRO Lizenz kaufen"}
        ];
    }
};

CommonTranslationClass.prototype.listAvailableLanguages = function() {
    var thisClass = this;
    $.ajax({
        type: "GET",
        url: thisClass.protocol + thisClass.url + '/' + thisClass.mobileDir + '/php/translation/index.php',
        data: {
            g_available: 'list'
        },
        success: function (data) {
            thisClass.availableLanguages = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            try {
                logit('Status-Text : ' + textStatus);
                logit(jqXHR);
                logit('Error-Text : ' + errorThrown);
            } catch(e) {}
        },
        dataType: 'json'
    });
};

CommonTranslationClass.prototype.saveTranslations = function(language,stringObjects) {
    var thisClass = this;
    $.ajax({
        type: "POST",
        url: thisClass.protocol + thisClass.url + '/' + thisClass.mobileDir + '/php/translation/index.php',
        data: {
            p_language: language,
            p_translations: JSON.stringify(stringObjects)
        },
        success: function (data) {
            if (data)
                thisClass.fillTranslationArray(false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            try {
                logit('Status-Text : ' + textStatus);
                logit(jqXHR);
                logit('Error-Text : ' + errorThrown);
            } catch(e) {}
        },
        dataType: 'text'
    });
};