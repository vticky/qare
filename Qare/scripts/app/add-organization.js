/**
 * AddActivity view model
 */

var app = app || {};

app.AddOrganization = (function () {
    'use strict'

    var AddOrganizationViewModel = (function () {
        
        var $newOrganizationName;
        var $newOrganizationDescription;
        //var validator;
        
        var init = function () {
            
            //validator = $('#enterOrganization').kendoValidator().data('kendoValidator');
            $newOrganizationName = $('#newOrganizationName');
            $newOrganizationDescription = $('#newOrganizationDescription');

            $newOrganizationName.on('keydown', app.helper.autoSizeTextarea);
            $newOrganizationDescription.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            
            // Clear field on view show
            $newOrganizationName.val('');
            $newOrganizationDescription.val('');
            //validator.hideMessages();
            $newOrganizationDescription.prop('rows', 1);
        };
        
        var saveOrganization = function () {
            
    
            // Adding new organization to Organisations model
            var organisations = app.Organisations.organisations;
            var organization = organisations.add();
            
            organization.Name = $newOrganizationName.val();
            organization.Description = $newOrganizationDescription.val();
            organization.UserId = app.Users.currentUser.get('data').Id;
            organization.ActivityId = app.Activity.activity().Id;
            
            organisations.one('sync', function () {
                app.mobileApp.navigate('#:back');
            });
            
            organisations.sync();

        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveOrganization: saveOrganization
        };
        
    }());
    
    return AddOrganizationViewModel;
    
}());