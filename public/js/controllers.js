'use strict';

/* Controllers */

app.controller('AuthenticationCtrl', ['$scope', '$log', '$location', '$localStorage', 'Authentication', function($scope, $log, $location, $localStorage, Authentication) {
	
	$scope.$log = $log;
	
    $scope.token = $localStorage.token;
    
    /**
     * User register data
     */
	$scope.data = {
			userKind : 'patient',
			gender : 'male',
			eMail : '',
			password : '',
			confirmPass : '',
			nameFamily : '',
			nameGiven : '',
			birthDate : '',
			job : '',
			address : '',
			contactTel : '',
			telType : 'home',
			contactEmail : '',
			emailType : 'home',
			speakFrench : true,
			speakEnglish : false,
			speakDutch : false,
			speakGerman : false,
			mainLanguage : 'fr',
			speciality : '',
			workLocation : '',
			workTel : ''
	};
	
	$scope.bgCol = {"background-color" : "#f3e5f5"};
	$scope.matchingPasswords = false;
	$scope.message = "";
	
	/**
	 * Check if the two passwords match.
	 * Change the background color accordingly.
	 */
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

	/**
	 * Login the user.
	 */
    $scope.login = function() {
        var data = {
            email: $scope.data.email,
            password: $scope.data.password
        }

        Authentication.login(data, function(res) {
            $localStorage.token = res.data.token;
            window.location = "/";   
        }, function() {
            $scope.message = 'Failed to login';
        })
    };

	/**
	 * Register the user.
	 */
    $scope.register = function() {
    	var data = $scope.data;
        Authentication.register(data, function(res) {
            $localStorage.token = res.data.token;
            window.location = "/"  
        }, function() {
        	$scope.message = 'Failed to register';
        })
    };

    /**
     * Log out function.
     */
    $scope.logout = function() {
    	Authentication.logout(function() {
            window.location = "/"
        }, function() {
            alert("Failed to logout!");
        });
    };
}])
.controller('HomeCtrl', ['$scope', '$log' , '$location', 'Authentication', function($scope, $log, $location, Authentication) {

     
}])
.controller('MyEHRCtrl', ['$scope', '$log' , '$location', 'Rest', function($scope, $log, $location, Rest) {

     
}])
.controller('ProfileCtrl', ['$scope', '$log' , '$location', 'Rest', function($scope, $log, $location, Rest) {

     
}])
.controller('ParametersCtrl', ['$scope', '$log' , '$location', 'Rest', function($scope, $log, $location, Rest) {

     
}])
.controller('PatientsCtrl', ['$scope', '$log', '$location', 'Rest', function($scope, $log, $location, Rest) {
	$scope.$log = $log;
	$scope.patients = [];
	$scope.nameFilter = '';
	

	/** -----------------------------------------------------------------------
	 * Get the patient list
	 *  -----------------------------------------------------------------------
	 */
	Rest.patients(function(res) {
		$scope.patients = res.data;		
    }, function() {
        $scope.message = 'Failed to load the patients list.';
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
}])
.controller('EHRCtrl', ['$scope', '$log', '$location', '$routeParams', '$sce', 'Rest', 'utils', function($scope, $log, $location, $routeParams, $sce, Rest, utils) {
	
	$scope.$log = $log;
	$scope.isPatientDiabetic = false;
	$scope.nameFilter = '';

	$scope.calculateAge = utils.calculateAge;
	$scope.dateToString = utils.dateToString;
	
	/** -----------------------------------------------------------------------
	 * Get the ehr options
	 *  -----------------------------------------------------------------------
	 */
	Rest.menu(function(res) {
		$scope.ehrMenuOptions = res.data;
		for (var i = 0; i < $scope.ehrMenuOptions.length; i++) {
			$scope.ehrMenuOptions[i].show = true;
			$scope.ehrMenuOptions[i].unfold = true;
		}		
    }, function() {
        $scope.message = 'Failed to load the menu.';
    });
	
	/** -----------------------------------------------------------------------
	 * Get the patient list
	 *  -----------------------------------------------------------------------
	 */
	Rest.patients(function(res) {
		$scope.patients = res.data;

		// Select a patient
		if($routeParams != 'undefined' && $routeParams.id != 'undefined'){
			$scope.patientId = 'Patient/' + $routeParams.id;
			$scope.selectPatient($scope.patientId);
		}
		
    }, function() {
        $scope.message = 'Failed to load the patients list.';
    });
	
	/** -----------------------------------------------------------------------
	 * Select another patient
	 *  -----------------------------------------------------------------------
	 */
	$scope.selectPatient = function selectPatient(id) {
		$scope.patientId = id;
		$scope.isPatientDiabetic = false;

		// Get the patient according to his id
		Rest.patient($scope.patientId, function(res) {
			$scope.patient = res.data;
	    }, function() {
	        $scope.message = 'Failed to load the patient.';
	    });
		
		// Get all the conditions of this patient
		var condition = 'condition?patient={"reference":"'
			+ encodeURIComponent($scope.patientId) + '"}';
		Rest.resource(condition, function(res) {
			$scope.conditions = res.data;
			// search for the record of the diabete condition
			$scope.diabete = utils.findDiabete($scope.conditions);
			if($scope.diabete != null){
				$scope.isPatientDiabetic = true;
				// update the diabete symptoms list
				$scope.diabeteSymptoms = utils.findDiabeteSymptoms($scope.diabete, $scope.diagDiabete);
				// compute the aproximate duration of the symptoms
				$scope.symptomsDuration = utils.computeSymptomsDuration($scope.diagDiabete, $scope.diabete);
			}
	    }, function() {
	        $scope.message = 'Failed to load the patient\'s conditions.';
	    });
		
		// Get all the diagnostic reports of the patient
		var diagnostic = 'diagnosticreport?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		Rest.resource(diagnostic, function(res) {
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
				var encounter = ''+ $scope.diagDiabete.encounter.reference + '';
				Rest.resource(encounter, function(res) {
					$scope.diabDiagEncounter = res.data;
					// check if the patient was hospitalized
					$scope.hospitalized = utils.hospitalizedForDiabete($scope.diabDiagEncounter);
			    }, function() {
			        $scope.message = 'Failed to load the encounter establishing the diagnosis.';
			    });
			}
	    }, function() {
	        $scope.message = 'Failed to load the diagnostics.';
	    });
		
		// Get all the observations for this patient
		var observation = 'observation?subject={"reference":"'
				+ encodeURIComponent($scope.patientId) + '"}';
		Rest.resource(observation, function(res) {
			$scope.observations = res.data;
			// classify the observations	
			var result = utils.classifyObservations($scope.observations);
			
			$scope.tobaccoHistory = result.tobaccoHistory;
			$scope.tobaccoUse = result.tobaccoUse;
			$scope.riskFactors = result.riskFactors;
			$scope.hba1c = result.hba1c;
	    }, function() {
	        $scope.message = 'Failed to load the observations.';
	    });
		
		// Get all prescriptions for this patient
		var prescription = 'MedicationOrder?patient={"reference":"'
			+ encodeURIComponent($scope.patientId) + '"}';
		Rest.resource(prescription, function(res) {
			$scope.prescriptions = res.data;
	    }, function() {
	        $scope.message = 'Failed to load the prescriptions.';
	    });
		
		
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
}]);