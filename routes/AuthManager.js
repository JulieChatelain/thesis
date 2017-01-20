var mongoose 	= require('mongoose');
var User		= mongoose.model('User');
var jwt 		= require('jsonwebtoken');
var acl 		= require('acl');

var restCtrl = require('../databases/controllers/RESTController');

var Permissions = {
		view: 1,
		edit: 2,
		delete: 3,
		revoked: 4,
		list: ["view", "edit", "delete", "owner", "revoked"]
};

var urlEHR = '/ehr/rest/patientId/';

process.env.JWT_SECRET = "64DXqaYyC6zFpsUFPBgPCELFRF8ka9gZHE6f2kp79xMp3ASK";

//-----------------------------------------------------------------------------
//------------------------- Token and basic access ----------------------------
//-----------------------------------------------------------------------------

/**
 * Access according to the resource type.
 */
var checkBasicAccess = function(model, user, method, resource){
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
	//console.log("head : " + JSON.stringify(headers));
	var header = headers["x-access-token"];
	if (typeof header !== 'undefined') {
		return header;
	} else {
		header = headers["authorization"];
		if (typeof header !== 'undefined') {
			var token = header.split(" ");
			//console.log("token : " + token[1]);
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
		var dec = jwt.decode(token);
		//console.log("dec : " + JSON.stringify(dec));
		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
			if (err) {
				console.log("CheckToken error: " + err);
				return res.sendStatus(403);
			} else {
				req.user = decoded;
				console.log("decoded : " + JSON.stringify(decoded));
				if(!req.params.pId && checkBasicAccess(req.params.model, req.user, req.method))
					next();
				else if (req.params.pId){
					// check if the resource we want to edit belongs to the record
					// whose id is in the parameters
					if(req.method == 'POST' || req.method == 'PUT'){
						if(req.params.model.toLowerCase() != 'patient'){
							var ref = 'Patient/' + req.params.pId;
							if(req.body.subject && req.body.subject.reference != ref){
								return res.sendStatus(403);	
							}
							if(req.body.patient && req.body.patient.reference != ref){
								return res.sendStatus(403);	
							}
						}else{
							var ref = 'Patient/' + req.params.pId;
							if(req.body.id && req.body.id != ref){
								return res.sendStatus(403);	
							}
						}
					} 
					next();
				}
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
exports.getUserId = function(req, res){
	if(req.user){
		return req.user._id;
	}
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
 * Req.body need to have:<br>
 * givenName (the patient name)<br>
 * familyName (the patient name)<br>
 * practitionerName (family name of the practitioner that created the record)<br>
 * code (the code for the record)<br>
 * p
 */
exports.requestAccess = function(req, res){
	
	var user = req.user;
	var code = req.body.code;
	var patientFamilyName = req.body.familyName;
	var patientGivenName = req.body.givenName;
	var practitionerName = req.body.practitionerName;
	if(!patientGivenName || !code || !patientFamilyName || !practitionerName){
		console.log("Missing values in request access");
		res.json({
            success: false,
            message: res.__('Missing Values')
        });
	}else{
		req.params.model = 'Patient';
		/*
		req.query.identifier = '[{"value":"'+ code + '", "assigner":{"display":"'+ practitionerName + '"}}]';
		req.query.name = '{"family":["'+ patientFamilyName +'"], "given": ["'+ patientGivenName +'"]}';*/
		
		var accessRequest = true;
		restCtrl.list(accessRequest,req, res, function(patients, err) {
			if (err) {
				console.log("Search error: " + err);
				res.json({
		            success: false,
		            message: res.__('InternalError')
		        });
			} else {
				if(patients.length == 0){
					console.log("Access Request Denied. No corresponding patient found.");
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
					console.log("request patient: " + JSON.stringify(patients[0]));
					var id = patients[0].id.split("/");
					var role = "user/" + user._id;				
					
					acl.allow(role, urlEHR + id[1], 'view');	
					
					acl.hasRole( user._id, role, function(err, hasRole){
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
					            message: id[1]
					        });	
						}					
					}); 				
				}			
			}
		});		
	}
};

exports.addAccess = function(req, res, url, next){
	var user = req.user;
	var id = url.split("/");
	var role = "user/" + user._id;				
	
	acl.allow(role, urlEHR + id[1], ["view", "edit", "delete", "owner"]);	
	var userId = "" + user._id;
	
	acl.hasRole(userId, role, function(err, hasRole){
		if(err){
			console.log("ERROR : couldn't check role " + role + " for user " + user._id);
			next(false,res.__('InternalError'));	
		}
		else {
			if(!hasRole){
				acl.addUserRoles(userId, role);
			}
			next(true, res.__('AccessGranted'));	
		}					
	}); 
};

/**
 * Change the level of access of a person to a patient's data.
 * Req.body need to have:<br>
 * patientId (the resource whose access we want to change)<br>
 * targetId (the user for whom we want to change the access)<br>
 * permission (view, edit or delete)
 */
exports.changeAccess = function(req, res){

	var userId = req.user._id;
	var patientId = req.body.patientId;
	var resource = urlEHR + patientId;
	var targetId = req.body.targetId;
	var role = "user/" + targetId;
	var p = req.body.permission;
	
	// check if the user is the practitioner that created the resource
	restCtrl.read(req, res, patientId, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Read error: " + obj);
			res.json({
	            success: false,
	            message: res.__('InternalError')
	        });
		} else {
			var idLen = obj.identifier.length;
			var allowedToChange = false;
			for(var i = 0; i < idLen; ++i){
				if(obj.identifier[i].assigner.reference == req.user.reference.practitionerId){
					allowedToChange = true;
				}
			}
			if(allowedToChange){
				// check the permissions the target already has for the resource.
				acl.allowedPermissions( targetId, resource, function(err, obj){
					var len = obj.length;
					// permissions: view, edit, delete 
					// if user has delete permission, he also has view and edit
					// if he has edit, he also has view
					if(err){
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
							acl.removeAllow(role, resource, permToDel, function(err){
								if(err){
									console.log("Access Change Denied");
									res.json({
							            success: false,
							            message: res.__('RequestDenied')
							        });
								}else{
									res.json({
							            success: true,
							            message: res.__('AccessChanged')
							        });
								}
							});				
						}else if(Permission[p] == len){
							res.json({
					            success: true,
					            message: res.__('AccessChanged')
					        });
						}else{
							var k = Permission[p];
							var permToAdd = [];
							for(var i = len; i < k; ++i){
								permToAdd.push(Permission.list[i]);
							}
							acl.allow(role, resource, permToAdd);
							res.json({
					            success: true,
					            message: res.__('AccessChanged')
					        });
						}
					}
				});	
			}else{
				console.log("Access Change Denied");
				res.json({
		            success: false,
		            message: res.__('RequestDenied')
		        });
			}
		}
	});
	
}

exports.revokeOwnAccess = function(req,res){
	var user = req.user;
	var recordId = req.body.recordId;
	var resource = urlEHR + recordId;
	var targetId = user._id;
	var role = "user/" + user._id;
	acl.removeAllow(role, resource, Permissions.list, function(err){
		if(err){
			console.log("List Access error: " + err);
			res.json({
	            success: false,
	            message: res.__('InternalError')
	        });
		}else{
			res.json({
	            success: true,
	            message: res.__('AccessRemoved')
	        });						
		}
	} );
}

exports.revokeAccess = function(req,res){
	var user = req.user;
	var recordId = req.body.recordId;
	var name = req.body.familyName;
	var resource = urlEHR + recordId;
	if(recordId && name){
		acl.isAllowed( user._id, resource, 'owner', function(err, allowed1){
			  if(allowed1){
				  User.find({ 'reference.familyName': name }, function (err, docs) {
					  var len = docs.length;
					  for(var i = 0; i < len; ++i){
						  var userId = docs[1]._id;
						  if(userID != user._id){
							  acl.isAllowed( userId, resource, 'view', function(err, allowed){
								  if(allowed){
									var role = "user/" + userId;
									acl.removeAllow(role, resource, Permissions.list, function(err){});	
								  }
							  });
						  }
					  }
					res.json({
			            success: true,
			            message: res.__('AccessRemoved')
			        });	
				});	
			  }else{
				console.log("Error revoke access: not allowed to revoke access.");
				res.json({
		            success: false,
		            message: res.__('Not allowed to revoke')
		        });					  
			  }
		  });
		
	}else{
		console.log("Error revoke access: missing parameters.");
		res.json({
            success: false,
            message: res.__('Missing Values')
        });			
	}
}

/**
 * Remove the access of a practitioner to a patient data
 * Req.body need to have:<br>
 * patientId (the resource whose access we want to change)<br>
 * targetId (the user for whom we want to change the access)
 */
exports.removeAccess = function(req, res){
	var user = req.user;
	var patientId = req.body.patientId;
	var resource = urlEHR + patientId;
	var targetId = req.body.targetId;
	var role = "user/" + targetId;

	// check if the user is the practitioner or patient that created the resource
	restCtrl.read(req, res, patientId, function(obj) {
		if (obj.constructor.name.includes("Error")) {
			console.log("Read error: " + obj);
			res.json({
	            success: false,
	            message: res.__('InternalError')
	        });
		} else {
			var idLen = obj.identifier.length;
			var allowedToDel = false;
			for(var i = 0; i < idLen; ++i){
				if(obj.identifier[i].assigner.reference == req.user.reference.practitionerId){
					allowedToDel = true;
				}
				if(obj.identifier[i].assigner.reference == req.user.reference.patientId){
					allowedToDel = true;
				}
			}
			if(allowedToDel){
				acl.removeAllow(role, resource, Permissions.list, function(err){
					if(err){
						console.log("List Access error: " + err);
						res.json({
				            success: false,
				            message: res.__('InternalError')
				        });
					}else{
						res.json({
				            success: true,
				            message: res.__('AccessRemoved')
				        });						
					}
				} ); 
			}
		}
	});
}

/**
 * List all the authorizations
 * {resourceName: [permissions]}
 */
exports.listAccess = function(req, res){
	var user = req.user;
	var role = "user/" + user._id;
	
	acl.whatResources(role, function(err, result){
		for( var prop in result) {
			console.log("list access result : " + prop);
		}
		
		if(err){
			console.log("List Access error : " + err);
			res.json({
	            success: false,
	            message: res.__('InternalError'),
	            data: null
	        });			
		}else{
			
			var patients = [];
			res.json({
	            success: true,
	            message: "",
	            data: JSON.stringify(result)
	        });			
		}
	});
}


/**
 * List all the users that have access to a particular record
 * {resourceName: [permissions]}
 */
exports.listAccessToRecord = function(req, res){
	var user = req.user;
	var role = "user/" + user._id;
	
	acl.whatResources(role, function(err, result){
		for( var prop in result) {
			console.log("list access result : " + prop);
		}
		
		if(err){
			console.log("List Access error : " + err);
			res.json({
	            success: false,
	            message: res.__('InternalError'),
	            data: null
	        });			
		}else{
			
			var patients = [];
			res.json({
	            success: true,
	            message: "",
	            data: JSON.stringify(result)
	        });			
		}
	});
}





