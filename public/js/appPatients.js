var app = angular.module("patients", [ 'ngCookies' ]);

app.controller('patientsCtrl',function($log, $location,$scope, $http, $cookies) {
	$scope.$log = $log;
	$scope.patients = [];
	$scope.nameFilter = '';
	
	// Get the patient list
	$http.get("/rest/patient").then(function(response) {
			$scope.patients = response.data;
		});
	

	/** -----------------------------------------------------------------------
	 * Compute the age from the birthday
	 *  -----------------------------------------------------------------------
	 */
	$scope.calculateAge = function(birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	
	
});