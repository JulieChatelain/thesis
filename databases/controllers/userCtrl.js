
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt	= require('jsonwebtoken');
var Entities = require('html-entities').XmlEntities;

exports.findUser = function(req,res) {
	var entities = new Entities();
	// Search the user
	User.findOne({email: entities.encode(req.body.email), password: entities.encode(req.body.password)}, function(err, user) {
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
	// html entities
	var entities = new Entities();

	req.body.userKind = entities.encode(req.body.userKind);
	req.body.gender = entities.encode(req.body.gender);
	req.body.email = entities.encode(req.body.email);
	req.body.password = entities.encode(req.body.password);
	req.body.confirmPass = entities.encode(req.body.confirmPass);
	req.body.nameFamily = entities.encode(req.body.nameFamily);
	req.body.nameGiven = entities.encode(req.body.nameGiven);
	req.body.job = entities.encode(req.body.job);
	req.body.address = entities.encode(req.body.address);
	req.body.contactTel = entities.encode(req.body.contactTel);
	req.body.contactEmail = entities.encode(req.body.contactEmail);
	req.body.mainLanguage = entities.encode(req.body.mainLanguage);
	req.body.speciality = entities.encode(req.body.speciality);
	req.body.workLocation = entities.encode(req.body.workLocation);
	req.body.workTel = entities.encode(req.body.workTel);
	
	// check data
	if(req.body.password < 7 || req.body.password != req.body.confirmPass){
        res.render('register',{
        	loggedIn: false,
        	message: "PasswordInvalid"
        });		
	}
	else if(req.body.nameFamily == ""){
        res.render('register',{
        	loggedIn: false,
        	message: "NameInvalid"
        });				
	}
	else if(req.body.nameGiven == ""){
        res.render('register',{
        	loggedIn: false,
        	message: "SurnameInvalid"
        });				
	}
	else if(req.body.birthDate == ""){
        res.render('register',{
        	loggedIn: false,
        	message: "BirthDateInvalid"
        });	
	}
	else if(req.body.email == ""){
        res.render('register',{
        	loggedIn: false,
        	message: "EmailInvalid"
        });			
	}else{
		
		// Check if user already exists
		User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.render('error',{
	            	loggedIn: false,
	            	message: "InternalError."
	            });
	        } else {
	            if (user) {
	                res.render('error',{
	                	loggedIn: false,
	                	message: "UserAlreadyExists"
	                });
	            } else {

	            	req.body.userKind = 'patient';
	            	req.body.gender = 'male';
	            	req.body.email = '';
	            	req.body.password = '';
	            	req.body.confirmPass = '';
	            	req.body.nameFamily = '';
	            	req.body.nameGiven = '';
	            	req.body.birthDate = '';
	            	req.body.job = '';
	            	req.body.address = '';
	            	req.body.contactTel = '';
	            	req.body.contactEmail = '';
	            	req.body.speakFrench = true;
	            	req.body.speakEnglish = false;
	            	req.body.speakDutch = false;
	            	req.body.speakGerman = false;
	            	req.body.mainLanguage = 'fr';
	            	req.body.speciality = '';
	            	req.body.workLocation = '';
	            	req.body.workTel = '';
	            	// Create new user
	                var userModel = new User();
	                userModel.email = req.body.email;
	                userModel.password = req.body.password;
	                userModel.save(function(err, user) {
	                    user.token = jwt.sign(user, process.env.JWT_SECRET);
	                    user.save(function(err, user1) {
	                        res.json({
	                        	loggedIn: true,
	                            data: user1,
	                            token: user1.token
	                        });
	                    });
	                })
	            }
	        }
	    });
	}
};