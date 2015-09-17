/**
 * AddProfile view model
 */

var app = app || {};

app.AddProfile = (function () {
    'use strict'

    var AddProfileViewModel = (function () {
        
        var $newName;
        var $newDescription;
        var $newAge;
        var $newGender;
        //var validator;
        
        var init = function () {
            
            //validator = $('#enterProfile').kendoValidator().data('kendoValidator');
            $newName = $('#newName');
            $newDescription = $('#newDescription');
            $newAge = $('#newAge');
            $newGender = $('#newGender');

            $newDescription.on('keydown', app.helper.autoSizeTextarea);

        };
        
        var show = function () {
            
            // Clear field on view show
            $newName.val('');
            $newDescription.val('');
            $newAge.val('');
            $newGender.val('');
            //validator.hideMessages();
            $newDescription.prop('rows', 5);
        };
        
        var saveProfile = function () {
            
    
            // Adding new profile to Profiles model
            var profiles = app.Profiles.profiles;
            var profile = profiles.add();
            
            profile.Name = $newName.val();
            profile.Description = $newDescription.val();
            profile.Age = $newAge.val();
            profile.Gender = $newGender.val();
            profile.UserId = app.Users.currentUser.get('data').Id;
            profile.ActivityId = app.Activity.activity().Id;
            
            profiles.one('sync', function () {
                app.mobileApp.navigate('#:back');
            });
            
            profiles.sync();

        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveProfile: saveProfile
        };
        
    }());
    
    return AddProfileViewModel;
    
}());

