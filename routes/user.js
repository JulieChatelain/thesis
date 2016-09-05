
var userCtrl = require('../databases/controllers/userCtrl');
var restCtrl = require('../databases/controllers/RESTController');
var jwt = require('jsonwebtoken');

//-----------------------------------------------------------------------------
//---------------------- Authorization functions ------------------------------
//-----------------------------------------------------------------------------

/**
 * Approve an authorization request
 */
exports.approveAccess = function(req, res){
	var user = req.user;
	console.log("1 approving auth for: " + req.body.practitionerId);
	userCtrl.findAuthorizations(user.reference.patientId, function(auth){
		if (auth == null) {
			res.json({success: false, message : res.__('ErrorAuthNotFound')});
		} else {
			userCtrl.approveAuthorization(res, req.body.practitionerId, auth, function(success, msg){
				if(success){
					userCtrl.findAuthorizations(req.body.practitionerId, function(auth2){
						if (auth2 == null) {
							res.json({success: false, message : res.__('ErrorAuthNotFound')});
						} else {
							userCtrl.approveAuthorization(res, user.reference.patientId, auth2, function(success2, msg2){
								if(success2){
									res.json({success: true, message : msg2});
								}else{
									res.json({success: false, message : msg2});
								}
							});
						}
					});
				}else{
					res.json({success: false, message : msg});
				}
			});
		}
	});
}

/**
 * Request access to a patient data
 */
exports.requestAccess = function(req, res){
	userCtrl.requestAccess(req,res);
}
/**
 * Change the level of access of a practitioner to a patient data
 */
exports.changeAccess = function(req, res){
	userCtrl.changeAccess(req,res);
}
/**
 * Remove the access of a practioner to a patient data
 */
exports.removeAccess = function(req, res){
	userCtrl.removeAccess(req,res);
}

/**
 * List all the authorization 
 */
exports.listAccess = function(req, res){
	var user = req.user;
	userCtrl.findAuthorizations(req.body.refId, function(auth){
		if (auth != null) {
			res.json({
				success : true,
				accessList : auth
			});
		} else {
			res.json({
				success : false,
				message : "Couldn't find access list"
			});
		}
	});
}

//-----------------------------------------------------------------------------
//--------------------------- User functions ----------------------------------
//-----------------------------------------------------------------------------


/**
 * Create a new user
 */
exports.register = function(req, res) {
	
	// Create user
	userCtrl.createUser(req, res, function(user, patient, practitioner){
		console.log("User: " + JSON.stringify(user));
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
						user.reference.patientId = patientId;
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
									user.reference.practitionerId = practitionerId;
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
							var practitionerId = objPractitioner;
							user.reference.practitionerId = practitionerId;
							// Save the user
							userCtrl.saveUser(user, res);
						}
					});				
				}
			}
		}
	});	
}

/**
 * Find the user in the DB and send back the token.
 */
exports.login = function(req, res) {
	userCtrl.findUser(req, res, function(user, userToken, message){
		if (user != null) {
			res.json({
				loggedIn : true,
				userData : user,
				token : userToken
			});
		} else {
			res.json({
				loggedIn : false,
				message : message
			});
		}
	});
};

/**
 * change the user password
 */
exports.changePassword = function(req, res) {
	if(req.body.pass == req.body.confirmPass){
		userCtrl.findUser(req, res, function(user, userToken, message){
			if (user != null) {
				user.password = req.body.pass;
				user.save(function(err, savedUser) {
					if (err) {
						console.log("Error While Saving user: " + err);
						res.json({
							success: false,
							message : err
						});
					} else {
						var userToken = jwt.sign(user, process.env.JWT_SECRET,{
					          expires: 600 // in minute ( = 10 hours)
				        });
						res.json({
							success: true,
							userData : savedUser,
							token : userToken,
							message: res.__('PasswordChanged')
						});
					}
				});
			} else {
				res.json({
					success : false,
					message : message
				});
			}
		});
	}else{
		res.json({
			success : false,
			message : res.__('WrongConfirmPass')
		});
	}
};

/**
 * Update the personal informations of the user.
 */
exports.updateProfile = function(req, res) {
	// If the user is a patient
	// Update the informations in the patient resource
	if(req.user.isPatient){ 
		req.params.model = "Patient";
		var id = req.user.reference.patientId.split("/")[1];
		// search for the original resource
		restCtrl.read(req, res, id, function(resource){
			if (resource.constructor.name.includes("Error")) {
				console.log("Update error : " + resource);
				res.send(500);
			} else {
				// create a patient resource from the data sent
				var patient = userCtrl.createPatient(req);
				req.body = patient;
				// update the original with those new data
				restCtrl.update(req, res,function(response, status){
					if(!req.user.isPractitioner){
						res.status(status).send(response);
					}else{
						// Also update the information in the user's practitioner resource
						// if there wasn't a problem with the update of the patient resource
						if(status == 200){
							req.params.model = "Practitioner";
							var id2 = req.user.reference.practitionerId.split("/")[1];
							restCtrl.read(req, res, id2, function(resource2){
								if (resource2.constructor.name.includes("Error")) {
									console.log("Update error : " + resource2);
									res.send(500);
								} else {
									var pract = userCtrl.createPractitioner(req);
									req.body = pract;
									restCtrl.update(req, res,function(response2, status2){
										res.status(status2).send(response2);
									});
								}
							});	
						}
						else {
							res.status(status).send(response);
						}
						
					}
				});
			}
		});
	}
	// If the user is only a practitioner
	// Update the informations in the practitioner resource
	else {
		var id = req.user.reference.practitionerId.split("/")[1];
		req.params.model = "Practitioner";
		// search for the original resource
		restCtrl.read(req, res, id, function(resource){
			if (resource.constructor.name.includes("Error")) {
				console.log("Update error : " + resource);
				res.sendStatus(500);
			} else {
				// create a patient resource from the data sent
				var pract = userCtrl.createPractitioner(req);
				req.body = pract;
				// update the original with those new data
				restCtrl.update(req, res,function(response, status){
					res.status(status).send(response);
				});
			}
		});		
	}
}





