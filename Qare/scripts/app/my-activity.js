/**
 * Activity view model
 */

var app = app || {};

app.statusBtn = (function () {
    
    var currentUserId = app.Users.currentUser.data.Id;
    var createdById = $("#activity-createdby").val();
    var activityStatus = $("#activity-status").text();
    var activityCategory = $("#activity-category-span").val();
    var activityBorderZorg = $(".activity-category-border-Zorg");
    var activityBorderGezelschap = $(".activity-category-border-Gezelschap"); 
    var activityBorderHuishoudelijk = $(".activity-category-border-Huishoudelijk"); 
    var activityBorderHuisdieren = $(".activity-category-border-Huisdieren");
    
    
    $("#activity-btn-requested").hide();
    $("#activity-btn-book").hide();
    $("#activity-btn-confirmed").hide();
    $("#activity-status-requested").hide();
    $("#activity-status-book").hide();
    $("#activity-status-confirmed").hide();        
    
    //Show buttons based upon Current User
    if (currentUserId === createdById){	
        if (activityStatus === "Toegevoegd"){
            $("#activity-btn-book").hide();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").hide();
            $("#activity-btn-delete").show();
        } 
        else if (activityStatus === "Aangevraagd"){
            $("#activity-btn-requested").show();
            $("#activity-btn-cancel").show(); 
            $("#activity-btn-book").hide();
        }
        else if (activityStatus === "Bevestigd"){
            $("#activity-btn-book").hide();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").show();
        }
        else
        {
            $("#activity-btn-book").hide();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").hide();
        }
    }
    else
    {
        $(".activity-btn-delete").hide();
        //Show buttons based upon Activity Status
        if (activityStatus === "Toegevoegd"){
            $("#activity-btn-book").show();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").hide();
        }if (activityStatus === "Aangevraagd"){
            $("#activity-btn-book").hide();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").show();
            //show cancel
        }if (activityStatus === "Bevestigd"){
            $("#activity-btn-book").hide();
            $("#activity-btn-requested").hide();
            $("#activity-btn-cancel").show(); 
            //show cancel
        }
    }
    //Line style based upon Category
    if (activityCategory === "Zorg"){
        
        activityBorderZorg.show();
        activityBorderGezelschap.hide();
        activityBorderHuisdieren.hide();
        activityBorderHuishoudelijk.hide();
        
    }if (activityCategory === "Gezelschap"){
        
        activityBorderZorg.hide();
        activityBorderGezelschap.show();
        activityBorderHuisdieren.hide();
        activityBorderHuishoudelijk.hide();
        
    }if (activityCategory === "Huisdieren"){
        
        activityBorderZorg.hide();
        activityBorderGezelschap.hide();
        activityBorderHuisdieren.show();
        activityBorderHuishoudelijk.hide();
        
    }if (activityCategory === "Huishoudelijk"){
        
        activityBorderZorg.hide();
        activityBorderGezelschap.hide();
        activityBorderHuisdieren.hide();
        activityBorderHuishoudelijk.show();
    }   

    SetMenu();        
});

app.Activity = (function () {
        
    $("#activity-btn-requested").hide();
    $("#activity-btn-book").hide();
    $("#activity-btn-confirmed").hide();
    $("#activity-status-requested").hide();
    $("#activity-status-book").hide();
    $("#activity-status-confirmed").hide();
    
    
    'use strict'
    
    var $commentsContainer
    var $organisationsContainer
    var $profilesContainer
    var $activityContainer
    var $reviewsContainer,
        listScroller;
    
    var activityViewModel = (function () {
        
        var activityUid,
            activity,
            $activityPicture;
        
         // Navigate to profilePersonView When some activity is selected
        var profileSelected = function (e) {
            app.mobileApp.navigate('views/profilePersonView.html?uid=' + e.data.uid);
        };
        
    
        var init = function () {
            $commentsContainer = $('#comments-listview');
            $organisationsContainer = $('#organisations-listview');
            $activityContainer = $('#activities-listview');
            $profilesContainer = $('#profiles-listview');
            $reviewsContainer = $('#reviews-listview');
            $activityPicture = $('#picture');
        };
        
        var show = function (e) {
            
            $commentsContainer.empty();
            $organisationsContainer.empty();
            $profilesContainer.empty();
            $activityContainer.empty();
            $reviewsContainer.empty();
            
            listScroller = e.view.scroller;
            listScroller.reset();
            
            activityUid = e.view.params.uid;
            console.log(activityUid);
            // Get current activity (based on item uid) from Activities model
            activity = app.Activities.activities.getByUid(activityUid);
            console.log(activity);
            $activityPicture[0].style.display = activity.Picture ? 'block' : 'block';
			
             var currentUserType = app.Users.currentUser.data.UserType;
    
            if (currentUserType === "Vrijwilliger"){
                $("#volunteer-activities").show();    
                $("#volunteer-bookings").show();
                $("#volunteer-favorites").show();
                $("#provider-myprofile").show();
            }
            else if (currentUserType === "Aanbieder"){
                $("#provider-activities").show();
                $("#provider-bookings").show();
                $("#provider-profiles").show();
                $("#provider-myprofile").show();
            } 
            else {
                $("#volunteer-activities").show();
                $("#volunteer-bookings").show();
                $("#volunteer-favorites").show();
                $("#provider-myprofile").show();
            }
   
    
            app.Activities.activities.filter({
                field: 'Id',
                operator: 'eq',
                value: activity.Id
            });

            app.Comments.comments.filter({
                field: 'ActivityId',
                operator: 'eq',
                value: activity.Id
            });
            app.Organisations.organisations.filter({
                field: 'ActivityId',
                operator: 'eq',
                value: activity.Id
            });
            app.Profiles.profiles.filter({
                field: 'ActivityId',
                operator: 'eq',
                value: activity.Id
            });
            app.Reviews.reviews.filter({
                field: 'ActivityId',
                operator: 'eq',
                value: activity.Id
            });
            
            
            kendo.bind(e.view.element, activity, kendo.mobile.ui);
        };
        
        var bookActivity = function () {
             
            var activityProvider = app.everlive.data('Activities');
            var activities = app.Activities.activities;
            var activityId = $("#activity-id").html();

            var attrs = {

                Id: activityId,
                Status: 'Aangevraagd',
                UserId:  app.Users.currentUser.data.Id,

            };

            activityProvider.updateSingle(attrs,
                function(data) {

                    alert("Activiteit is in behandeling!.");
                	//alert(JSON.stringify(data));
                	// Send e-mail - Push Mail
                 	//app.mobileApp.navigate('#:back');
                	app.mobileApp.navigate('views/bookingsView.html');

                },
                function(error) {
                    alert(JSON.stringify(error));
                });
        };
        
        var cancelActivity = function () {
             
            var activityProvider = app.everlive.data('Activities');
            var activities = app.Activities.activities;
            var activityId = $("#activity-id").html();
            var attrs = {

                Id: activityId,
                Status: 'Toegevoegd',
                UserId:  app.Users.currentUser.data.Id,

            };

            activityProvider.updateSingle(attrs,
                function(data) {

                    alert("Activiteit is geweigerd.");
                	//alert(JSON.stringify(data));
                    
                    // PUSH NOTIFICATION
                    var el = app.everlive;

                    var activityId = $("#activity-title").html();

                    var notification = {
                        "Android": {
                            "data": {
                                "title": "QARE (Android)",
                                "message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!",
                                "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                            }
                        },
                        "IOS": {
                            "aps": {
                                "alert": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!",
                                "badge": 1,
                                "sound": "default",
                                "category": "QARE"
                            },
                            "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                        },
                        "WindowsPhone": {
                            "Toast": {
                                "Title": "QARE (Windows)",
                                "Message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                            }
                        },
                        "Windows": {
                            "Toast": {
                                "template": "ToastText01",
                                "text": ["Push message for Windows 8+"]
                            }
                        }
                    };

                    el.push.notifications.create(notification,
                        function (data) {
                        //app.showAlert(JSON.stringify(data));
                    },
                    function (error) {
                        //app.alert(JSON.stringify(error));
            	    });
                 	//app.mobileApp.navigate('#:back');
                	app.mobileApp.navigate('views/bookingsView.html');

                },
                function(error) {
                    alert(JSON.stringify(error));
                });
        };
        
        var declineActivity = function () {
             
            var activityProvider = app.everlive.data('Activities');
            var activities = app.Activities.activities;
            var activityId = $("#activity-id").html();
            var attrs = {

                Id: activityId,
                Status: 'Toegevoegd',
                UserId:  app.Users.currentUser.data.Id,

            };

            activityProvider.updateSingle(attrs,
                function(data) {

                    app.showAlert("Activiteit is geweigerd.");
                	//alert(JSON.stringify(data));
                    
                    // PUSH NOTIFICATION
                    var el = app.everlive;

                    var activityId = $("#activity-title").html();

                    var notification = {
                        "Android": {
                            "data": {
                                "title": "QARE (Android)",
                                "message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!",
                                "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                            }
                        },
                        "IOS": {
                            "aps": {
                                "alert": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!",
                                "badge": 1,
                                "sound": "default",
                                "category": "QARE"
                            },
                            "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                        },
                        "WindowsPhone": {
                            "Toast": {
                                "Title": "QARE (Windows)",
                                "Message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is geweigerd!"
                            }
                        },
                        "Windows": {
                            "Toast": {
                                "template": "ToastText01",
                                "text": ["Push message for Windows 8+"]
                            }
                        }
                    };

                    el.push.notifications.create(notification,
                        function (data) {
                        //app.showAlert(JSON.stringify(data));
                    },
                    function (error) {
                        //app.alert(JSON.stringify(error));
            	});
                 	app.mobileApp.navigate('#:back');                

                },
                function(error) {
                    alert(JSON.stringify(error));
                });
        };
        
        var pushTest = function () {

			var el = app.everlive;

            var activityId = $("#activity-title").html();

            var notification = {
                "Android": {
                    "data": {
                        "title": "QARE (Android)",
                        "message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!",
                        "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                    }
                },
                "IOS": {
                    "aps": {
                        "alert": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!",
                        "badge": 1,
                        "sound": "default",
                        "category": "QARE"
                    },
                    "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                },
                "WindowsPhone": {
                    "Toast": {
                        "Title": "QARE (Windows)",
                        "Message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                    }
                },
                "Windows": {
                    "Toast": {
                        "template": "ToastText01",
                        "text": ["Push message for Windows 8+"]
                    }
                }
            };

            el.push.notifications.create(notification,
            	function (data) {
                //app.showAlert(JSON.stringify(data));
            },
            function (error) {
                //app.alert(JSON.stringify(error));
            });
        };
        
        var acceptActivity = function () {
             
            var activityProvider = app.everlive.data('Activities');
            var activities = app.Activities.activities;
            var activityId = $("#activity-id").html();
            var attrs = {

                Id: activityId,
                Status: 'Bevestigd'
              //  UserId:  app.Users.currentUser.data.Id,

            };

            activityProvider.updateSingle(attrs,
                function(data) {

                    app.showAlert("Activiteit bevestigd!")
                	//alert(JSON.stringify(data));
                    
                    // PUSH NOTIFICATION
                    var el = app.everlive;

                    var activityId = $("#activity-title").html();

                    var notification = {
                        "Android": {
                            "data": {
                                "title": "QARE (Android)",
                                "message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!",
                                "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                            }
                        },
                        "IOS": {
                            "aps": {
                                "alert": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!",
                                "badge": 1,
                                "sound": "default",
                                "category": "QARE"
                            },
                            "customData": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                        },
                        "WindowsPhone": {
                            "Toast": {
                                "Title": "QARE (Windows)",
                                "Message": "Activiteit" + " " + "'" + activityId + "'" + " " + "is bevestigd!"
                            }
                        },
                        "Windows": {
                            "Toast": {
                                "template": "ToastText01",
                                "text": ["Push message for Windows 8+"]
                            }
                        }
                    };

                    el.push.notifications.create(notification,
                        function (data) {
                        //app.showAlert(JSON.stringify(data));
                    },
                    function (error) {
                        //app.alert(JSON.stringify(error));
            	});
                 	//app.mobileApp.navigate('#:back');
                	app.mobileApp.navigate('views/bookingsView.html');

                },
                function(error) {
                    alert(JSON.stringify(error));
                });
        };        
        
        var removeActivity = function () {
            
            var activities = app.Activities.activities;
            var activity = activities.getByUid(activityUid);
            
            app.showConfirm(
                appSettings.messages.removeActivityConfirm,
                'Verwijder Activiteit',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        
                        activities.remove(activity);
                        activities.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        activities.sync();
                    }
                }
            );
        };
        
        return {
            init: init,
            show: show,
            remove: removeActivity,
            book: bookActivity,
            confirm: acceptActivity,
            decline: declineActivity,
            cancel:cancelActivity,
            push: pushTest,
            profileSelected: profileSelected,
            activityId: function(){
                return activityUid;
            },
            activity: function () {
                return activity;
            }
        };
        
    }());
    
    return activityViewModel;
    
}());
function SetMenu()
{
    var currentUserType = app.Users.currentUser.data.UserType;
    
    if (currentUserType === "Vrijwilliger"){

        $("#volunteer-activities").show();
        $("#volunteer-bookings").show();
        $("#volunteer-favorites").show();
        $("#provider-myprofile").show();
        $("#volunteer-favorites").show();
    } else if (currentUserType === "Aanbieder"){
        
        $("#provider-activities").show();
        $("#provider-bookings").show();
        $("#provider-profiles").show();
        $("#provider-myprofile").show();
        $("#volunteer-favorites").hide();
    } else {
        
        $("#volunteer-activities").show();
        $("#volunteer-bookings").show();
        $("#volunteer-favorites").show();
        $("#provider-myprofile").show();
        
    }
}
