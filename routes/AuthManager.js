var mongoose 	= require('mongoose');
var jwt 		= require('jsonwebtoken');
var acl 		= require('acl');

var restCtrl = require('../databases/controllers/RESTController');

var Permissions = {
		view: 1,
		edit: 2,
		delete: 3,
		list: ["view", "edit", "delete"]
};

process.env.JWT_SECRET = "64DXqaYyC6zFpsUFPBgPCELFRF8ka9gZHE6f2kp79xMp3ASK";

//-----------------------------------------------------------------------------
//------------------------- Token and basic access ----------------------------
//-----------------------------------------------------------------------------

/**
 * Access according to the resource type.
 */
var checkBasicAccess = function(model, user, method){
	if(!model)
		return true;
	
	var m = model.toLowerCase();
	
	switch(m){
		case 'medication' : 
			if(user.isPatient && method != 'GET')
				return false;
			else return true;
		case 'bodysite' : 
			if(user.isPatient && method != 'GET')
				return false;
			else return true;
		case 'location' : 
			if(user.isPatient && method != 'GET')
				return false;
			else return true;
		case 'patient' : 
			if(user.isPractitioner) return true;
			else return false;
		default: return false;
	}
};

/**
 * Extract the token from the headers.
 */
var getToken = function(headers) {
	var header = headers["x-access-token"];
	if (typeof header !== 'undefined') {
		return header;
	} else {
		header = headers["authorization"];
		if (typeof header !== 'undefined') {
			var token = header.split(" ");
			return token[1];
		} else {
			return null;
		}
	}
};

/**
 * Middleware for express. Check the token and basic authorization.
 */
exports.ensureAuthorized = function(req, res, next) {
	var token = getToken(req.headers);
	if (token == null) {
		console.log("CheckToken error: typeof header === 'undefined'");
		return res.sendStatus(403);
	} else {
		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
			if (err) {
				console.log("CheckToken error: " + err);
				return res.sendStatus(403);
			} else {
				req.user = decoded;
				// console.log("decoded : " + JSON.stringify(decoded));
				if(!req.params.pId && checkBasicAccess(req.params.model, req.user, req.method))
					next();
				else{
					console.log("Access refused for " + req.params.model);
					return res.sendStatus(403);						
				}
			}
		});
	}

};

/**
 * Return the user id;
 */
exports.userId = function getUserId(req, res){
	if(req.user)
		return req.user._id;
	else
		return 'err';	
}


//-----------------------------------------------------------------------------
//------------------------------- ACL functions -------------------------------
//-----------------------------------------------------------------------------

acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));

exports.acl = acl;


/**
 * Request access to a patient data;
 * One role per user.
 */
exports.requestAccess = function(req, res){
	
	var user = req.user;
	var code = req.body.code;
	var patientFamilyName = req.body.familyName;
	var patientGivenName = req.body.givenName;
	
	req.params.model = 'Patient';
	req.query.identifier = '[{"use":"official", "value":"'+ code + '"}]';
	req.query.name = '{"family":["'+ patientFamilyName +'"], "given": ["'+ patientGivenName +'"]}';
	
	restCtrl.search(req, res, function(patients) {
		if (patients.constructor.name.includes("Error")) {
			console.log("Search error: " + patients);
			res.sendStatus(500);
		} else {
			if(patients.length == 0){
				console.log("Access Request Denied");
				res.json({
		            success: false,
		            message: res.__('RequestDenied')
		        });
			}
			else if(patients.length > 1){
				console.log("ERROR : several reccords with same names and code");
				res.json({
		            success: false,
		            message: res.__('InternalError')
		        });					
			}else{
				var id = patients[0].id.split("/");
				var role = "user/" + user._id;				
				
				acl.allow(role, '/rest/patientId/'+id, 'view');	
				
				hasRole( user._id, role, function(err, hasRole){
					if(err){
						console.log("ERROR : couldn't check role " + role + " for user " + user._id);
						res.json({
				            success: false,
				            message: res.__('InternalError')
				        });	
					}
					else {
						if(!hasRole)
							acl.addUserRoles(user._id, role);
						
						res.json({
				            success: true,
				            message: res.__('AccessGranted')
				        });	
					}					
				}); 				
			}			
		}
	});		
}
/**
 * Change the level of access of a person to a patient's data
 */
exports.changeAccess = function(req, res){

	var userId = req.user._id;
	var patientId = req.body.patientId;
	var resource = '/rest/patientId/' + patientId;
	var role = "user/" + user._id;
	var p = req.body.permission;
	
	// check the permissions the user already has for the resource.
	allowedPermissions( userId, resource, function(err, obj){
		var len = obj.resource.length;
		// permissions: view, edit, delete 
		// if user has delete permission, he also has view and edit
		// if he has edit, he also has view
		// if he has no permission something went wrong somewhere
		if(err || len == 0){
			console.log("Access Request Denied");
			res.json({
	            success: false,
	            message: res.__('RequestDenied')
	        });
		}else{
			if(Permission[p] < len){
				var k = Permission[p];
				var permToDel = [];
				for(var i = len; i > k; --i){
					permToDel.push(Permission.list[i-1]);
				}
				removeAllow(role, resource, permToDel, function(err){
					if(err){
						console.log("Access Change Denied");
						res.json({
				            success: false,
				            message: res.__('RequestDenied')
				        });
					}else{
						res.json({
				            success: true,
				            message: res.__('AccessGranted')
				        });
					}
				});				
			}else if(Permission[p] == len){
				res.json({
		            success: true,
		            message: res.__('AccessGranted')
		        });
			}else{
				var k = Permission[p];
				var permToAdd = [];
				for(var i = 0; i < k; ++i){
					permToAdd.push(Permission.list[i]);
				}
				acl.allow(role, resource, permToAdd);
				res.json({
		            success: true,
		            message: res.__('AccessGranted')
		        });
			}
		}
	});
	
	
	
}
/**
 * Remove the access of a practioner to a patient data
 */
exports.removeAccess = function(req, res){
	var user = req.user;
}

/**
 * List all the authorization 
 */
exports.listAccess = function(req, res){
	var user = req.user;
}



