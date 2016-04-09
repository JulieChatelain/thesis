var app = angular.module("ehr", [ 'ngCookies' ]);

app.controller('EHRCtrl', function($log,$scope, $http, $cookies) {
	$scope.$log = $log;
	$scope.patientId = 0;
	$scope.practioner = {};
	$scope.currentDate = new Date();
	
	
	$http.get("/ehrmenu").then(function(response) {
		$scope.ehrMenuOptions = response.data;
		for (var i = 0; i < $scope.ehrMenuOptions.length; i++) {
			$scope.ehrMenuOptions[i].show = true;
			$scope.ehrMenuOptions[i].unfold = true;
		}
	});

	$http.get("/rest/patient").then(function(response) {
		$scope.patients = response.data;
		var req = '/rest/condition?patient={"reference":"'+ encodeURIComponent($scope.patients[$scope.patientId].id) + '"}';
		$http.get(req).then(function(res) {
					$scope.conditions = res.data;
					$scope.diabete = $scope.findDiabete();
				});

	});	
	
	$scope.selectPatient = function selectPatient(id) {
		$scope.patientId = id;
		var req = '/rest/condition?patient={"reference":"'+ encodeURIComponent($scope.patients[$scope.patientId].id) + '"}';
		$http.get(req).then(function(response) {
					$scope.conditions = response.data;
					$scope.diabete = $scope.findDiabete();
				});
				
		// Retrieving a cookie
		// var optionsCookie = $cookies.get('ehrOptionsPatient' +
		// $scope.patients[id]._id.str);
		// Setting a cookie
		// $cookies.put('myFavorite', 'oatmeal');
	};

	$scope.calculateAge = function(birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	
	$scope.findDiabete = function(){
		for (var i = 0, len = $scope.conditions.length; i < len; i++) {
			var condition = $scope.conditions[i];
			for (var k = 0, klen = condition.code.coding.length; k < klen; k++) {
				var coding = condition.code.coding[k];
				if(coding.code == '46635009' && coding.system == 'http://snomed.info/sct') {
					return condition;
				}
				if(coding.display.search('Diabetes mellitus') != -1){
					return condition;
				}
			}
		}
		return {};
	};
	
	$scope.findStartDiabete = function(){
		if('onsetDateTime' in $scope.diabete){
			return $scope.calculateAge($scope.diabete.onsetDateTime);
		}
	}
	
});
