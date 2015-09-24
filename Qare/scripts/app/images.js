/**
 * Fimages view model
 */
var app = app || {};

app.Fimages = (function () {
    
'use strict'

    var el = new Everlive({
        apiKey: "f2CLUNOWvvEuKcwZ"
    });

        
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

    // Fimages model
    var fimagesModel = (function () {
        var fimageModel = {
            id: 'Id',
            fields: {
                Title: {
                    field: 'Title',
                    defaultValue: ''
                },
                Picture: {
                    field: 'Picture',
                    defaultValue: ''
                },
            },
            PictureUrl: function () {
                return AppHelper.resolveImageUrl(this.get('Picture'));
            }
        };
        
        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var fimagesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: fimageModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Images'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-images-span').hide();
                } else {
                    $('#no-images-span').show();
                }
            }
        });

        return {
            fimages: fimagesDataSource
        };

    }());

    // Activities view model
    var fimagesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var fimageSelected = function (e) {
 var currentUserType = app.Users.currentUser.data.UserType;
    
            if (currentUserType === "Vrijwilliger"){
    
                app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
            }
            else
            { 
    
                app.mobileApp.navigate('views/myActivityView.html?uid=' + e.data.uid);
            }

        };
   

        return {
            fimages: fimagesModel.fimages,
            fimageSelected: fimageSelected,

            
        };

    }());
  
    return fimagesViewModel;
    
    var $newPicture;
  
    var addImage = {
        picName: '',
        picTitle: '',
        picSelected: false,
        onPicSet: function(e) {
            this.set('picSelected', true);
            this.set('picName', e.target.files[0].name);
        },
        onRemovePic: function() {
            this.set("picSelected", false);
            // reset the file upload selector
            $newPicture = $newPicture || $("#newPicture");
            $newPicture.replaceWith($newPicture = $newPicture.clone(true));
        },
        onAddPic: function() {
            $newPicture = $newPicture || $("#newPicture");
            $newPicture.click();
        },
        saveItem: function() {
            var that = this;
            $newPicture = $newPicture || $("#newPicture");
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
                        var item = fimagesViewModel.images.add();
                        item.Title = that.get('picTitle');
                        item.Picture = data.Result.Id;
                        fimagesViewModel.images.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        fimagesViewModel.images.sync();
                        
                        // reset the form
                        that.set("picSelected", false);
                        $newPicture.replaceWith($newPicture = $newPicture.clone(true));
                    });
                }
            );          
        }
    };
    // ***************** END ****************************

    // add image view model
    var addImageViewModel = (function () {
        var picName = "";
        var $newTitle;
        var $newPicture;
        var $picName;
        var $picInfo;
        var $newPicLabel;
        var validator;
        var init = function () {
            alert('init loaded');
            validator = $('#enterItem').kendoValidator().data("kendoValidator");
            $newTitle = $('#newTitle');
            $picName = $('#picName');
            $newPicture = $('#newPicture');    
            $newPicLabel = $('#newPicLabel');
            $picInfo = $("#picInfo");
        };
        var show = function () {
            $newTitle.val('');
            $newPicture.val('').show();
            $newPicLabel.show();
            $picInfo.hide();
            validator.hideMessages();
        };
        var saveItem = function () {
            if (validator.validate()) {
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
                            var item = fimagesViewModel.images.add();
                            item.Title = $newTitle.val();
                            item.Picture = data.Result.Id;
                            fimagesViewModel.images.one('sync', function () {
                                app.mobileApp.navigate('#:back');
                            });
                            fimagesViewModel.images.sync();
                            picSelected = false;
                        });
                    }
                );                
                
            }
        };
        var onPicSet = function(e) {
            $picName.text($newPicture[0].files[0].name);
            addImage.set("picSelected", true);
            $newPicture.hide();
            $newPicLabel.hide();
        };
        var removePic = function() {
            $picName.text("");
            $picInfo.hide();
            $newPicture.val('').show();
            $newPicLabel.show();
        };
        return {
            init: init,
            show: show,
            saveItem: saveItem,
            onPicSet: onPicSet,
            removePic : removePic
        };
    }());

    return {

        images: fimagesViewModel,
        addImage : addImage

    };    

}());
