/**
 * Organisations view model
 */

var app = app || {};

app.Organisations = (function () {
    'use strict'

    var organisationsViewModel = (function () {
        
        var organizationModel = {
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
                City: {
                    field: 'City',
                    defaultValue: ''
                },                 
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                ActivityId: {
                    field: 'ActivityId',
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

        var organisationsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: organizationModel
            },
            transport: {
                typeName: 'Organisations'
            },
            serverFiltering: true,
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#organisations-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#organisationsTemplate').html())
                    });
                } else {
                    $('#organisations-listview').empty();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
        return {
            organisations: organisationsDataSource
        };
        
    }());
    
    return organisationsViewModel;

}());
