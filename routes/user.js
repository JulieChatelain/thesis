
var userCtrl = require('../databases/controllers/userCtrl');
var restCtrl = require('../databases/controllers/RESTController');
var auth 	 = require('./AuthManager');
var jwt = require('jsonwebtoken');


//-----------------------------------------------------------------------------
//--------------------------- User functions ----------------------------------
//-----------------------------------------------------------------------------


/**
 * Create a new user<br>
 * req.body needs to have :<br>
 * password & email
 */
exports.register = function(req, res) {
	// Create user
	userCtrl.createUser(req, res, function(user, token, message){
		// console.log("User: " + JSON.stringify(user));
		// Check if creation done without errors
		if(user == null)	{
			console.log("Failed creating user");
	        res.json({
	            success: false,
	            message: message
	        });			
		}
		else{
			var id = "";
			req.user = user;
			if(user.isPatient){
				id = user.reference.patientId;
			}
			if(user.isPractitioner){
				id = user.reference.practitionerId;
			}
			auth.addAccess(req, res, id, function(success, message){
				if(success){
					res.json({
						success: true,
						user : user,
						token : token,
			            message: ""
					});
				}else{
					res.json({
						success: false,
						user : user,
						token : token,
			            message: message
					});
				}
			});
			
		}
	});	
}

/**
 * Find the user in the DB and send back the token.<br>
 * req.body needs to have :<br>
 * password & email
 */
exports.login = function(req, res) {
	userCtrl.findUser(req, res, function(user, userToken, message){
		if (user != null) {
			res.json({
				success: true,
				user : user,
				token : userToken,
	            message: ""
			});
		} else {
			res.json({
				success: false,
				message : message
			});
		}
	});
};

/**
 * change the user password
 * req.body needs to have:<br>
 * pass & confirmPass : the new password<br>
 * password : the old password<br>
 * email : the user email
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


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       