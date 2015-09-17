/**
 * Activities view model
 */
var app = app || {};

app.init = (function () {
    kendo.bind($("input[type='checkbox']"), app.filters);
});

/*app.filters = kendo.observable({
    categories: [],
    oncategorychange: function () {
        
        var filters = [];

        $("input.filter-category").each(function () {
            if (this.checked) filters.push({ field: "Category", operator: "eq", value: this.value });
        });

        if (filters.length > 0) {
            app.Activities.activities.filter({
                logic: "or",
                filters: filters
            });
        }
    },
    
});*/

app.Activities = (function () {
    'use strict'

    // Activities model
    var activitiesModel = (function () {

        var activityModel = {

            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                Category: {
                    field: 'Category',
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
                Location: {
                    field: 'Location',
                    defaultValue: ''
                },                
                ActivityStartTime: {
                    field: 'ActivityStartTime',
                    defaultValue: ''
                },  
                ActivityEndTime: {
                    field: 'ActivityEndTime',
                    defaultValue: ''
                },                  
                Status: {
                    field: 'Status',
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
                },
                ProfileId: {
                    field: 'ProfileId',
                    defaultValue: null
                },
 				
                Likes: {
                    field: 'Likes',
                    defaultValue: []
                }
            },
            CreatedAtFormatted: function () {

                return app.helper.formatDate(this.get('CreatedAt'));
            },
            ActivityDateFormatted: function () {

                return app.helper.formatDate(this.get('ActivityDate'));
            },            
            PictureUrl: function () {

                return app.helper.resolvePictureUrl(this.get('Picture'));
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
            },
            Profile: function () {

                var profileId = this.get('ProfileId');
                
				app.Profiles.profiles.read();
                var profile = $.grep(app.Profiles.profiles.data(), function (e) {                
                    return e.Id === profileId;
                })[0];

                return profile ? {
                    Name: profile.Name,
                    Gender: profile.Gender,
                    PictureUrl: app.helper.resolveProfilePictureUrl(profile.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    Gender: 'Man',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },            
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;               
                var userId = this.get('UserId');
                return currentUserId === userId;
            },
           	isProvider: function () {
                var currentUserType = app.Users.currentUser.data.UserType;
                var userType = this.get('UserType');
                return currentUserType === 'userType';
            },
            
        };

        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var activitiesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: activityModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Activities',
				read : {
						data: {
								$expand: 'Profiles'
							}

				}
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
            // group: { field: "Category" },
            sort: { field: 'ActivityDate', dir: 'asc' },
            filter: { field: "Status", operator: "eq", value: "Aangevraagd" }
        });

        return {
            activities: activitiesDataSource
        };

    }());

    // Activities view model
    var activitiesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {

            app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            //app.mobileApp.navigate('#welcome');
              var currentUserType = app.Users.currentUser.data.UserType;

            if (currentUserType === "Aanbieder"){

                app.mobileApp.navigate('views/myActivitiesView.html');

            } else {
                
                app.mobileApp.navigate('views/activitiesView.html');
            }
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                //app.showError(err.message);
                //navigateHome();
            });
        };

        
        // Filter Modal Dialog
       var filterDialog = function () {

           $("#activitiesFilter").kendoMobileModalView("close");

        };
       var mapDialog = function () {

           $("#googleMapView").kendoMobileModalView("close");

        };        
        
        var activateFilter = function () {
            
            alert('TODO: Activate Filter');
        }      

        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout,
            filterDialog: filterDialog,
            activateFilter: activateFilter,
            mapDialog: mapDialog
            
        };

    }());

    return activitiesViewModel;

}());
