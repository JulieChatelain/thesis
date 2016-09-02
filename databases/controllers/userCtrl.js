var mongoose = require('mongoose');
var User = mongoose.model('User');
var AccessAuthorization = mongoose.model('AccessAuthorization');
var jwt = require('jsonwebtoken');


//-----------------------------------------------------------------------------
//---------------------- Authorization functions ------------------------------
//-----------------------------------------------------------------------------

exports.approveAuthorization = function(res, refId, auth, next) {
	var iMax = auth.access.length;
	console.log("approving auth for: " + refId);
	for (var i = 0; i < iMax; i++){
		if(auth.access[i].refId == refId)
			auth.access[i].isApproved = true;
	}
	console.log("auth about to be saved: " + JSON.stringify(auth));
	auth.save(function(err, savedAuth) {
		if (err) {
			console.log("Error While Saving authorizations: " + err);
			next(false, res.__('ErrorWhileSavingAuth') + err);
		} else {
			next(true, res.__('AuthApproved'));
		}
	});
};

/**
 * Find the list of access authorizations given or received 
 * according to the refId (id of a patient or practitioner resource).
 */
var findAuthorizations = function(refId, next){
	AccessAuthorization.findOne({
		referenceId : refId
	}, function(err, auth) {
		if (err) {
			console.log("Find access error: " + err);
			next(null);
		} else {
			// if the list doesn't exist, we create it
			if(auth == null){
				auth = new AccessAuthorization();
				auth.referenceId = refId;
				auth.save(function(err, savedauth) {
					if (err) {
						console.log("Error while creating authorization: " + err);
						next(null);
					} else {
						next(savedauth);
					}
				});
			}else{
				next(auth);
			}
		}
	});
};
exports.findAuthorizations = findAuthorizations;

/**
 * Remove the access authorization
 */
exports.removeAccess = function(req, res){
	// get the user (from the token)
	var user = req.user;
	// get the doctor access list
	findAuthorizations(req.body.doctorId, function(doctorAuthList){
		if(doctorAuthList == null){
			res.json({success: false, message : "Error While searching authorizations"});
		}else{
			var len = doctorAuthList.access.length;
			// remove the access
			for (var i = 0; i < len; i++) {
				if(doctorAuthList.access[i].refId == req.body.patientId){
					doctorAuthList.access.splice(i, 1);
				}
			}
			// Save the changes
			doctorAuthList.save(function(err, savedAuth) {
				if (err) {
					console.log("Error While Saving authorizations: " + err);
					res.json({success: false,message : "Error While searching authorizations: " + err});
				} else {

					// get the patient access list
					findAuthorizations(req.body.patientId, function(patientAuthList){
						if(patientAuthList == null){
							res.json({success: false, message : "Error While searching authorizations"});
						}else{
							var len2 = patientAuthList.access.length;
							// remove the access
							for (var i = 0; i < len2; i++) {
								if(patientAuthList.access[i].refId == req.body.doctorId){
									patientAuthList.access.splice(i, 1);
								}
							}
							// Save the changes
							patientAuthList.save(function(err3, savedAuth) {
								if (err) {
									console.log("Error While Saving authorizations: " + err3);
									res.json({success: false,message : "Error While searching authorizations: " + err3});
								} else {
									res.json({success: true, message : "Authorizations correctly deleted"});									
								}
							});
						}
					});
				}
			});
		}
	});
};

/**
 * Change the access of a doctor to your data.
 */
exports.changeAccess = function(req, res){
	// get the user (from the token)
	var user = req.user;
	// get the doctor access list
	findAuthorizations(req.body.doctorId, function(doctorAuthList){
		if(doctorAuthList == null){
			res.json({success: false, message : "Error While searching authorizations"});
		}else{
			var len = doctorAuthList.access.length;
			// update the access level
			for (var i = 0; i < len; i++) {
				if(doctorAuthList.access[i].refId == user.reference.patientId){
					if(typeof req.body.accessLevel != 'undefined'){
						doctorAuthList.access[i].level = req.body.accessLevel;
					}
					if(typeof req.body.startDate != 'undefined'){
						doctorAuthList.access[i].start = req.body.startDate;				
					}else{
						doctorAuthList.access[i].start = new Date();
					}
					if(typeof req.body.endDate != 'undefined'){
						doctorAuthList.access[i].end = req.body.endDate;					
					}else{
						// default end date is two weeks later
						doctorAuthList.access[i].end = new Date(doctorAuthList.access[i].start);	
						doctorAuthList.access[i].end.setDate(doctorAuthList.access[i].end.getDate() + 14);
					}
					doctorAuthList.access[i].isApproved = req.body.approbation;
				}
			}
			// Save the changes
			doctorAuthList.save(function(err, savedAuth) {
				if (err) {
					console.log("Error While Saving authorizations: " + err);
					res.json({success: false,message : "Error While searching authorizations: " + err});
				} else {
					// Change also in the access in the patient's doctor list
					// first, find the patient's doctor authorization list
					findAuthorizations(user.reference.patientId, function(patientAuthList){
						if(patientAuthList == null){
							res.json({success: false, message : "Error While Saving authorizations"});
						}else{
							var len2 = patientAuthList.access.length;
							// update the access level
							for (var i = 0; i < len2; i++) {
								if(patientAuthList.access[i].refId == user.reference.patientId){
									if(typeof req.body.accessLevel != 'undefined'){
										patientAuthList.access[i].level = req.body.accessLevel;
									}
									if(typeof req.body.startDate != 'undefined'){
										patientAuthList.access[i].start = req.body.startDate;				
									}else{
										patientAuthList.access[i].start = new Date();
									}
									if(typeof req.body.endDate != 'undefined'){
										patientAuthList.access[i].end = req.body.endDate;					
									}else{
										// default end date is two weeks later
										patientAuthList.access[i].end = new Date(patientAuthList.access[i].start);	
										patientAuthList.access[i].end.setDate(patientAuthList.access[i].end.getDate() + 14);
									}
									patientAuthList.access[i].isApproved = req.body.approbation;	
								}
							}
		
							// Save the changes
							patientAuthList.save(function(err2, savedPatientAuth) {
								if (err2) {
									console.log("Error While Saving authorizations: " + err2);
									res.json({success: false, message : "Error While Saving authorizations: " + err2});
								} else {
									res.json({success: true, message : "Authorizations correctly updated"});
								}
							});
						}
					});					
				}
			});
		}
	});
}

/**
 * Ask a patient to give access to his data.
 */
exports.requestAccess = function(req, res){
	// get the user (from the token)
	var user = req.user;
	var doctorId = user.reference.practitionerId;
	
	// get the starting and ending dates from the request.
	var startDate = new Date();
	if(typeof req.body.startDate != 'undefined'){
		startDate = req.body.startDate;				
	}
	var endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + 14);
	
	if(typeof req.body.endDate != 'undefined'){
		endDate = req.body.endDate;					
	}
	
	// get the target patient's doctor access list 
	findAuthorizations(req.body.patientId, function(authList){
		if(authList == null){
			console.log("Error While Searching authorizations ");
			res.json({success: false, message : "Error While searching authorizations"});
		}else{
			var len = authList.access.length;
			// check if a request already exist
			var k = -1;
			for (var i = 0; i < len; i++) {
				if(authList.access[i].refId == doctorId){
					k = i;
				}
			}
			// if not, add a "pending" access in the patient's doctor access list
			if(k == -1){
				authList.access.push({
					refId : doctorId,		
					start : startDate,
					end : endDate,
					level : req.body.accessLevel,
					isApproved : false
				});
			}
			// else update it
			else{
				authList.access[k] = {
					refId : doctorId,		
					start : startDate,
					end : endDate,
					level : req.body.accessLevel,
					isApproved : false
				};
			}
			
			// Save the changes
			authList.save(function(err, savedAuth) {
				if (err) {
					console.log("Error While Saving authorizations: " + err);
					res.json({success: false, message : "Error While Saving authorizations: " + err});
				} else {
					// get the doctor's patient access list
					findAuthorizations(doctorId, function(patientAuthList){
						if(patientAuthList == null){
							console.log("Error While Searching authorizations ");
							res.json({success: false, message : "Error While searching authorizations"});
						}else{
							var len = patientAuthList.access.length;
							// check if a request already exist
							var k = -1;
							for (var i = 0; i < len; i++) {
								if(patientAuthList.access[i].refId == req.body.patientId){
									k = i;
								}
							}
							// if not, add a "pending" access in the patient's doctor access list
							if(k == -1){
								patientAuthList.access.push({
									refId : req.body.patientId,		
									start : startDate,
									end : endDate,
									level : req.body.accessLevel,
									isApproved : false
								});
							}
							// else update it
							else{
								patientAuthList.access[k] = {
									refId : req.body.patientId,		
									start : startDate,
									end : endDate,
									level : req.body.accessLevel,
									isApproved : false
								};
							}
							
							// Save the changes
							patientAuthList.save(function(err2, savedPatientAuth) {
								if (err2) {
									console.log("Error While Saving authorizations: " + err2);
									res.json({success: false, message : res.__('ErrorWhileSavingAuthorizations: ' + err2)});
								} else {
									res.json({success: true, message : res.__('AuthorizationsRequestCorrectlySent')});
								}
							});
							
						}
					});
				}
			});			
		}
	});
}


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
				var userToken = jwt.sign(user, process.env.JWT_SECRET,{
			          expires: 600 // in minute ( = 10 hours)
		        });
				next(user, userToken, '');
			} else {
				console.log("User not found.");
				next(null, null, 'Incorrect Mail or Password');
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
					var userToken = jwt.sign(user, process.env.JWT_SECRET,{
				          expires: 600 // in minute ( = 10 hours)
			        });
					next(user, userToken, '');
				} else {
					console.log("User not found.");
					next(null, null, 'Incorrect Mail or Password');
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
					var userToken = jwt.sign(user, process.env.JWT_SECRET,{
				          expires: 600 // in minute ( = 10 hours)
			        });
					next(user, userToken, '');
				} else {
					console.log("User not found.");
					next(null, null, 'Incorrect Mail or Password');
				}
			}
		});
	}
};

/**
 * Create an user, patient and/or practitioner resource.
 */
exports.createUser = function(req, res, next) {
	// check if data is valid
	if (req.body.password < 7 || req.body.password != req.body.confirmPass) {
		req.message = "PasswordInvalid";
		next(null,null,null);
	} else if (req.body.nameFamily == "") {
		req.message = "NameInvalid";
		next(null,null,null);
	} else if (req.body.nameGiven == "") {
		req.message = "SurnameInvalid";
		next(null,null,null);
	} else if (req.body.birthDate == null || req.body.birthDate == "") {
		req.message = "BirthdateInvalid";
		next(null,null,null);
	} else if (req.body.email == "") {
		req.message = "EmailInvalid";
		next(null,null,null);
	} else {
		// Check if user already exists
		var password = req.body.password;
		var email = req.body.email;

		User.findOne({email : email,password : password},function(err, user) {
			if (err) {
				console.log("Cannot create user...");
				req.message = "InternalError";
				next(null,null,null);
			} else {
				if (user) {
					console.log("User already exist");
					req.message = "UserAlreadyExists";
					next(null,null,null);
				} else {
					// Create new user
					var userModel = new User();
					userModel.email = email;
					userModel.password = password;
					userModel.created = new Date();
					userModel.language = req.body.mainLanguage;

					var practitionerModel = null;
					var patientModel = null;

					// Checking if user is a patient or a practitioner or both
					if (req.body.userKind == 'patient'|| req.body.userKind == 'both') {
						userModel.isPatient = true;
						patientModel = createPatient(req);		
					}else{
						userModel.isPatient = false;						
					}

					if (req.body.userKind == 'practitioner' || req.body.userKind == 'both') {
						userModel.isPractitioner = true; 
						practitionerModel = createPractitioner(req);
					}else{
						userModel.isPractitioner = false; 						
					}
					userModel.created = new Date();
					req.message = "";
					next(userModel, patientModel, practitionerModel);
				}
			}
		});
	}
};

/**
 * Save the user in the database and return the token.
 */
exports.saveUser = function(userModel, res) {
	var newUser = new User(userModel);
	// Save
	newUser.save(function(err, user) {
		if (err) {
			console.log("Error While Saving user: " + err);
			res.json({
				loggedIn : false,
				success: false,
				message : err
			});
		} else {
			var userToken = jwt.sign(user, process.env.JWT_SECRET,{
		          expires: 600 // in minute ( = 10 hours)
	        });
			res.json({
				loggedIn : true,
				success: true,
				userData : user,
				token : userToken,
				message: "Enregistrement réussi."
			});
		}
	});
};

// ----------------------------------------------------------------------------
// ------------------------- Other Functions ----------------------------------
// ----------------------------------------------------------------------------

/**
 * Create a patient resource from the values in req.body.
 */
var createPatient = function(req) {
	var Patient = mongoose.model('Patient');
	var patientModel = new Patient();
	// Need to do this because moongose put strange restrictions:
	patientModel = JSON.parse(JSON.stringify(patientModel));
	
	// Filling the model:
	patientModel.gender = req.body.gender;
	patientModel.name.given.push(req.body.nameGiven);
	patientModel.name.family.push(req.body.nameFamily);
	patientModel.birthDate = new Date(req.body.birthDate);
	patientModel.profession.push(req.body.job);
	patientModel.address.push({text : req.body.address});

	if (req.body.contactEmail != "")
		patientModel.telecom.push({
			system : 'email',
			value : req.body.contactEmail,
			use : req.body.emailType
		});
	if (req.body.contactTel != "")
		patientModel.telecom.push({
			system : 'phone',
			value : req.body.contactTel,
			use : req.body.telType
		});

	if (req.body.speakFrench == true || req.body.speakFrench == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "fr",display : "Français"});
		if (req.body.mainLanguage == 'fr'){
			commu.preferred = true;
		}
		patientModel.communication.push(commu);
	}

	if (req.body.speakEnglish == true || req.body.speakEnglish == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "en",display : "English"});
		if (req.body.mainLanguage == 'en'){
			commu.preferred = true;
		}
		patientModel.communication.push(commu);
	}
	if (req.body.speakDutch == true || req.body.speakDutch == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "nl",display : "Nederlands"});
		if (req.body.mainLanguage == 'nl'){
			commu.preferred = true;
		}
		patientModel.communication.push(commu);
	}
	if (req.body.speakGerman == true || req.body.speakGerman == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "de",display : "Deutsch"});
		if (req.body.mainLanguage == 'de'){
			commu.preferred = true;
		}
		patientModel.communication.push(commu);
	}
	return patientModel;
};


/**
 * Create a practitioner resource from the values in req.body.
 */
var createPractitioner = function(req) {

	var Practitioner = mongoose.model('Practitioner');
	var practitionerModel = new Practitioner();
	// Need to do this because moongose put strange restrictions:
	//practitionerModel = JSON.parse(JSON.stringify(practitionerModel));
	
	// Filing the model :
	practitionerModel.gender = req.body.gender;
	practitionerModel.name.given.push(req.body.nameGiven);
	practitionerModel.name.family.push(req.body.nameFamily);
	practitionerModel.birthDate = new Date(req.body.birthDate);
	practitionerModel.address.push({text : req.body.address});

	if (req.body.contactEmail != "")
		practitionerModel.telecom.push({
			system : 'email',
			value : req.body.contactEmail,
			use : req.body.emailType
		});
	if (req.body.contactTel != "")
		practitionerModel.telecom.push({
			system : 'phone',
			value : req.body.contactTel,
			use : req.body.telType
		});

	if (req.body.speakFrench == true || req.body.speakFrench == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "fr",display : "Français"});
		if (req.body.mainLanguage == 'fr'){
			commu.preferred = true;
		}
		practitionerModel.communication.push(commu);
	}

	if (req.body.speakEnglish == true || req.body.speakEnglish == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "en",display : "English"});
		if (req.body.mainLanguage == 'en'){
			commu.preferred = true;
		}
		practitionerModel.communication.push(commu);
	}
	if (req.body.speakDutch == true || req.body.speakDutch == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "nl",display : "Nederlands"});
		if (req.body.mainLanguage == 'nl'){
			commu.preferred = true;
		}
		practitionerModel.communication.push(commu);
	}
	if (req.body.speakGerman == true || req.body.speakGerman == 'on'){
		var commu = {language : {coding: [], preferred : false}, preferred: false};
		commu.language.coding.push({code : "de",display : "Deutsch"});
		if (req.body.mainLanguage == 'de'){
			commu.preferred = true;
		}
		practitionerModel.communication.push(commu);
	}
	
	practitionerModel.practitionerRole.push({
		specialty : req.body.speciality,
		location : [ {
			display : req.body.workLocation
		} ]
	});
	practitionerModel.telecom.push({
		system : 'phone',
		value : req.body.workTel,
		use : 'work'
	});
	return practitionerModel;
};