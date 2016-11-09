
var userCtrl = require('../databases/controllers/userCtrl');
var restCtrl = require('../databases/controllers/RESTController');
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
	            loggedIn: false,
	            message: message
	        });			
		}
		else{
			res.json({
				success: true,
				loggedIn : true,
				user : user,
				token : token
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


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       