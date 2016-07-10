
var userCtrl = require('../databases/controllers/userCtrl');
var restCtrl = require('../databases/controllers/RESTController');
var Entities = require('html-entities').XmlEntities;

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.registerForm = function(req, res) {
	res.render('register', {
		title : 'Créer un compte'
	});
};

exports.register = function(req, res) {
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
	console.log("Adresse: "+ req.body.address);
	req.body.contactTel = entities.encode(req.body.contactTel);
	req.body.telType = entities.encode(req.body.telType);
	req.body.contactEmail = entities.encode(req.body.contactEmail);
	req.body.emailType = entities.encode(req.body.emailType);
	req.body.mainLanguage = entities.encode(req.body.mainLanguage);
	req.body.speciality = entities.encode(req.body.speciality);
	req.body.workLocation = entities.encode(req.body.workLocation);
	req.body.workTel = entities.encode(req.body.workTel);
	
	// Create user
	userCtrl.createUser(req, res);
	
	// Check if creation done without errors
	if(req.user == null)	{
        res.status(500).render('error',{
            loggedIn: false,
            message: req.message
        });
		
	}
	else{
		// If user is a patient
		if(req.patient != null){
			req.params.model = 'Patient';
			req.body = req.patient;
			// Create and save the patient
			restCtrl.create(req, res, function(objpatient) {
				if (objpatient.constructor.name == "Error") {
			        res.status(500).render('error',{
			            loggedIn: false,
			            message: req.message
			        });
				} else {
					console.log('id: '+ objpatient);
					// Add the patient resource as reference to the user
					var patientId = objpatient;
					var user = req.user;
					user.reference.push(patientId);
					// If user is also a practitioner
					if(req.practitioner != null){
						req.params.model = 'Practitioner';
						// Create and save the practitioner
						restCtrl.create(req, res, function(objPractitioner) {
							if (objPractitioner.constructor.name == "Error") {
						        res.status(500).render('error',{
						            loggedIn: false,
						            message: req.message
						        });
							} else {
								console.log('id: '+ objPractitioner);
								// Add the practitioner resource as reference to the user
								var practitionerId = objPractitioner;
								user.reference.push(practitionerId);
								// Save the user
								userCtrl.saveUser(req, res);
							}
						});
					}
				}
			});
		// If user is only a practitioner
		}else{
			if(req.practitioner != null){
				req.params.model = 'Practitioner';
				// Create and save the practitioner
				restCtrl.create(req, res, function(objPractitioner) {
					if (objPractitioner.constructor.name == "Error") {
				        res.status(500).render('error',{
				            loggedIn: false,
				            message: req.message
				        });
					} else {
						console.log('id: '+ objPractitioner);
						// Add the practitioner resource as reference to the user
						var practitionerId = objPractitioner;
						user.reference.push(practitionerId);
						// Save the user
						userCtrl.saveUser(req, res);
					}
				});				
			}
		}
	}
}

exports.loginForm = function(req, res) {
	res.render('login');
};

exports.login = function(req, res) {
	// html entities
	var entities = new Entities();
	req.body.email = entities.encode(req.body.email);
	req.body.password = entities.encode(req.body.password);
	// login
	userCtrl.findUser(req,res);
};


exports.ensureAuthorized = function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {
	    // verifies secret and checks exp
	    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {      
	      if (err) {
	        return res.render('error',{ loggedIn: false, message: 'FailedToken.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	        next();
	      }
	    });
	  } else {
	    // if there is no token
	    // return an error
	    return res.status(403).render('error',{ 
	        loggedIn: false, 
	        message: 'NoToken' 
	    });	    
	  }	
}