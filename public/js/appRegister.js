var app = angular.module("register", [  ]);

app.controller('registerCtrl',function($log, $location,$scope, $http) {
	$scope.$log = $log;
	$scope.userKind = 'patient';
	$scope.gender = 'male';
	$scope.eMail = '';
	$scope.password = '';
	$scope.confirmPass = '';
	$scope.nameFamily = '';
	$scope.nameGiven = '';
	$scope.birthDate = '';
	$scope.job = '';
	$scope.address = '';
	$scope.contactTel = '';
	$scope.telType = 'home';
	$scope.contactEmail = '';
	$scope.emailType = 'home';
	$scope.speakFrench = true;
	$scope.speakEnglish = false;
	$scope.speakDutch = false;
	$scope.speakGerman = false;
	$scope.mainLanguage = 'fr';
	$scope.speciality = '';
	$scope.workLocation = '';
	$scope.workTel = '';
	
	$scope.bgCol = {"background-color" : "#f3e5f5"};
	$scope.matchingPasswords = false;
	
	$scope.checkPasswordMatch = function(password1, password2){
		if(password1.length > 6 && password2.length > 6 && password1 == password2){
			console.log("matching: " + password1 + " " + password2);
			$scope.bgCol["background-color"] = "#E1F5FE";
			$scope.matchingPasswords = true;
		}else{
			console.log("not matching: " + password1 + " " + password2);
			$scope.bgCol["background-color"] = "#f3e5f5";
			$scope.matchingPasswords = false;
			
		}
	};
	
});

app.directive('validPassword', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, element, attr, mCtrl) {
	      function validation(value) {
	        if (value.length > 6) {
	          mCtrl.$setValidity('password', true);
	        } else {
	          mCtrl.$setValidity('password', false);
	        }
	        return value;
	      }
	      mCtrl.$parsers.push(validation);
	    }
	  };
	});