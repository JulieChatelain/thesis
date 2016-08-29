var mongoose = require('mongoose');

/**
 * 
 */
var AccessAuthorizationSchema = new mongoose.Schema({
	referenceId : String,			
	access : [ {	
		refId : String,				
		start : Date,				// start of the authorization
		end : Date,					// end of the authorization
		level : {
			type : Number,
			enum : [ 5, 4, 3, 2, 1, 0],
			required : true
		},
		isApproved : {
			type: Boolean,
			required: true
		}
	} ]
});

var accessAuthorization = mongoose.model('AccessAuthorization', AccessAuthorizationSchema);
exports.AccessAuthorization = accessAuthorization;
