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
            $newDate = $('#newDate');
            $newStartTime = $('#newStartTime');
            $newEndTime = $('#newEndTime');
            $newSeats = $('#newSeats');
            $newCategory = $('#newCategory');
            
            $newDescription.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            // Clear field on view show
            $newText.val('');
            $newDescription.val('');
            $newCity.val('');
            $newDate.val(new Date());//todo: set todays date, fix picker
            $newStartTime.val('');
            $newEndTime.val('');
            $newSeats.val('');
            $newCategory.val(''); 
            
            validator.hideMessages();
            $newDescription.prop('rows', 5);
            navigator.geolocation.getCurrentPosition(
                onSuccessShowMap,
                onErrorShowMap
                );
        };
        function onSuccessShowMap(position) {
            var latlng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude);
   
            var mapOptions = {
                    
                sensor: true,
                center: latlng,
                panControl: false,
                zoomControl: true,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                mapTypeControl: true,
    
            };
            
            var map = new google.maps.Map(
                $('#map_canvas1'),
                mapOptions
                );
    
            var marker = new google.maps.Marker({
                                                    position: latlng,
                                                    map: map
                                                });
        
            console.log(marker);
            console.log("map rendering");
        };
        function onErrorShowMap(error) {
            alert("error");
        };
        
        var cancel = function() {
            app.mobileApp.navigate('#views/myActivitiesView.html', 'fade');
        };
        
        var saveActivity = function () {
            // Validating of the required fields
            if (validator.validate()) {
                // Adding new activity to Activities model
                var activity = app.Activities.activities.add();
                
                activity.Text = $newText.val();
                activity.Description = $newDescription.val();
                activity.City = $newCity.val();
                activity.ActivityDate = $newDate.val();
                activity.DayInWeek = $newDate.val();
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
            cancel: cancel
        };
    }());
    
    return addActivityViewModel;
}());