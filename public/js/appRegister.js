var app = angular.module("register", [ 'ngCookies' ]);

app.controller('registerCtrl',function($log, $location,$scope, $http, $cookies) {
	$scope.$log = $log;
	$scope.userKind = 'patient';
	$scope.gender = 'male';
	$scope.eMail = '';
	$scope.password = '';
	$scope.confirmedPassword = '';
	$scope.nameFamily = '';
	$scope.nameGiven = '';
	$scope.birthDate = '';
	$scope.job = '';
	$scope.address = '';
	$scope.contactTel = '';
	$scope.contactEMail = '';
	$scope.speakFrench = true;
	$scope.speakEnglish = false;
	$scope.speakDutch = false;
	$scope.speakGerman = false;
	$scope.mainLanguage = 'fr';
	$scope.speciality = '';
	$scope.workLocation = '';
	
	$scope.register = function register() {
		
		var user = {};
		
		$http.post("/signin", data, config)
		   .then(
		       function(response){
		         // success callback
		       }, 
		       function(response){
		         // failure callback
		       }
		    );
		
	}
	
	
});