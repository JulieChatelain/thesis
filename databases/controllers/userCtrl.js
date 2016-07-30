var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

/**
 * Search for an user according to the password and email.
 */
exports.findUser = function(req, res) {
	// Search the user
	User.findOne({
		email : req.body.email,
		password : req.body.password
	}, function(err, user) {
		if (err) {
			console.log("FindUser : " + err);
			res.render('error', {
				loggedIn : false,
				message : "InternalError."
			});
		} else {
			if (user) {
				res.render('index',{
					loggedIn : true,
					userData : user,
					token : user.token
				});
			} else {
				res.render('login', {
					loggedIn : false,
					message : "IncorrectMailPass"
				});
			}
		}
	});
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
					userModel = JSON.parse(JSON.stringify(userModel));
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
					}

					if (req.body.userKind == 'practitioner' || req.body.userKind == 'both') {
						userModel.isPractitioner = true; 
						practitionerModel = createPractitioner(req);
					}
					
					req.message = "";
					console.log("Juste created user: " + JSON.stringify(userModel));
					next(userModel, patientModel, practitionerModel);
				}
			}
		});
	}
};

/**
 * Save the user in the database and return the index page.
 */
exports.saveUser = function(userModel, res) {
	var newUser = new User(userModel);
	// Save
	newUser.save(function(err, user) {
		if (err) {
			res.status(500).render('error', {
				loggedIn : false,
				message : err
			});
		} else {
			user.token = jwt.sign(user, process.env.JWT_SECRET);
			user.save(function(err2, user1) {
				if (err2) {
					console.log("Error while saving the new user : " + erre)
					res.status(500).render('error', {
						loggedIn : false,
						message : err2
					});
				} else {
					res.status(201).render('index', {
						loggedIn : true,
						userData : user1,
						token : user1.token
					});
				}
			});
		}
	});
};

// ----------------------------------------------------------------------------
// ----------------------------- Functions ------------------------------------
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
		var language = {coding: [], preferred : false};
		language.coding.push({code : "fr",display : "Français"});
		if (req.body.mainLanguage == 'fr'){
			language.preferred = true;
		}
		patientModel.communication.push(language);
	}

	if (req.body.speakEnglish == true || req.body.speakEnglish == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "en",display : "English"});
		if (req.body.mainLanguage == 'en'){
			language.preferred = true;
		}
		patientModel.communication.push(language);
	}
	if (req.body.speakDutch == true || req.body.speakDutch == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "nl",display : "Nederlands"});
		if (req.body.mainLanguage == 'nl'){
			language.preferred = true;
		}
		patientModel.communication.push(language);
	}
	if (req.body.speakGerman == true || req.body.speakGerman == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "de",display : "Deutsch"});
		if (req.body.mainLanguage == 'de'){
			language.preferred = true;
		}
		patientModel.communication.push(language);
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
	practitionerModel = JSON.parse(JSON.stringify(practitionerModel));
	
	// Filing the model :
	practitionerModel.gender = req.body.gender;
	practitionerModel.name.given.push(req.body.nameGiven);
	practitionerModel.name.family.push(req.body.nameFamily);
	practitionerModel.birthDate = new Date(req.body.birthDate);
	practitionerModel.profession.push(req.body.job);
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
		var language = {coding: [], preferred : false};
		language.coding.push({code : "fr",display : "Français"});
		if (req.body.mainLanguage == 'fr'){
			language.preferred = true;
		}
		practitionerModel.communication.push(language);
	}

	if (req.body.speakEnglish == true || req.body.speakEnglish == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "en",display : "English"});
		if (req.body.mainLanguage == 'en'){
			language.preferred = true;
		}
		practitionerModel.communication.push(language);
	}
	if (req.body.speakDutch == true || req.body.speakDutch == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "nl",display : "Nederlands"});
		if (req.body.mainLanguage == 'nl'){
			language.preferred = true;
		}
		practitionerModel.communication.push(language);
	}
	if (req.body.speakGerman == true || req.body.speakGerman == 'on'){
		var language = {coding: [], preferred : false};
		language.coding.push({code : "de",display : "Deutsch"});
		if (req.body.mainLanguage == 'de'){
			language.preferred = true;
		}
		practitionerModel.communication.push(language);
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