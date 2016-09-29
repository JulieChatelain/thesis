'use strict';

/* Controllers */

app.controller('AuthenticationCtrl', ['$scope', '$log', '$location', '$localStorage', 'Authentication', function($scope, $log, $location, $localStorage, Authentication) {
	
	$scope.$log = $log;
	
    $scope.token = $localStorage.token;
	$scope.user = Authentication.user;
    
    /**
     * User register data
     */
	$scope.data = {
			userKind : 'patient',
			gender : 'male',
			email : '',
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
			$scope.bgCol["background-color"] = "#E1F5FE";
			$scope.matchingPasswords = true;
		}else{
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
        	$scope.user = Authentication.user;
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
        	$scope.user = Authentication.user;
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
    		$scope.user = Authentication.user;
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
.controller('ProfileCtrl', ['$scope', '$log' , '$location', '$localStorage', 'Rest', 'Authentication', function($scope, $log, $location, $localStorage, Rest, Authentication) {
	$scope.$log = $log;
	$scope.user = Authentication.user;

	$scope.bgCol = {"background-color" : "#f3e5f5"};
	$scope.matchingPasswords = false;
	$scope.message = "";
	
	/**
	 * Check if the two passwords match.
	 * Change the background color accordingly.
	 */
	$scope.checkPasswordMatch = function(password1, password2){
		if(password1.length > 6 && password2.length > 6 && password1 == password2){
			$scope.bgCol["background-color"] = "#E1F5FE";
			$scope.matchingPasswords = true;
		}else{
			$scope.bgCol["background-color"] = "#f3e5f5";
			$scope.matchingPasswords = false;
			
		}
	};
	 /**
     * User profile data
     */
	$scope.data = {
			gender : 'male',
			email : '',
			nameFamily : '',
			nameGiven : '',
			birthDate : new Date(),
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
	
	$scope.password = { 
			password: '', 
			pass: '',
			confirmPass: '',
			email: $scope.user.email
			};
	
	/**
	 * Take a practitioner or patient resource as input and
	 * extract the basic data needed to fill the form.
	 */
	var fillPersonData = function(person){
		$scope.data.email = $scope.user.email;
		// Name
		$scope.data.nameFamily = person.name.family[0];
		$scope.data.nameGiven = person.name.given[0];
		// Birthday
		$scope.data.birthDate = new Date(person.birthDate);
		// Gender
		$scope.data.gender = person.gender;
		// Job
		if($scope.user.isPatient)
			$scope.data.job = person.profession[0];
		else
			$scope.data.job = $scope.practitioner.practitionerRole[0].specialty[0].text;
		
		// Phone and email
		for (var i = 0; i < person.telecom.length; i++) {
			if(person.telecom[i].system == "phone") {
				if(person.telecom[i].use == "work" && $scope.user.isPractitioner) {
					$scope.data.workTel = person.telecom[i].value;
				}
				else{
					$scope.data.contactTel = person.telecom[i].value;
					$scope.data.typeTel = person.telecom[i].use;				
				}
			}
			if(person.telecom[i].system == "email") {
				$scope.data.contactEmail = person.telecom[i].value;
				$scope.data.emailType = person.telecom[i].use;					
			}
		}
		
		// Address
		$scope.data.address = person.address[0].text;
		
		// Languages 
		for (var i = 0; i < person.communication.length; i++) {
			if(person.communication[i].language.coding[0].code == "fr")
				$scope.data.speakFrench = true;
			if(person.communication[i].language.coding[0].code == "en")
				$scope.data.speakEnglish = true;
			if(person.communication[i].language.coding[0].code == "de")
				$scope.data.speakGerman = true;
			if(person.communication[i].language.coding[0].code == "nl")
				$scope.data.speakDutch = true;
			if(person.communication[i].preferred)
				$scope.data.mainLanguage = person.communication[i].language.coding[0].code;
		}
		
	};
	
	// Get practitioner informations
	if($scope.user.isPractitioner){
		Rest.resource($scope.user.reference.practitionerId, function(res) {
			$scope.practitioner = res.data;
			// Fill the update form with the practitioner informations :
			fillPersonData($scope.practitioner);
			// Plus the information special practitioner
			$scope.data.speciality = $scope.practitioner.practitionerRole[0].specialty[0].text;
			$scope.data.workLocation = $scope.practitioner.practitionerRole[0].location[0].display;
	    }, function() {
	        $scope.message = 'Failed to load the practitioner profile.';
	    });
		
		// Get authorizations received		
		var data = {refId: $scope.user.reference.practitionerId};
		Rest.authorizations(data, function(res) {
			var accessList = res.data.accessList.access;
			var iMax = accessList.length;
			$scope.practAuth = []
			$scope.pendingPractAuth = []
			for (var i = 0; i < iMax; i++) 
				if(accessList[i].isApproved)
					$scope.practAuth.push(accessList[i]);	
				else
					$scope.pendingPractAuth.push(accessList[i]);	
	    }, function() {
	        $scope.message = 'Failed to load the practitioner authorizations.';
	    });		
	    
	}

	// Get patient informations
	if($scope.user.isPatient){
		Rest.resource($scope.user.reference.patientId, function(res) {
			$scope.patient = res.data;
			// Fill the update form with the patient informations :
			fillPersonData($scope.patient);
	    }, function() {
	        $scope.message = 'Failed to load the patient profile.';
	    });
		// Get authorizations given
		var data = {refId: $scope.user.reference.patientId};
		Rest.authorizations(data, function(res) {
			var accessList = res.data.accessList.access;
			$scope.patientAuth = []
			$scope.pendingPatientAuth = []
			var iMax = accessList.length;
			for (var i = 0; i < iMax; i++) 
				if(accessList[i].isApproved)
					$scope.patientAuth.push(accessList[i]);	
				else
					$scope.pendingPatientAuth.push(accessList[i]);	
	    }, function() {
	        $scope.message = 'Failed to load the patient authorizations.';
	    });
		
	}
	
	
	/**
	 * Revoke an authorization
	 */
	$scope.revoke = function(authId){
		data = {
				doctorId : authId,
				patientId : $scope.user.reference.patientId
		};
		Rest.removeAccess(data, function(res) {
			$scope.message = res.data.message;
			reloadAuth();
	    }, function() {
	        $scope.message = res.data.message;
	    });
	};
	

	/**
	 * Renounce an authorization
	 */
	$scope.renounce = function(authId){
		data = {
				doctorId : $scope.user.reference.practitionerId,
				patientId : authId
		};
		Rest.removeAccess(data, function(res) {
			$scope.message = res.data.message;
			reloadAuth();
	    }, function() {
	        $scope.message = res.data.message;
	    });
	};
	
	
	/**
	 * Approve an authorization
	 */
	$scope.approve = function(pId){
		console.log("pId : " + pId);
		var data =  {
			practitionerId : pId
		};
		Rest.approveAccess(data, function(res) {
			$scope.message = res.data.message;
			reloadAuth();
	    }, function() {
	        $scope.message = res.data.message;
	    });
	};
	
	/**
	 * Change the user's password
	 */
	$scope.changePassword = function() {
		Rest.changePassword($scope.password, function(res) {
			$scope.message = res.data.message;
            $localStorage.token = res.data.token;
        	$scope.user = Authentication.user;
	    }, function() {
	    	$scope.message = res.data.message;
	    });
	};
	
	/**
	 * Update the user's profile informations
	 */
	$scope.updateProfile = function() {
		Rest.updateProfile($scope.data, function(res) {
			$scope.message = res.data.message;
	    }, function() {
	        $scope.message =  res.data.message;
	    });
	};
	
	/**
	 * Reload the authorization to see possible changes.
	 */
	var reloadAuth = function(){
		// Get authorizations given
		var data = {refId: $scope.user.reference.patientId};
		Rest.authorizations(data, function(res) {
			var accessList = res.data.accessList.access;
			$scope.patientAuth = []
			$scope.pendingPatientAuth = []
			var iMax = accessList.length;
			for (var i = 0; i < iMax; i++) 
				if(accessList[i].isApproved)
					$scope.patientAuth.push(accessList[i]);	
				else
					$scope.pendingPatientAuth.push(accessList[i]);	
	    }, function() {
	        $scope.message = 'Failed to load the patient authorizations.';
	    });
		// Get authorizations received		
		data = {refId: $scope.user.reference.practitionerId};
		Rest.authorizations(data, function(res) {
			var accessList = res.data.accessList.access;
			var iMax = accessList.length;
			$scope.practAuth = []
			$scope.pendingPractAuth = []
			for (var i = 0; i < iMax; i++) 
				if(accessList[i].isApproved)
					$scope.practAuth.push(accessList[i]);	
				else
					$scope.pendingPractAuth.push(accessList[i]);	
	    }, function() {
	        $scope.message = 'Failed to load the practitioner authorizations.';
	    });
	};
	
}])
.controller('ParametersCtrl', ['$scope', '$log' , '$location', 'Rest', function($scope, $log, $location, Rest) {

     
}])
.controller('PatientsCtrl', ['$scope', '$log', '$location', 'Rest', function($scope, $log, $location, Rest) {
	$scope.$log = $log;
	$scope.patients = [];
	$scope.myPatients = [];
	$scope.patientsNameFilter = '';
	$scope.myPatientsNameFilter = '';

	/** -----------------------------------------------------------------------
	 * Get the patients list
	 *  -----------------------------------------------------------------------
	 */
	Rest.patients(function(res) {
		$scope.patients = res.data;	
		 var myPatients = [];
		// Find the doctor's own patients in the list.
		// It's those with an access level higher than 2.
		var iMax = $scope.patients.length;
		for (var i = 0; i < iMax; i++) {
			if($scope.patients[i].accessLevel > 2){
				myPatients.push($scope.patients[i]);	
			}
		}
		$scope.myPatients = myPatients;
		
    }, function() {
        $scope.message = 'Failed to load the patients list.';
    });

	/** -----------------------------------------------------------------------
	 * Request access to a patient
	 *  -----------------------------------------------------------------------
	 */
	$scope.requestAccess = function(patient){
		var data = {
				patientId : patient,
				accessLevel : 5
				};
		Rest.requestAccess(data, function(res) {
			$scope.message = res.data.message;
	    }, function() {
	        $scope.message = 'Failed to load the practitioner authorizations.';
	    });
	};
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
	
	$scope.showPatientData = true;
	
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
		var result = res.data;
		$scope.patients = [];
		// Find the doctor's own patients in the list.
		// It's those with an access level higher than 2.
		var iMax = result.length;
		for (var i = 0; i < iMax; i++) 
			if(result[i].accessLevel > 1)
				$scope.patients.push(result[i]);	
		
		// Select a patient
		if(typeof $routeParams != 'undefined' && typeof $routeParams.id != 'undefined'){
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
		$scope.encounter = undefined;

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
		
		// Get all the encounters concerning this patient
		var encounter = 'Encounter?patient={"reference":"'
			+ encodeURIComponent($scope.patientId) + '"}';
		Rest.resource(encounter, function(res) {
			$scope.encounters = res.data;
	    }, function() {
	        $scope.message = 'Failed to load the encounter.';
	    });
		
	};
	
	/** -----------------------------------------------------------------------
	 *  Select an encounter to display
	 *  -----------------------------------------------------------------------
	 */
	$scope.selectEncounter = function(id) {
		// find the encounter in our list
		var len = $scope.encounters.length;
		for(var i = 0; i < len; ++i){
			if($scope.encounters[i].id== id){
				$scope.encounter = $scope.encounters[i];
				$scope.showPatientData = false;
			}
		}
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