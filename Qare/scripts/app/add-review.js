/**
 * AddReview view model
 */

var app = app || {};

app.AddReview = (function () {
    'use strict'

    var AddReviewViewModel = (function () {
        
        var $newReviewName;
        var $newReviewDescription;
        var $newRating05;
        var $newRating04;
        var $newRating03;
        var $newRating02;
        var $newRating01;
        //var validator;
        
        var init = function () {
            
            //validator = $('#enterReview').kendoValidator().data('kendoValidator');
            $newReviewName = $('#newReviewName');
            $newReviewDescription = $('#newReviewDescription');
            $newRating05 = $('#group-1-0'); // 5 Stars
            $newRating04 = $('#group-1-1'); // 4 Stars
            $newRating03 = $('#group-1-2'); // 3 Stars
            $newRating02 = $('#group-1-3'); // 2 Stars
            $newRating01 = $('#group-1-4'); // 1 Stars

            //$newReviewName.on('keydown', app.helper.autoSizeTextarea);
            //$newReviewDescription.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            
            // Clear field on view show
            $newReviewName.val('');
            $newReviewDescription.val('');
            $newRating05.val(''); // 5 Stars
            $newRating04.val(''); // 4 Stars
            $newRating03.val(''); // 3 Stars
            $newRating02.val(''); // 2 Stars
            $newRating01.val(''); // 1 Stars            
            //validator.hideMessages();
            $newReviewDescription.prop('rows', 1);
        };
        
        var saveReview = function () {
            
    
            // Adding new review to Reviews model
            var reviews = app.Reviews.reviews;
            var review = reviews.add();
            
            review.Name = $newReviewName.val();
            review.Description = $newReviewDescription.val();
            review.Rating = $newRating05.val();
            review.Rating = $newRating04.val();
            review.Rating = $newRating03.val();
            review.Rating = $newRating02.val();
            review.Rating = $newRating01.val();
            review.UserId = app.Users.currentUser.get('data').Id;
            review.ActivityId = app.Activity.activity().Id;
            
            reviews.one('sync', function () {
                app.mobileApp.navigate('#:back');
            });
            
            reviews.sync();

        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveReview: saveReview
        };
        
    }());
    
    return AddReviewViewModel;
    
}());
