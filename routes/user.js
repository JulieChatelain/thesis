
var userCtrl = require('../databases/controllers/userCtrl');
var restCtrl = require('../databases/controllers/RESTController');

exports.register = function(req, res) {
	
	// Create user
	userCtrl.createUser(req, res, function(user, patient, practitioner){
		// Check if creation done without errors
		if(user == null)	{
			console.log("Fail creating user");
	        res.json({
	            loggedIn: false,
	            message: req.message
	        });			
		}
		else{
			// If user is a patient
			if(patient != null){
				console.log("Saving patient");
				req.params.model = 'Patient';
				req.body = patient;
				// Create and save the patient
				restCtrl.create(req, res, function(objpatient) {
					if (objpatient.constructor.name.includes("Error")) {
						console.log("Error while saving patient: " + objpatient);
				        res.json({
				            loggedIn: false,
				            message: req.message + " " + objpatient
				        });
					} else {
						// Add the patient resource as reference to the user
						var patientId = objpatient;
						user.reference.push(patientId);
						// If user is also a practitioner
						if(practitioner != null){
							req.params.model = 'Practitioner';
							req.body = practitioner;
							// Create and save the practitioner
							restCtrl.create(req, res, function(objPractitioner) {
								if (objPractitioner.constructor.name == "Error") {
									console.log("Error while saving practitioner: " + objPracitioner);
							        res.json({
							            loggedIn: false,
							            message: req.message + " " + objPractitioner
							        });
								} else {
									// Add the practitioner resource as reference to the user
									var practitionerId = objPractitioner;
									user.reference.push(practitionerId);
									// Save the user
									userCtrl.saveUser(user, res);
								}
							});
						}else{
							// Save the user
							userCtrl.saveUser(user, res);
						}
					}
				});
			// If user is only a practitioner
			}else{
				if(practitioner != null){
					req.params.model = 'Practitioner';
					req.body = practitioner;
					// Create and save the practitioner
					restCtrl.create(req, res, function(objPractitioner) {
						if (objPractitioner.constructor.name == "Error") {
							console.log("Error while saving practitioner: " + objPracitioner);
					        res.json({
					            loggedIn: false,
					            message: req.message + " " + objPractitioner
					        });
						} else {
							// Add the practitioner resource as reference to the user
							var practitionerId = objPractitioner;
							user.reference.push(practitionerId);
							// Save the user
							userCtrl.saveUser(user, res);
						}
					});				
				}
			}
		}
	});	
}

exports.login = function(req, res) {
	userCtrl.findUser(req,res);
};
