/**
 * myActivities view model
 */

var app = app || {};

app.initMyActivities = (function () {
    //app.myActivities.myActivities.filter({
    //    field: "UserId",
    //    operator: "eq",
    //    value: app.Users.currentUser.data.Id
    //})
});

app.myActivitiesAfterShow = (function () {  
    

});

app.myActivities = (function () {
    'use strict'

    // myActivities model
    var myactivitiesModel = (function () {

        var myactivityModel = {

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
                DayInWeek: {
                    field: 'DayInWeek',
                    defaultValue: 1
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
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

                var profile = $.grep(app.Profiles.profiles(), function (e) {
                    return e.Id === profileId;
                })[0];

                return profile ? {
                    Name: profile.Name,
                    PictureUrl: app.helper.resolveProfilePictureUrl(profile.Picture)
                } : {
                    DisplayName: 'Anonymous',
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
            }
        };

        // myActivities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var myactivitiesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: myactivityModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Activities'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-myactivities-span').hide();
                } else {
                    $('#no-myactivities-span').show();
                }
                
                //myactivitiesDataSource.filter( { field: "UserId", operator: "eq", value: currentUserId} );
               
            },
            //filter: { field: "UserId", operator: "eq", value: app.Users.currentUser.data.Id },
            //group: { field: "Status" },
            //sort: { field: 'ActivityDate', dir: 'asc' }
            
            group: { field: "ActivityDate"},
            sort: { field: 'ActivityDate', dir: 'asc' },
            filter: [{field: "Status", operator: "eq", value: "Aangevraagd" },
                     {field: "Status", operator: "neq", value: "Bevestigd" }]
            
            //filter: [{field: "Status", operator: "eq", value: "Aangevraagd"},
              //       {field: "UserId", operator: "eq", value: app.Users.currentUser.data.Id}],
            //group: { field: "ActivityDate" },
            //sort: { field: 'ActivityDate', dir: 'asc' }
            
        });
        
        return {
            myActivities: myactivitiesDataSource
        };

    }());

    // myActivities view model
    var myactivitiesViewModel = (function () {

        // Navigate to myactivityView When some myactivity is selected
 		var activitySelected = function (e) {

           var currentUserType = app.Users.currentUser.data.UserType;
    
            if (currentUserType === "Vrijwilliger"){
    
                app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
            }
            else
            { 
    
                app.mobileApp.navigate('views/myActivityView.html?uid=' + e.data.uid);
            }
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };
       
       var hideItems = function () {
         
            var currentUserId = app.Users.currentUser.data.Id;               
            var itemOwner = $("#userCreated").text();
            
            alert(currentUserId);
            alert(itemOwner);	                

            if (currentUserId === itemOwner) {
                alert("Yes")
            } else {
                alert("No")
            }
       };
        

        return {
            myActivities: myactivitiesModel.myactivities,
            activitySelected: activitySelected,
            logout: logout,
            hideItems: hideItems
        };

    }());

    return myactivitiesViewModel;

}());
