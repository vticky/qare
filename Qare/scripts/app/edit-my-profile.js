/*global app, kendo, Camera */
'use strict';

app.editMyProfileView = kendo.observable({
    
    onShow: function() {
        
        //var myProfileBday = app.Users.currentUser.data.BirthDate;
        //var dayB = ("0" + myProfileBday.getDate()).slice(-2);
        //var monthB = ("0" + (myProfileBday.getMonth() + 1)).slice(-2);
        //var todayB = (dayB) + "-" + (monthB) + "-" + myProfileBday.getFullYear();

        $("#editMyProfileId").val(app.Users.currentUser.data.Id);
        $("#editMyProfilePicture").attr('src', app.Users.currentUser.data.PictureUrl);
        $("#editMyProfileName").val(app.Users.currentUser.data.DisplayName);
        $("#editMyProfileUsername").val(app.Users.currentUser.data.Username);    
        $("#editMyProfileEmail").val(app.Users.currentUser.data.Email);
        $("#editMyProfileGender").val(app.Users.currentUser.data.Gender);
		$("#editMyProfileCity").val(app.Users.currentUser.data.City);
		$("#editMyProfileDescription").val(app.Users.currentUser.data.Description);
		$("#editMyProfilePhone").val(app.Users.currentUser.data.Phone);
        $("#editMyProfileAge").val(app.Users.currentUser.data.Age);

    }
});
(function(parent) {
	
    var mimeMap = {
        jpg  : "image/jpeg",
        jpeg : "image/jpeg",
        png  : "image/png",
        gif  : "image/gif"
    };    
    
	var AppHelper = {
        resolveImageUrl: function (id) {
            if (id) {
                return el.Files.getDownloadUrl(id);
            }
            else {
                return '';
            }
        },
        getBase64ImageFromInput : function (input, cb) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                if (cb)
                    cb(e.target.result);
            };
            reader.readAsDataURL(input);
        },
        getImageFileObject: function(input, cb) {
            var name = input.name;
            var ext = name.substr(name.lastIndexOf('.') + 1);
            var mimeType = mimeMap[ext];
            if(mimeType) {
                this.getBase64ImageFromInput(input, function(base64) {
                    var res = {
                        "Filename"    : name,
                        "ContentType" : mimeType,              
                        "base64"      : base64.substr(base64.lastIndexOf('base64,')+7)
                    }
                    cb(null, res);
                });
            } else {
                cb("File type not supported: " + ext);    
            }
        }
    };    
    
    var defaultPic = "styles/images/qare-logo_720.png";
    
    var $newPicture;
    
    var editMyProfileViewModel = kendo.observable({
        
        fields: {
            
            id: '',
            picture: defaultPic,
            displayname: '',
            username:'',
            email: '',
            birthdate: '',
            gender: '',
            city: '',
            description: '',
            phone: '',
        },
        genders: [
            'Man',
            'Vrouw'
        ],
        submit: function() {
             
            //Check update function
            var provider = app.everlive;

            var attrs = {
                
                Id: app.Users.currentUser.data.Id,
                DisplayName: $("#editMyProfileName").val(),
                UserName: app.Users.currentUser.data.Username,
                Email: app.Users.currentUser.data.Email,
                Age: $("#editMyProfileBirthAge").val(),
                Gender: $("#editMyProfileGender").val(),
                City: $("#editMyProfileCity").val(),
                Description: $("#editMyProfileDescription").val(),
                Phone: $("#editMyProfileMobile").val()
                
            };

            provider.Users.updateSingle(attrs,
                function(data) {
                
                    alert(JSON.stringify(data));
                    
					app.mobileApp.navigate('#views/myProfileView.html', 'fade');
                },
                function(error) {
                    alert(JSON.stringify(error));
                });
        },

        cancel: function() {
            
            app.mobileApp.navigate('#views/myProfileView.html', 'fade');
        },
		home: function (){
            
            var currentUserType = app.Users.currentUser.data.UserType;

            if (currentUserType === "Aanbieder"){

                app.mobileApp.navigate('views/myActivitiesView.html');

            } else {
                
                app.mobileApp.navigate('views/activitiesView.html');
            }
        },        
        
        capturePhotoDataUrl: function(){
            
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });
            function onSuccess(imageData) {
                var image = document.getElementById('editMyProfilePicture');
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        },
        
        capturePhotoFileUri: function(){
            
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });

            function onSuccess(imageURI) {
            	var image = document.getElementById('editMyProfilePicture');
            	image.src = imageURI;
            }

            function onFail(message) {
            	alert('Failed because: ' + message);
            }
        },
        
        //change this function for uploading to the server
    	addPicture: function() {

            var el = app.everlive;
            var imageURI = ''; // the retrieved URI of the file on the file system, e.g. using navigator.camera.getPicture()
            var image = document.getElementById('editMyProfilePicture');
           	image.src = imageURI;
            var uploadUrl = el.Files.getUploadUrl();
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = "everlive.png";
            options.mimeType = "image/png";
            options.headers = el.buildAuthHeader();
            //options.source = image;
            // error {"code":null,"source":null,"target":null,"http_status":null,"body":null,"exception":null}
            
            var params = new Object();
            //params.source = image;
 
            options.params = params;
            options.chunkedMode = false;
			
            alert(JSON.stringify(options));
            
            var ft = new FileTransfer();
            ft.upload(imageURI, uploadUrl,
          		function(r) {
                    var responseCode = r.responseCode;
                    var res = JSON.parse(r.response);
                    var uploadedFileId = res.Result[0].Id;
                    var uploadedFileUri = res.Result[0].Uri;
                    // use the Id and the Uri of the uploaded file 
            	}, 
                      
              	function(error) {
                	alert("An error has occurred:" + JSON.stringify(error));
            }, options)
        },
        
        onPicSet: function(e) {
            this.set('picSelected', true);
            this.set('picName', e.target.files[0].name);
        },
        
        
        saveItem: function() {
            var that = this;
            $newPicture = $newPicture || $("#editMyProfilePicture");
            AppHelper.getImageFileObject(
                $newPicture[0].files[0],
                function( err, fileObj ) {
                    if(err) {
                        navigator.notification.alert(err);    
                        return;
                    }
                    $.ajax({
                        type: "POST",
                        url: 'https://api.everlive.com/v1/f2CLUNOWvvEuKcwZ/Files',
                        contentType: "application/json",
                        data: JSON.stringify(fileObj),
                        error: function(error){
                            navigator.notification.alert(JSON.stringify(error));
                        }
                    }).done(function(data){
                        var item = editMyProfileViewModel.add();
                        item.Title = that.get('picTitle');
                        item.Picture = data.Result.Id;
                        editMyProfileViewModel.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        editMyProfileViewModel.sync();
                        
                        // reset the form
                        that.set("picSelected", false);
                        $newPicture.replaceWith($newPicture = $newPicture.clone(true));
                    });
                }
            );          
        },
        
    })
                                                  
    parent.set('editMyProfileViewModel', editMyProfileViewModel);

})(app.editMyProfileView);