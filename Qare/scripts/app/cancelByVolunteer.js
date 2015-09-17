/**
 * AddActivity view model
 */

var app = app || {};

app.CancelByVolunteer = (function () {
    'use strict'

    var cancelByVolunteerViewModel = (function () {
        
        var $newDescription;
        
        var init = function () {
            $newDescription = $('#newDescription');
            $newDescription.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            
            // Clear field on view show
            $newDescription.val('');
            $newDescription.prop('rows', 5);
        };
        
        var cancelActivity = function () {
            
          
                
                // Adding new activity to Activities model
                var activities = app.Activities.activities;
                var activity = activities.cancel();
                
                activity.Description = $newDescription.val();
                activity.Status = 'Toegevoegd';

                
                app.showAlert("Activiteit is canceled.");
                
                activities.one('sync', function () {
                    //app.mobileApp.navigate('#:back');
                    app.mobileApp.navigate('views/myActivitiesView.html');
                });
                
                activities.sync();

        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            cancelActivity: cancelActivity
        };
        
    }());
    
    return cancelByVolunteerViewModel;
    
}());
