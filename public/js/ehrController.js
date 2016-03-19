angular.module('ehr', ['ngCookies']).controller('EHRCtrl', ['$cookies', '$scope',function($scope, $cookies) {

	$scope.patientId = 0;
		
	$scope.ehrMenuOptions = [];
	$scope.patients = [];
	$scope.practioner = {};
	
	$scope.currentDate = new Date();
	
	
	$scope.selectPatient = function selectPatient(id) {
		$scope.patientId = id;		

		// Retrieving a cookie
		var optionsCookie = $cookies.get('ehrOptionsPatient'+id);
		// Setting a cookie
		$cookies.put('myFavorite', 'oatmeal');
	};
		
	$scope.calculateAge = function(birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

}]);