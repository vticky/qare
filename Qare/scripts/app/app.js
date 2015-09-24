function onPushNotificationReceived(e) {
    //alert(JSON.stringify(e));
}
//kendo.culture("nl-NL");

var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, "Informatie", 'OK');
    };

    var showError = function(message) {
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function(message, title, callback) {
        navigator.notification.confirm(message, callback || function () {
        }, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    // Handle device back button tap
    var onBackKeyDown = function(e) {
        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                // Stop EQATEC analytics monitor on app exit
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', ['OK', 'Cancel']);
    };

    var onDeviceReady = function() {
        
        
        //START -- to enable PushPlugin
        var everliveOptions = {
                              apiKey: appSettings.everlive.apiKey,
                              scheme: appSettings.everlive.scheme
                          };
        
         // Initialize Everlive SDK
    	var el = new Everlive(everliveOptions);
        //TODO check this (Tijana)
       /* var devicePushSettings = {
                iOS: {
                    badge: 'true',
                    sound: 'true',
                    alert: 'true'
                },
                android: {
                    projectNumber: 'YOUR_GOOGLE_API_PROJECT_NUMBER'
                },
                wp8: {
                    channelName: 'EverlivePushChannel'
                },
                notificationCallbackIOS: onPushNotificationReceived,
                notificationCallbackAndroid: onPushNotificationReceived,
                notificationCallbackWP8: onPushNotificationReceived
            };*/
        
       /* el.push.register(devicePushSettings, function() {
                //alert("Successful registration in Backend Services. You are ready to receive push notifications.");
            }, function(err) {
                //alert("Error: " + err.message);
            });   */
        
        //END -- to enable PushPlugin
        
        // Handle "backbutton" event
        //document.addEventListener('backbutton', onBackKeyDown, false);

        //navigator.splashscreen.hide();

        if (analytics.isAnalytics()) {
            analytics.Start();
        }
        
        // Initialize AppFeedback
        if (app.isKeySet(appSettings.feedback.apiKey)) {
            try {
                feedback.initialize(appSettings.feedback.apiKey, appSettings.feedback.options);
            } catch (err) {
                console.log('Something went wrong:');
                console.log(err);
            }
        } else {
            console.log('Telerik AppFeedback API key is not set. You cannot use feedback service.');
        }
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    var everliveOptions = {
                              apiKey: appSettings.everlive.apiKey,
                              scheme: appSettings.everlive.scheme
                          };

    if(appSettings.everlive.url){
        everliveOptions.url = appSettings.everlive.url;
    }

    // Initialize Everlive SDK
    var el = new Everlive(everliveOptions);

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var AppHelper = {

        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/qare-logo_360.png';
            }
        },

        // Return current activity picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/qare-logo_360.png';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            //return kendo.toString(new Date(dateString), 'MMM d, yyyy');
            return kendo.toString(new Date(dateString), 'd-MMM-yyyy');
        },
                // Current user logout
        logout: function () {
            return el.Users.logout();
        },

        autoSizeTextarea: function () {
            var rows = $(this).val().split('\n');
            $(this).prop('rows', rows.length + 1);
        }
    };

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
                                                     transition: 'slide',
                                                     statusBarStyle: statusBarStyle,
                                                     skin: 'flat'
                                                 });

    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        everlive: el
    };
}(window));
