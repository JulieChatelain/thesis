var app = angular.module("ehr", [ 'ngCookies' ]);

app.controller('EHRCtrl',function($log, $scope, $http, $cookies) {
	$scope.$log = $log;
	$scope.patientId = 0;
	$scope.practioner = {};
	$scope.currentDate = new Date();

	// Get the ehr options
	$http.get("/ehrmenu").then(function(response) {
		$scope.ehrMenuOptions = response.data;
		for (var i = 0; i < $scope.ehrMenuOptions.length; i++) {
			$scope.ehrMenuOptions[i].show = true;
			$scope.ehrMenuOptions[i].unfold = true;
		}
	});

	// Get the patient list
	$http.get("/rest/patient").then(function(response) {
			$scope.patients = response.data;
			// Select the first patient in the list
			if($scope.patients.length > 0)
				$scope.selectPatient($scope.patients[0].id);
		});
	
	/** -----------------------------------------------------------------------
	 * Select another patient
	 *  -----------------------------------------------------------------------
	 */
	$scope.selectPatient = function selectPatient(id) {
		$scope.patientId = id;

		// Get the patient according to his id
		var req2 = '/rest/' + $scope.patientId + '';
		$http.get(req2).then(function(response) {
			$scope.patient = response.data;
		});
		
		// Get all the conditions of this patient
		var req = '/rest/condition?patient={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req).then(function(response) {
			$scope.conditions = response.data;
			// search for the record of the diabete condition
			$scope.diabete = findDiabete();
			// update the diabete symptoms list
			$scope.diabeteSymptoms = findDiabeteSymptoms();
			// compute the aproximate duration of the symptoms
			$scope.symptomsDuration = computeSymptomsDuration();
		});
		// Get all the diagnostic reports of the first patient
		var req3 = '/rest/diagnosticreport?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req3).then(function(res) {
			$scope.diagnostics = res.data;
			// Search for the diagnostic confirming the diabete
			$scope.diagDiabete = findDiagDiabete();
			// update the diabete symptoms list
			$scope.diabeteSymptoms = findDiabeteSymptoms();
			// compute the aproximate duration of the symptoms
			$scope.symptomsDuration = computeSymptomsDuration();
			// find encounter where diabetes diagnosis was established
			var req4 = '/rest/'+ $scope.diagDiabete.encounter.reference + '';
			$http.get(req4).then(function(response) {
				$scope.diabDiagEncounter = response.data;
				// check if the patient was hospitalized
				$scope.hospitalized = $scope.hospitalizedForDiabete();
			});
		});

		// Get all the observations for this patient
		var req4 = '/rest/observation?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req4).then(function(response) {
			$scope.observations = response.data;
			// search for the history of tobacco use
			$scope.tobaccoUse = findTobaccoUse();
		});
		// Retrieving a cookie
		// var optionsCookie = $cookies.get('ehrOptionsPatient'
		// +
		// $scope.patients[id]._id.str);
		// Setting a cookie
		// $cookies.put('myFavorite', 'oatmeal');
	};

	/** -----------------------------------------------------------------------
	 * Find the observation corresponding to the history of tobacco use
	 *  -----------------------------------------------------------------------
	 */
	
	var findTobaccoUse = function(){
		if(typeof $scope.observations !== 'undefined'){
			for (var i = 0, len = $scope.observations.length; i < len; i++) {
				if($scope.observations[i].code.coding.length > 0)
					if($scope.observations[i].code.coding[0].code == '11367-0') {
						return $scope.observations[i];
					}	
			}
		}
		return null;		
	}
	
	$scope.calculateAge = function(birthday) {
		var ageDifMs = Date.now() - new Date(birthday);
		var ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	/** -----------------------------------------------------------------------
	 * Compute the duration in years, month and days between two dates.
	 *  -----------------------------------------------------------------------
	 */
	var computeDuration = function(dateStart, dateEnd) {
		var ageDifMs = new Date(dateEnd) - new Date(dateStart);
		var ageDate = new Date(ageDifMs);
		var years = Math.abs(ageDate.getUTCFullYear() - 1970);
		var ageDate = new Date(ageDate - new Date(years,0,0));
		var months = ageDate.getUTCMonth();
		var ageDate = new Date(ageDate - new Date(0,months,0));
		var days = ageDate.getUTCDate();
		return ""+years+" an(s), "+months+" mois, "+days+" jour(s)";
	}
	/** -----------------------------------------------------------------------
	 * Compute the duration of the diabetes symptoms from the recorded onset
	 * to when the diagnostic is issued.
	 *  -----------------------------------------------------------------------
	 */
	var computeSymptomsDuration = function(){
		if(typeof $scope.diagDiabete !== 'undefined'){
			var end = $scope.diagDiabete.issued;
			if(typeof $scope.diabete !== 'undefined'){
				var start = $scope.diabete.onsetDateTime;
				return computeDuration(start, end);
			}
		}
	}

	/** -----------------------------------------------------------------------
	 * Search for the conditions "type 1 diabetes"
	 * -----------------------------------------------------------------------
	 */
	var findDiabete = function() {
		for (var i = 0, len = $scope.conditions.length; i < len; i++) {
			var condition = $scope.conditions[i];
			for (var k = 0, klen = condition.code.coding.length; k < klen; k++) {
				var coding = condition.code.coding[k];
				if (coding.code == '46635009'
						&& coding.system == 'http://snomed.info/sct') {
					return condition;
				}
				if (coding.display.search('Diabetes mellitus') != -1) {
					return condition;
				}
			}
		}
		return {};
	};

	/** -----------------------------------------------------------------------
	 * Search for a diabete diagnostic
	 *  -----------------------------------------------------------------------
	 */
	var findDiagDiabete = function() {
		for (var i = 0, len = $scope.diagnostics.length; i < len; i++) {
			var diag = $scope.diagnostics[i];
			for (var k = 0, klen = diag.codedDiagnosis.length; k < klen; k++) {
				var coded = diag.codedDiagnosis[k];
				for (var l = 0, llen = coded.coding.length; l < llen; l++) {
					var coding = coded.coding[l];
					if ((coding.code == '444073006' || coding.code == '444074000')
							&& coding.system == 'http://snomed.info/sct') {
						return diag;
					}
					if (coding.display.toLowerCase().search(
							'diabetes mellitus') != -1) {
						return diag;
					}
				}
			}
		}
		return {};
	};

	/** -----------------------------------------------------------------------
	 * Find since how long the patient has been diabetic.
	 *  -----------------------------------------------------------------------
	 */
	$scope.findStartDiabete = function() {
		if(typeof $scope.diabete !== 'undefined'){
			if ('onsetDateTime' in $scope.diabete) 
				return $scope.calculateAge($scope.diabete.onsetDateTime);
			if('onsetPeriod' in $scope.diabete){
				return $scope.calculateAge($scope.diabete.onsetPeriod.start);				
			}
			if('onsetQuantity' in $scope.diabete){
				return $scope.diabete.onsetQuantity.value;				
			}
		}
		return 'unknow';		
	}
	/** -----------------------------------------------------------------------
	 * Check if the diabetes was discovered when the patient was admitted in
	 * the hospital.
	 *  -----------------------------------------------------------------------
	 */
	
	$scope.hospitalizedForDiabete = function(){
		if(typeof $scope.diabDiagEncounter !== 'undefined'){
			if('hospitalization' in $scope.diabDiagEncounter)
				if($scope.diabDiagEncounter.hospitalization.admittingDiagnosis.length > 0) {
					return "Oui";
				}	
		}
		return "Non";
	}
	
	/** -----------------------------------------------------------------------
	 * Search all the symptoms of the diabete.
	 *  -----------------------------------------------------------------------
	 */
	var findDiabeteSymptoms = function() {
		var symptoms = [];
		if(typeof $scope.diabete !== 'undefined') {
			if('evidence' in $scope.diabete) {
				for (var i = 0, len = $scope.diabete.evidence.length; i < len; i++) {
					if('code' in $scope.diabete.evidence[i]){						
						if('text' in $scope.diabete.evidence[i].code){
							symptoms.push($scope.diabete.evidence[i].code.text);							
						}
						else if('coding' in  $scope.diabete.evidence[i].code) {
							var coding = $scope.diabete.evidence[i].code.coding;
							if(coding.length > 0 && 'display' in coding[0]){
								symptoms.push(coding[0].display);
							}
						}						
					}
					else if('detail' in $scope.diabete.evidence[i]){
						var detail = $scope.diabete.evidence[i].detail;
						for (var k = 0, klen = detail.length; k < klen; k++) {
							symptoms.push('<a href="../rest/' + detail[k] +'">(' + 
									detail[k] + ')</a>');
						}
					}
				}
			}		
		}
		if(typeof $scope.diagDiabete !== 'undefined'){
			if('result' in $scope.diagDiabete){
				for (var i = 0, len = $scope.diagDiabete.result.length; i < len; i++) {
					symptoms.push('<a href="../rest/' + $scope.diagDiabete.result[i] +
							'">(' + $scope.diagDiabete.result[i] + ')</a>');					
				}
			}
		}
		return symptoms;
	}

});
