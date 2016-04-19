var app = angular.module("ehr", [ 'ngCookies' ]);

app.controller('EHRCtrl',function($log, $location, $scope, $http, $cookies) {
	$scope.$log = $log;
	$scope.isPatientDiabetic = false;
	$scope.nameFilter = '';
	
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
			// Select a patient

			var path = $location.path().split("/");
			if(path.length > 2)
				$scope.patientId = path[path.length-2]+ "/" +path[path.length-1];
			
			if(path.length < 2 && $scope.patients.length > 0)
				$scope.selectPatient($scope.patients[0].id);
			else
				$scope.selectPatient($scope.patientId);
		});
	
	/** -----------------------------------------------------------------------
	 * Select another patient
	 *  -----------------------------------------------------------------------
	 */
	$scope.selectPatient = function selectPatient(id) {
		$scope.patientId = id;
		$location.path("/"+id);
		$scope.isPatientDiabetic = false;

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
			$scope.diabete = findDiabete($scope.conditions);
			if($scope.diabete != null){
				$scope.isPatientDiabetic = true;
				// update the diabete symptoms list
				$scope.diabeteSymptoms = findDiabeteSymptoms($scope.diabete, $scope.diagDiabete);
				// compute the aproximate duration of the symptoms
				$scope.symptomsDuration = computeSymptomsDuration($scope.diagDiabete, $scope.diabete);
			}
		});
		// Get all the diagnostic reports of the first patient
		var req3 = '/rest/diagnosticreport?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req3).then(function(res) {
			$scope.diagnostics = res.data;
			// Search for the diagnostic confirming the diabete
			$scope.diagDiabete = findDiagDiabete($scope.diagnostics);
			if($scope.diagDiabete != null){
				$scope.isPatientDiabetic = true;	
				// update the diabete symptoms list
				$scope.diabeteSymptoms = findDiabeteSymptoms($scope.diabete, $scope.diagDiabete);
				// compute the aproximate duration of the symptoms
				$scope.symptomsDuration = computeSymptomsDuration($scope.diagDiabete, $scope.diabete);
				// find encounter where diabetes diagnosis was established
				var req4 = '/rest/'+ $scope.diagDiabete.encounter.reference + '';
				$http.get(req4).then(function(response) {
					$scope.diabDiagEncounter = response.data;
					// check if the patient was hospitalized
					$scope.hospitalized = hospitalizedForDiabete($scope.diabDiagEncounter);
				});
			}
		});

		// Get all the observations for this patient
		var req4 = '/rest/observation?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req4).then(function(response) {
			$scope.observations = response.data;
			// search for the history of tobacco use
			$scope.tobaccoHistory = findTobaccoHistory($scope.observations);
			// search for the current tobacco use
			$scope.tobaccoUse = findTobaccoUse($scope.observations);
		});
		
		// Get all prescriptions for this patient
		var req5 = '/rest/MedicationOrder?patient={"reference":"'
			+ encodeURIComponent($scope.patientId) + '"}';
		$log.log("req5: "+req5);
		$http.get(req5).then(function(response) {
			$scope.prescriptions = response.data;
		});
		
		
		// Retrieving a cookie
		// var optionsCookie = $cookies.get('ehrOptionsPatient'
		// +
		// $scope.patients[id]._id.str);
		// Setting a cookie
		// $cookies.put('myFavorite', 'oatmeal');
	};


	/** -----------------------------------------------------------------------
	 * Find since how long the patient has been diabetic.
	 *  -----------------------------------------------------------------------
	 */
	$scope.findStartDiabete = function() {
		if($scope.isPatientDiabetic == true && $scope.diabete != null && 
				typeof $scope.diabete !== 'undefined'){
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
	 * Find the observation corresponding to the history of tobacco use
	 *  -----------------------------------------------------------------------
	 */
	
	var findTobaccoUse = function(observations){
		if(typeof observations !== 'undefined'){
			for (var i = 0, len = observations.length; i < len; i++) {
				if(observations[i].code.coding.length > 0)
					if(observations[i].code.coding[0].code == '72166-2') {
						return observations[i];
					}	
			}
		}
		return {valueString: 'unknown'};		
	}
	

	var findTobaccoHistory = function(observations){
		if(typeof observations !== 'undefined'){
			for (var i = 0, len = observations.length; i < len; i++) {
				if(observations[i].code.coding.length > 0)
					if(observations[i].code.coding[0].code == '11367-0') {
						return observations[i];
					}	
			}
		}
		return {valueString: 'unknown'};		
	}

	/** -----------------------------------------------------------------------
	 * Compute the age from the birthday
	 *  -----------------------------------------------------------------------
	 */
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
	 * Compute the duration of the symptoms from the recorded onset
	 * to when the diagnostic is issued.
	 *  -----------------------------------------------------------------------
	 */
	var computeSymptomsDuration = function(diagnostic, condition){
		if(diagnostic != null && typeof diagnostic !== 'undefined'){
			var end = diagnostic.issued;
			if(condition != null && typeof condition !== 'undefined'){
				var start = condition.onsetDateTime;
				return computeDuration(start, end);
			}
		}
	}

	/** -----------------------------------------------------------------------
	 * Search for the conditions "type 1 diabetes"
	 * -----------------------------------------------------------------------
	 */
	var findDiabete = function(conditions) {
		for (var i = 0, len = conditions.length; i < len; i++) {
			var condition = conditions[i];
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
		return null;
	};

	/** -----------------------------------------------------------------------
	 * Search for a diabete diagnostic
	 *  -----------------------------------------------------------------------
	 */
	var findDiagDiabete = function(diagnostics) {
		for (var i = 0, len = diagnostics.length; i < len; i++) {
			var diag = diagnostics[i];
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
		return null;
	};
	

	/** -----------------------------------------------------------------------
	 * Check if the diabetes was discovered when the patient was admitted in
	 * the hospital.
	 *  -----------------------------------------------------------------------
	 */
	
	 var hospitalizedForDiabete = function(diabDiagEncounter){
		if(diabDiagEncounter != null && typeof diabDiagEncounter !== 'undefined'){
			if('hospitalization' in diabDiagEncounter)
				if(diabDiagEncounter.hospitalization.admittingDiagnosis.length > 0) {
					return "Oui";
				}	
		}
		return "Non";
	}
	
	/** -----------------------------------------------------------------------
	 * Search all the symptoms of the diabete.
	 *  -----------------------------------------------------------------------
	 */
	var findDiabeteSymptoms = function(diabete, diagDiabete) {
		var symptoms = [];
		if(diabete != null && typeof diabete !== 'undefined') {
			if('evidence' in diabete) {
				for (var i = 0, len = diabete.evidence.length; i < len; i++) {
					if('code' in diabete.evidence[i]){						
						if('text' in diabete.evidence[i].code){
							symptoms.push(diabete.evidence[i].code.text);							
						}
						else if('coding' in  diabete.evidence[i].code) {
							var coding = diabete.evidence[i].code.coding;
							if(coding.length > 0 && 'display' in coding[0]){
								symptoms.push(coding[0].display);
							}
						}						
					}
					else if('detail' in diabete.evidence[i]){
						var detail = diabete.evidence[i].detail;
						for (var k = 0, klen = detail.length; k < klen; k++) {
							symptoms.push('<a href="../rest/' + detail[k] +'">(' + 
									detail[k] + ')</a>');
						}
					}
				}
			}		
		}
		if(diagDiabete != null && typeof diagDiabete !== 'undefined'){
			if('result' in diagDiabete){
				for (var i = 0, len = diagDiabete.result.length; i < len; i++) {
					symptoms.push('<a href="../rest/' + diagDiabete.result[i] +
							'">(' + diagDiabete.result[i] + ')</a>');					
				}
			}
		}
		return symptoms;
	}

});
