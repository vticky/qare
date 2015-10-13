/*global app, kendo, Camera */
'use strict';

app.profilePersonView = kendo.observable({
    
    onShow: function(e) {
        
        //alert(app.Users.currentUser.data);
        //var personId = e.view.params.uid;
        var personId = e.view.params.uid;
        var person = app.Users.users.getByUid(personId);
        
		var myProfileCreated = app.Users.currentUser.data.CreatedAt;
        var day = ("0" + myProfileCreated.getDate()).slice(-2);
        var month = ("0" + (myProfileCreated.getMonth() + 1)).slice(-2);
        var today = (day) + "-" + (month) + "-" + myProfileCreated.getFullYear();
        
        //var myProfileBday = app.Users.currentUser.data.BirthDate;
        //var dayB = ("0" + myProfileBday.getDate()).slice(-2);
        //var monthB = ("0" + (myProfileBday.getMonth() + 1)).slice(-2);
        //var todayB = (dayB) + "-" + (monthB) + "-" + myProfileBday.getFullYear();
        
        $("#myProfileId").text(app.Users.currentUser.data.Id);
        $("#myProfilePicture").attr('src', app.Users.currentUser.data.PictureUrl);
        $("#myProfileName").text(app.Users.currentUser.data.DisplayName);
        $("#myProfileUsername").text(app.Users.currentUser.data.Username);    
        $("#myProfileEmail").text(app.Users.currentUser.data.Email);
        $("#myProfileGender").text(app.Users.currentUser.data.Gender);
		$("#myProfileCity").text(app.Users.currentUser.data.City);
		$("#myProfileDescription").text(app.Users.currentUser.data.Description);
		$("#myProfilePhone").text(app.Users.currentUser.data.Phone);
        $("#myProfileAge").text(app.Users.currentUser.data.Age);
        $("#myProfileCreated").text(today);
        
    },

    dataLoaded: function () {
    
     var currentUserType = app.Users.currentUser.data.UserType;
		  
        
        if (currentUserType === "Vrijwilliger"){
            $("#provider-activities").hide();
            $("#provider-bookings").hide();
            $("#volunteer-activities").show();    
            $("#volunteer-bookings").show();
            $("#volunteer-favorites").show();
            
            $("#provider-myprofile").show();
        }
        else if (currentUserType === "Aanbieder"){
            $("#provider-activities").show();
            $("#provider-bookings").show();
            
            //$("#provider-profiles").show();
            $("#provider-myprofile").show();
            $("#volunteer-activities").hide();
            $("#volunteer-bookings").hide();
            $("#volunteer-favorites").hide();
        } 
        else {
            $("#volunteer-activities").show();
            $("#volunteer-bookings").show();
            $("#volunteer-favorites").show();
            $("#provider-myprofile").show();
        }       
    }
});
(function(parent) {
	
    var defaultPic = "styles/images/qare-logo_360.png";
    //var dispname = app.Users.currentUser.data.DisplayName;
    
    var profilePersonViewModel = kendo.observable({
        
        fields: {
            
            profilePic: defaultPic,
            //identity > object > facebook > email
        },
        genders: [
            'Man',
            'Vrouw'
        ],
        
        home: function (){
            
            var currentUserType = app.Users.currentUser.data.UserType;

            if (currentUserType === "Aanbieder"){

                app.mobileApp.navigate('views/myActivitiesView.html');

            } else {
                
                app.mobileApp.navigate('views/activitiesView.html');
            }
        }

    });

    parent.set('profilePersonViewModel', profilePersonViewModel);

})(app.profilePersonView);