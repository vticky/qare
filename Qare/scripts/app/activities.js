/**
 * Activities view model
 */
var app = app || {};

app.showMap = (function(position) {
    
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
    $('#map_canvas'),
    mapOptions
    );

    var marker = new google.maps.Marker({
    	position: latlng,
    	map: map
    });
		console.log(marker);
		console.log("map rendering");

 

});
app.bookingsAfterShow = (function () {
    
    app.Activities.activities.filter(
        [{field: "Status", operator: "eq", value: "Aangevraagd"},
        {field: "Status", operator: "eq", value: "Bevestigd"}],
    	{field: "UserId", operator: "eq", value: app.Users.currentUser.data.Id}, 
    {field: "ActivityDate", operator: "gt", value: new Date()})

    app.Activities.activities.group(
         { field: "ActivityDate" })
   
});
app.bookingsHistoryAfterShow = (function () {
    
    app.Activities.activities.filter(
        [{field: "Status", operator: "eq", value: "Bevestigd"},
    	{field: "UserId", operator: "eq", value: app.Users.currentUser.data.Id},
     {field: "ActivityDate", operator: "lt", value: new Date()}])

    app.Activities.activities.group(
         { field: "ActivityDate" })
   
});
app.myBookingsAfterShow = (function () {
    
    app.Activities.activities.filter(
        [{field: "Status", operator: "eq", value: "Aangevraagd"},
    {field: "Status", operator: "eq", value: "Bevestigd"}],
    	{field: "CreatedBy", operator: "eq", value: app.Users.currentUser.data.Id}, 
    {field: "ActivityDate", operator: "gt", value: new Date()})
    
     app.Activities.activities.group(
         { field: "ActivityDate" })
   
});
app.myBookingsHistoryAfterShow = (function () {
    
    app.Activities.activities.filter(
        [{field: "Status", operator: "eq", value: "Bevestigd"},
    	{field: "CreatedBy", operator: "eq", value: app.Users.currentUser.data.Id},
     {field: "ActivityDate", operator: "lt", value: new Date()}])
    
     app.Activities.activities.group(
           { field: "ActivityDate" })
   
});
app.myActivitiesAfterShow = (function () {  
    
    app.Activities.activities.filter(
     {field: "Status", operator: "eq", value: "Toegevoegd"},
          {field: "CreatedBy", operator: "eq", value: app.Users.currentUser.data.Id},
        {field: "ActivityDate", operator: "gt", value: new Date()}
    )
//    {field: "Status", operator: "eq", value: "Aangevraagd"}],
    app.Activities.activities.group(
       { field: "ActivityDate" })
     
    app.Activities.activities.sort (
         { field: 'ActivityDate', dir: 'asc'})
});
app.activitiesReload = (function () { 
    
    //var groupValue = $(".km-text").html();
    
    $('span.activity-category:contains("Gezelschap")').each(function () {
    	
        $("#activity-category").removeClass("activity-category");
	});
    
    var currentUserType = app.Users.currentUser.data.UserType;
                
    if (currentUserType === "Vrijwilliger"){

        $("#volunteer-activities").show();
        $("#volunteer-bookings").show();
        $("#volunteer-favorites").show();
        $("#provider-myprofile").show();
        
    } else if (currentUserType === "Aanbieder"){
        
        $("#provider-activities").show();
        $("#provider-bookings").show();
        $("#provider-profiles").show();
        $("#provider-myprofile").show();
        
    } else {
        
        $("#volunteer-activities").show();
        $("#volunteer-bookings").show();
        $("#volunteer-favorites").show();
        $("#provider-myprofile").show();
        
    }
    
    app.Activities.activities.filter(
        [{field: "Status", operator: "eq", value: "Aangevraagd"},
        {field: "ActivityDate", operator: "gt", value: new Date()}]);
    
   app.Activities.activities.group(
         { field: 'ActivityDate', operator: "gt", value: new Date()});
    
     app.Activities.activities.sort (
         { field: 'ActivityDate', dir: 'asc', operator: "gt", value: new Date() })
    
    //app.Activities.activities.group(
      //   { field: 'Category'})
   
   // var activityProvider = app.everlive.data('Activities');
   // var formattedActivityDate = activityProvider.ActivityDate.(kendo.toString(new Date(2010, 9, 5), "yyyy/MM/dd" ));
    
    // app.Activities.activities.group(
    //     { field: "formattedActivityDate" })

});
app.init = (function () {
    
    $('span.activity-category:contains("Gezelschap")').each(function () {
    	//alert("Gezelschap");
        $("#activity-category").removeClass("activity-category");
	});
    
    kendo.bind($("input[type='checkbox']"), app.filters);
    kendo.bind($("input[type='radio']"), app.filters);
});
app.filters = kendo.observable({
   	
    categories: ["Zorg"],
    oncategorychange: function () {
        
        var filters = [] 
        $("input.filter-category").each(function () {
            if (this.checked) filters.push([{ field: "Category", operator: "eq", value: this.value }, {field: "ActivityDate", operator: "gt", value: new Date()},
                                           {field: "Status", operator: "eq", value: "Aangevraagd"}]);
        });
       
        if (filters.length > 0) {
            app.Activities.activities.filter({
                logic: "or",
                filters: filters
            });
            
        }
    },
   ongenderchange: function(){
      
        $("input.filter-gender").each(function () {
            if (this.checked){
               app.Profiles.profiles.read();
               var profileGenders = $.grep(app.Profiles.profiles.data(), function (e) {                
                    return e.Gender === this.value;
               });
             }
       });
       
       var filters = []
       $.each(profileGenders, function( index, value ) {
                 filters.push([{ field: "ProfileId", operator: "eq", value: value.Id }, 
                               {field: "ActivityDate", operator: "gt", value: new Date()},
                               {field: "Status", operator: "eq", value: "Aangevraagd"}]);
         });
       
        if (filters.length > 0) {
            app.Activities.activities.filter({
                logic: "or",
                filters: filters
            });
            
        }
       
     }   

});

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
                ActivityDate: {
                    field: 'ActivityDate',
                    defaultValue: new Date()
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
                CreatedBy: {
                    field: 'CreatedBy',
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
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },            
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;               
                var userId = this.get('UserId');
                return currentUserId === userId;               
                
            },
          hasChildren: function (item) {
                return item.Profile && item.Profile.length > 0;
            },
            children: "Profile"
                
        };
        
        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var activitiesDataSource =  new kendo.data.DataSource({
            offlineStorage: "activity-list",
            type: 'everlive',
            schema: {
                model: activityModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Activities'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
            filter: {field: "ActivityDate", operator: "gt", value: new Date()},
            group: { field: "ActivityDate", operator: "gt", value: new Date()},
            sort: { field: 'ActivityDate', dir: 'asc', operator: "gt", value: new Date() }//,
            //filter: [{field: "Status", operator: "eq", value: "Toegevoegd" }]//,
            //{field: "Status", operator: "eq", value: "Aangevraagd"}
                     //{field: "Status", operator: "neq", value: "Bevestigd" }]
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
        
        var catColor = function () {
            
            var category = $("#activity-category").text();
            if(category === 'Zorg'){
                
                $("#activity-category").hide();
            }
            
        };

        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout,
            filterDialog: filterDialog,
            mapDialog: mapDialog,
            catColor: catColor
            
        };

    }());
  
    return activitiesViewModel;

}());
