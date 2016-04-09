app.controller('EHRCtrl', function($scope) {
	

	$scope.name = "Bouh"
		
	$http.get("/ehrmenu")
    .then(function(response) {
        $scope.ehrMenuOptions = response.data;
    });
	
	$scope.patientId = 0;
	
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
	

});