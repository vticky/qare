/**
 * Profiles view model
 */

var app = app || {};

app.myProfilesAfterShow = (function () {
    
    app.Profiles.profiles.filter(
        [{field: "CreatedBy", operator: "eq", value: app.Users.currentUser.data.Id}])
   
});

app.Profiles = (function () {
    'use strict'
    
    // Profiles model
    var profilesViewModel = (function () {
        
        var profileModel = {
            
            id: 'Id',
            fields: {
                Name: {
                    field: 'Name',
                    defaultValue: ''
                },
                Description: {
                    field: 'Description',
                    defaultValue: ''
                },
                Age: {
                    field: 'Age',
                    defaultValue: ''
                },
                Gender: {
                    field: 'Gender',
                    defaultValue: ''
                },                
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                }
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            }
        };

        var profilesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            
            schema: {
                model: profileModel
            },
            transport: {
                typeName: 'Profiles'
            },
            serverFiltering: true,
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#profiles-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#profilesTemplate').html())
                    });
                } else {
                    $('#profiles-listview').empty();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
        return {
            profiles: profilesDataSource
        };
        
    }());
    
    return profilesViewModel;

}());
