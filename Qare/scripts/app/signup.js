/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';

    var singupViewModel = (function () {

        var dataSource;
        var $signUpForm;
        var $formFields;
        //var $signupInfo;
        var $signupBtnWrp;
        var $signupFirstName;
        var $signupLastName;
        var $signupAddress;
        var $signupCity;
        var $signupPostalCode;
        var $signupPhone;
        var $signupAge;
        var $signupPrefAge;
        var $signupPrefGender;
        var $signupVOG;
        var $signupAboutMe;
        var validator;

        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {
            
            var valFirstName = $("#signupFirstName").val();
            var valLastName = $("#signupLastName").val();
            var valDispName = valFirstName + " " + valLastName;

            //dataSource.Gender = parseInt(dataSource.Gender);
            var birthDate = new Date(dataSource.BirthDate);

            if (birthDate.toJSON() === null) {
                birthDate = new Date();
            }

            dataSource.BirthDate = birthDate;
            dataSource.DisplayName = valDispName;

            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {
                app.showAlert("Registratie successvol");
                app.mobileApp.navigate('#welcome');
            },
            function (err) {
                app.showError(err.message);
            });
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {

            //Voornaam, Achternaam, Gebruikersnaam, 
            //Wachtwoord, E-mail, Adres, Plaats, Telefoonnummer,
            //Leeftijd, Geslacht, Leeftijdsvoorkeur hulpbehoevende,
            //Geslachtsvoorkeur hulpbehoevende, Verklaring Omtrent goed Gedrag?
            //Vertel eens iets meer over jezelf?
            //FirstName, LastName, Address, City, PostalCode, Phone, Age, Gender,
            //PrefAge, PrefGender, VOG, Description
            
            $signupFirstName = $('#signupFirstName');
            $signupLastName = $('#signupLastName');
            $signupAddress = $('#signupAddress');
            $signupCity = $('#signupCity');
            $signupPostalCode = $('#signupPostalCode');
            $signupPhone = $('#signupPhone');
            $signupAge = $('#signupAge');
            $signupPrefAge = $('#signupPrefAge');
            $signupPrefGender = $('signupPrefGender');
            $signupVOG = $('#signupVOG');
            $signupAboutMe = $('#signupAboutMe');
            
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            //$signupInfo = $('#signupInfo');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });

            //$signupInfo.on('keydown', app.helper.autoSizeTextarea);
        }

        // Executed after show of the Signup view
        var show = function () {
            //$signupInfo.prop('rows', 1);
			
            var valUserType = $("#signupUserType").val();
            
                        //FirstName, LastName, Address, City, PostalCode, Phone, Age, Gender,
            //PrefAge, PrefGender, VOG, Description
            dataSource = kendo.observable({
                
                FirstName: '',
                LastName: '',
                Address: '',
                City: '',
                PostalCode: '',
                Phone: '',
                Age: '',
                Username: '',
                Password: '',
                DisplayName: '',
                Email: '',
                Gender: '',
                Description: '',
                PrefAge:'',
                PrefGender:'',
                VOG:'',
                UserType: valUserType,
                Friends: [],
                BirthDate: new Date()
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            //$signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            signup: signup
        };

    }());

    return singupViewModel;

}());
