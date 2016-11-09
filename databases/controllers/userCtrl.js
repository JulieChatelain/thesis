var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var restCtrl = require('./RESTController');

var TOKEN_EXPIRATION = 1;

var userForToken = function(user){
	var u = {
			created : user.created,
			isPractitioner : user.isPractitioner,
			isPatient: user.isPatient,
			language : user.language,
			password :  user.password,
			email: user.email,
			reference : user.reference,
			_id : user._id
	};
	
	return u;
};

//-----------------------------------------------------------------------------
//------------------------- User functions -------------------------------------
//-----------------------------------------------------------------------------

/**
 * Search for an user according to the password and email.
 * Return the user and his token.
 */
exports.findUser = function(req, res, next) {
	// Search the user
	User.findOne({
		email : req.body.email,
		password : req.body.password
	}, function(err, user) {
		if (err) {
			console.log("FindUser error: " + err);
			next(null, null, "FindUser error: " + err);
		} else {
			if (user) {
				var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
			          expires: TOKEN_EXPIRATION // in minute ( = 1 hour)
		        });
				next(user, userToken, '');
			} else {
				console.log("User not found.");
				next(null, null, res.__('Incorrect Mail or Password'));
			}
		}
	});
};

/**
 * Search for an user according to his patientId or his practitionerId.
 * Return the user and his token.
 */
exports.findUserViaRef = function(patientId, practitionerId, next) {
	// Search the user
	if(patientId != null){
		User.findOne({
			reference : {patientId : patientId}
		}, function(err, user) {
			if (err) {
				console.log("FindUser error: " + err);
				next(null, null, "FindUser error: " + err);
			} else {
				if (user) {
					var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
				          expires: TOKEN_EXPIRATION // in minute ( = 1 hour)
			        });
					next(user, userToken, '');
				} else {
					console.log("User not found.");
					next(null, null, res.__('Incorrect Mail or Password'));
				}
			}
		});
	}else{
		User.findOne({
			reference : {practitionerId : practitionerId}
		}, function(err, user) {
			if (err) {
				console.log("FindUser error: " + err);
				next(null, null, "FindUser error: " + err);
			} else {
				if (user) {
					var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
				          expires: TOKEN_EXPIRATION // in minute ( = 1 hour)
			        });
					next(user, userToken, '');
				} else {
					console.log("User not found.");
					next(null, null, res.__('Incorrect Mail or Password'));
				}
			}
		});
	}
};

/**
 * Create an user resource and return the token.
 */
exports.createUser = function(req, res, next) {
	// check if data is valid
	if (req.body.password < 7) 
		next(null, null, res.__("PasswordInvalid"));
	 else if (req.body.email == "") 
		next(null, null, res.__("EmailInvalid"));
	 else {
		// Check if user already exists
		var password = req.body.password;
		var email = req.body.email;

		User.findOne({email : email, password : password},function(err, user) {
			if (err) {
				console.log("Cannot create user...");
				next(null, null, res.__("InternalError"));
			} else {
				if (user) {
					console.log("User already exist");
					next(null, null, res.__("UserAlreadyExists"));
				} else {
					// Create new user
					var userModel = new User();
					userModel.email = email;
					userModel.password = password;
					userModel.created = new Date();
					if(req.body.language)
						userModel.language = req.body.language;

					userModel.created = new Date();

					var Patient = mongoose.model('Patient');
					var Practitioner = mongoose.model('Practitioner');
					var practitionerModel = new Practitioner();
					var patientModel = new Patient();
					
					practitionerModel.name = {
							family: [],
							given: []
					};
					patientModel.name = {
							family: [],
							given: []
					};
					
					if(req.body.givenName){
						practitionerModel.name.given.push(req.body.givenName);
						patientModel.name.given.push(req.body.givenName);
					}
					if(req.body.familyName){
						practitionerModel.name.family.push(req.body.familyName);
						patientModel.name.family.push(req.body.familyName);
						userModel.reference = {
								familyName : req.body.familyName
						};
						
					}
					
					// Checking if user is a patient or a practitioner or both
					if (req.body.userKind == 'both') {
						
						userModel.isPatient = true;	
						userModel.isPractitioner = true; 
						
						saveUser(req, res, userModel, patientModel, practitionerModel, function(mess, user, token){
							next(user, token, mess);
						});
						
					}else if (req.body.userKind == 'patient'){
						
						userModel.isPatient = true;	
						userModel.isPractitioner = false; 	

						saveUser(req, res, userModel, patientModel, null, function(mess, user, token){
							next(user, token, mess);
						});
						
					}else if (req.body.userKind == 'practitioner') {
						
						userModel.isPractitioner = true; 
						userModel.isPatient = false; 		

						saveUser(req, res, userModel, null, practitionerModel, function(mess, user, token){
							next(user, token, mess);
						});
						
					}else{
						next(null, null, res.__("UserKindMissing"));
					}					
				}
			}
		});
	}
};


// ----------------------------------------------------------------------------
// ------------------------- Other Functions ----------------------------------
// ----------------------------------------------------------------------------

/**
 * Saves a practitioner and/or patient resource and link it to the user model.
 * Saves the user model and sends back the user and the token.
 */
var saveUser = function(req, res, userModel, patientModel, practitionerModel, next){
	if(patientModel != null){
		req.params.model = 'Patient';
		req.body = patientModel;
		// Create and save the patient
		restCtrl.create(req, res, function(objpatient) {
			if (objpatient.constructor.name.includes("Error")) {
				console.log("Error while saving patient: " + objpatient);
		        next(objpatient, null, null);
			} else {
				// Add the patient resource as reference to the user
				userModel.reference.patientId = objpatient;
				
				if(practitionerModel != null){
					req.params.model = 'Practitioner';
					req.body = practitionerModel;
					// Create and save the practitioner
					restCtrl.create(req, res, function(objpractitioner) {
						if (objpractitioner.constructor.name.includes("Error")) {
							console.log("Error while saving practitioner: " + objpractitioner);
					        next(objpractitioner, null, null);
						} else {
							// Add the practitioner resource as reference to the user
							userModel.reference.practitionerId = objpractitioner;

							userModel.save(function(err, user) {
								if (err) {
									console.log("Error While Saving user: " + err);
									next(err, null, null);
								} else {
									var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
								          expires: TOKEN_EXPIRATION
							        });
									next(res.__("UserCreationSuccessful"), user, userToken);
								}
							});
						}
					});
				}else{
					userModel.save(function(err, user) {
						if (err) {
							console.log("Error While Saving user: " + err);
							next(err, null, null);
						} else {
							var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
						          expires: TOKEN_EXPIRATION
					        });
							next(res.__("UserCreationSuccessful"), user, userToken);
						}
					});
				}
			}
		});
	}else{
		if(practitionerModel != null){
			req.params.model = 'Practitioner';
			req.body = practitionerModel;
			// Create and save the practitioner
			restCtrl.create(req, res, function(objpractitioner) {
				if (objpractitioner.constructor.name.includes("Error")) {
					console.log("Error while saving practitioner: " + objpractitioner);
			        next(objpractitioner, null, null);
				} else {
					// Add the practitioner resource as reference to the user
					userModel.reference.practitionerId = objpractitioner;

					userModel.save(function(err, user) {
						if (err) {
							console.log("Error While Saving user: " + err);
							next(err, null, null);
						} else {
							var userToken = jwt.sign(userForToken(user), process.env.JWT_SECRET,{
						          expires: TOKEN_EXPIRATION
					        });
							next(res.__("UserCreationSuccessful"), user, userToken);
						}
					});
				}
			});
			
		}else{
			next(res.__("User must be either patient or practitioner"), null, null);
		}
	}	
};