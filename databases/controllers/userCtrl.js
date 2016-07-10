
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt	= require('jsonwebtoken');

exports.findUser = function(req,res) {
	// Search the user
	User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
        	console.log(err);
            res.render('error',{
                loggedIn: false,
                message: "InternalError."
            });
        } else {
            if (user) {
               res.json({
            	   loggedIn: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.render('login',{
                	loggedIn: false,
                	message: "IncorrectMailPass"
                });    
            }
        }
    });	
};

exports.createUser = function(req, res){	
    req.user = null;
    req.patient = null;
    req.practitioner = null;	    
    
	// check if data is valid
	if(req.body.password < 7 || req.body.password != req.body.confirmPass){
        req.message = "PasswordInvalid";	
	}
	else if(req.body.nameFamily == ""){
        req.message = "NameInvalid";	
	}
	else if(req.body.nameGiven == ""){
        req.message = "SurnameInvalid";	
	}
	else if(req.body.birthDate == null || req.body.birthDate == ""){
        req.message = "BirthdateInvalid";	
	}
	else if(req.body.email == ""){
        req.message = "EmailInvalid";	
	}else{		
		// Check if user already exists
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	        	req.message = "InternalError";
	        } else {
	            if (user) {
	            	req.message = "UserAlreadyExists";
	            } else {
	            	// Create new user
	                var userModel = new User();
	                userModel.email = req.body.email;
	                userModel.password = req.body.password;
	                userModel.created = new Date();
	                userModel.language = req.body.mainLanguage;
	                
                	var Practitioner = mongoose.model('Practitioner');
                	var Patient = mongoose.model('Patient');
                	var practitionerModel = null;
                	var patientModel = null;
                	
	                if( req.body.userKind == 'patient' || req.body.userKind == 'both'){
	                	var patientModel = new Patient();
	                	patientModel.gender = req.body.gender;
	                	patientModel.name.given.push(req.body.nameGiven);
	                	patientModel.name.given.push(req.body.nameFamily);
	                	patientModel.birthDate = new Date(req.body.birthDate);
	                	patientModel.profession.push(req.body.job);
	                	patientModel.address.push({text: req.body.address});
	                	patientModel.telecom.push({system: 'email', value: req.body.contactEmail, use: req.body.emailType});
	                	patientModel.telecom.push({system: 'phone', value: req.body.contactTel, use: req.body.telType});
	                	if(req.body.speakFrench == true)
	                		if(req.body.mainLanguage == 'fr')
	                			patientModel.communication.push({language:{coding:[{code: "fr"}]}, preferred:true});
	                		else
	                			patientModel.communication.push({language:{coding:[{code: "fr"}]}, preferred:false});
	                	if(req.body.speakEnglish == true)
	                		if(req.body.mainLanguage == 'en')
	                			patientModel.communication.push({language:{coding:[{code: "en"}]}, preferred:true});
	                		else
	                			patientModel.communication.push({language:{coding:[{code: "en"}]}, preferred:false});
	                	if(req.body.speakDutch == true)
	                		if(req.body.mainLanguage == 'nl')
	                			patientModel.communication.push({language:{coding:[{code: "nl"}]}, preferred:true});
	                		else
	                			patientModel.communication.push({language:{coding:[{code: "nl"}]}, preferred:false});
	                	if(req.body.speakGerman == true)
	                		if(req.body.mainLanguage == 'de')
	                			patientModel.communication.push({language:{coding:[{code: "de"}]}, preferred:true});
	                		else
	                			patientModel.communication.push({language:{coding:[{code: "de"}]}, preferred:false});	                	
	                }
	                
	                if(req.body.userKind == 'practitioner' || req.body.userKind == 'both'){
	                	var practitionerModel = new Practitioner();
	                	practitionerModel.gender = req.body.gender;
	                	practitionerModel.name.given.push(req.body.nameGiven);
	                	practitionerModel.name.given.push(req.body.nameFamily);
	                	practitionerModel.birthDate = new Date(req.body.birthDate);
	                	practitionerModel.profession.push(req.body.job);
	                	practitionerModel.address.push({text: req.body.address});
	                	practitionerModel.telecom.push({system: 'email', value: req.body.contactEmail, use: req.body.emailType});
	                	practitionerModel.telecom.push({system: 'phone', value: req.body.contactTel, use: req.body.telType});
	                	if(req.body.speakFrench == true)
	                		if(req.body.mainLanguage == 'fr')
	                			practitionerModel.communication.push({language:{coding:[{code: "fr"}]}, preferred:true});
	                		else
	                			practitionerModel.communication.push({language:{coding:[{code: "fr"}]}, preferred:false});
	                	if(req.body.speakEnglish == true)
	                		if(req.body.mainLanguage == 'en')
	                			practitionerModel.communication.push({language:{coding:[{code: "en"}]}, preferred:true});
	                		else
	                			practitionerModel.communication.push({language:{coding:[{code: "en"}]}, preferred:false});
	                	if(req.body.speakDutch == true)
	                		if(req.body.mainLanguage == 'nl')
	                			practitionerModel.communication.push({language:{coding:[{code: "nl"}]}, preferred:true});
	                		else
	                			practitionerModel.communication.push({language:{coding:[{code: "nl"}]}, preferred:false});
	                	if(req.body.speakGerman == true)
	                		if(req.body.mainLanguage == 'de')
	                			practitionerModel.communication.push({language:{coding:[{code: "de"}]}, preferred:true});
	                		else
	                			practitionerModel.communication.push({language:{coding:[{code: "de"}]}, preferred:false}); 
	                	
	                	practitionerModel.practitionerRole.push({specialty: req.body.speciality, location:[{display: req.body.workLocation}]});
	                	practitionerModel.telecom.push({system: 'phone', value: req.body.workTel, use:'work'});	                	
	                
	                }
	                
	                req.message= "";
	                req.user = userModel;
	                req.patient = JSON.stringify(patientModel);
	                req.practitioner = JSON.stringify(practitionerModel);	                
	            }
	        }
	    });
	}
};

exports.saveUser = function(req, res){	
    // Save
    req.user.save(function(err, user) {
        user.token = jwt.sign(user, process.env.JWT_SECRET);
        user.save(function(err, user1) {
        	if(err){
		        res.status(500).render('error',{
		            loggedIn: false,
		            message: err
		        });        		
        	}else{
	            res.status(201).render('index', {
	            	loggedIn: true,
	                data: user1,
	                token: user1.token
	            });
        	}
        });
    });
};