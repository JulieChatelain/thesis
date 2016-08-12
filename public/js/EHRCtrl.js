app.controller('EHRCtrl',function($log, $location, $localStorage, $scope, $http, $sce, utils) {
	$scope.$log = $log;
	$scope.isPatientDiabetic = false;
	$scope.nameFilter = '';
	$scope.host = $location.host();

	$scope.calculateAge = utils.calculateAge;
	$scope.dateToString = utils.dateToString;
	
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
			$scope.diabete = utils.findDiabete($scope.conditions);
			if($scope.diabete != null){
				$scope.isPatientDiabetic = true;
				// update the diabete symptoms list
				$scope.diabeteSymptoms = utils.findDiabeteSymptoms($scope.diabete, $scope.diagDiabete);
				// compute the aproximate duration of the symptoms
				$scope.symptomsDuration = utils.computeSymptomsDuration($scope.diagDiabete, $scope.diabete);
			}
		});
		// Get all the diagnostic reports of the patient
		var req3 = '/rest/diagnosticreport?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req3).then(function(res) {
			$scope.diagnostics = res.data;
			// Search for the diagnostic confirming the diabete
			$scope.diagDiabete = utils.findDiagDiabete($scope.diagnostics);
			if($scope.diagDiabete != null){
				$scope.isPatientDiabetic = true;	
				// update the diabete symptoms list
				$scope.diabeteSymptoms = utils.findDiabeteSymptoms($scope.diabete, $scope.diagDiabete);
				// compute the aproximate duration of the symptoms
				$scope.symptomsDuration = utils.computeSymptomsDuration($scope.diagDiabete, $scope.diabete);
				// find encounter where diabetes diagnosis was established
				var req4 = '/rest/'+ $scope.diagDiabete.encounter.reference + '';
				$http.get(req4).then(function(response) {
					$scope.diabDiagEncounter = response.data;
					// check if the patient was hospitalized
					$scope.hospitalized = utils.hospitalizedForDiabete($scope.diabDiagEncounter);
				});
			}
		});

		// Get all the observations for this patient
		var req4 = '/rest/observation?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		$http.get(req4).then(function(response) {
			$scope.observations = response.data;
			// classify the observations	
			var result = utils.classifyObservations($scope.observations);
			
			$scope.tobaccoHistory = result.tobaccoHistory;
			$scope.tobaccoUse = result.tobaccoUse;
			$scope.riskFactors = result.riskFactors;
			$scope.hba1c = result.hba1c;
		});
		
		// Get all prescriptions for this patient
		var req5 = '/rest/MedicationOrder?patient={"reference":"'
			+ encodeURIComponent($scope.patientId) + '"}';
		$log.log("req5: "+req5);
		$http.get(req5).then(function(response) {
			$scope.prescriptions = response.data;
		});
		
		/*
		//Retrieving a cookie
		var optionsCookie = $cookies.get('ehrOptionsPatient'+$scope.patients[id]._id.str);
		// Setting a cookie
		$cookies.put('myFavorite', 'oatmeal');
		*/
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
	 * Display the html formatted text of a resource
	 *  -----------------------------------------------------------------------
	 */
	$scope.display = function(resource) {
		return $sce.trustAsHtml(resource.text.div);
	}

	/** -----------------------------------------------------------------------
	 * Display the first "display" of the code of a codeable concept
	 *  -----------------------------------------------------------------------
	 */
	$scope.displayCC = utils.displayCodeableConcept;
});
