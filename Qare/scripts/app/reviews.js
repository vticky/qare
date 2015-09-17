/**
 * Reviews view model
 */

var app = app || {};

app.Reviews = (function () {
    'use strict'

    var reviewsViewModel = (function () {
        
        var reviewModel = {
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

        var reviewsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: reviewModel
            },
            transport: {
                typeName: 'Reviews'
            },
            serverFiltering: true,
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#reviews-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#reviewsTemplate').html())
                    });
                } else {
                    $('#reviews-listview').empty();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
        return {
            reviews: reviewsDataSource
        };
        
    }());
    
    return reviewsViewModel;

}());
