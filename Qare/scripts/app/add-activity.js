/**
 * AddActivity view model
 */

var app = app || {};

app.AddActivity = (function () {
    'use strict'

    var addActivityViewModel = (function () {
        var $newText;
        var $newDescription;
        var $newCity;
        var $newAddress;
        var $newZip;
        var $newDate;
        var $newStartTime;
        var $newEndTime;
        var $newSeats;
        var $newCategory;
        //TODO: Location
        var validator;
       
        
        var init = function () {
            validator = $('#addActivity').kendoValidator().data('kendoValidator');

            $newText = $('#newText');
            $newDescription = $('#newDescription');
            $newCity = $('#newCity');
            $newAddress = $('#newAddress');
            $newZip = $('#newZip');
            $newDate = $('#newDate');
            $newStartTime = $('#newStartTime');
            $newEndTime = $('#newEndTime');
            $newSeats = $('#newSeats');
            $newCategory = $('#newCategory');
            console.log($newDate.val());            
            $newDescription.on('keydown', app.helper.autoSizeTextarea);
            
            
        };
        
        var show = function () {
            // Clear field on view show
            $newText.val('');
            $newDescription.val('');
            $newCity.val('');
            $newAddress.val('');
            $newZip.val('');
            console.log($newDate.val());
         //   $newDate.val(new Date());//todo: set todays date, fix picker
            $newStartTime.val('');
            $newEndTime.val('');
            $newSeats.val('');
            $newCategory.val(''); 
            
            validator.hideMessages();
            $newDescription.prop('rows', 5);
            
        };
        
        
        var cancel = function() {
            app.mobileApp.navigate('#views/myActivitiesView.html', 'fade');
        };
        var location = function(){
             app.mobileApp.navigate('#views/kendoMapView.html?city='+$newCity.val()+'&address='+$newAddress.val(), 'fade');
        }
        
        var saveActivity = function () {
            // Validating of the required fields
            if (validator.validate()) {
                // Adding new activity to Activities model
                var activity = app.Activities.activities.add();
                
                activity.Text = $newText.val();
                activity.Description = $newDescription.val();
                activity.City = $newCity.val();
                activity.Address = $newAddress.val();
                activity.PostalCode = $newZip.val();
                console.log($newDate.val());
                activity.ActivityDate = $newDate.val();
                
                var dateObj = new Date(activity.ActivityDate);
                var day = dateObj.getDay();
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
				var date = dateObj.getUTCDate();
				var year = dateObj.getUTCFullYear();
                activity.ActivityDate = new Date(year, month, date, $newStartTime.val(), 0, 0, 0);
                
                if(day == 1)
                activity.DayInWeek = "monday";
                else if(day == 2)
                activity.DayInWeek = "tuesday";
                else if(day == 3)
                activity.DayInWeek = "wednesday";
                else if(day == 4)
                activity.DayInWeek = "thursday";
                else if(day == 5)
                activity.DayInWeek = "friday";
                else if(day == 6)
                activity.DayInWeek = "saturday";
                else 
                activity.DayInWeek = "sunday";
                //activity.DayInWeek = new Date($newDate.val()).getDay();
                //activity.DateActivity = $newDate.val();
                activity.ActivityStartTime = $newStartTime.val();
                activity.ActivityEndTime = $newEndTime.val();
                activity.Seats = $newSeats.val();
                activity.Category = $newCategory.val();
                activity.Status = 'Toegevoegd';

                activity.UserId = app.Users.currentUser.get('data').Id;
                
                var activityProvider = app.everlive.data('Activities');
                var activities = app.Activities.activities;

                activities.one('sync', function () {
                    app.showAlert("Activiteit is aangemaakt.");
                    // app.Activities();
                    //app.mobileApp.navigate('#:back');
                    app.mobileApp.navigate('views/myActivitiesView.html');
                });
                
                activities.sync();
                //app.Activities.activities.refresh();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            save: saveActivity,
            cancel: cancel,
            location: location
        };
    }());
    
    return addActivityViewModel;
}());