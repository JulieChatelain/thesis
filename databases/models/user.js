var mongoose = require('mongoose');

/**
 * 
 */
var UserSchema = new mongoose.Schema({

	// activationToken: { type: String, required: true },
	// password: { type: String, required: true },
	// resetPasswordToken: { type: String, required: false },
	// resetPasswordExpires: { type: Date, required: false },
	// language: { type: String, required: true },
	created : {
		type : Date
	},
	reference : [ {			// refer to a perso and patient and/or practitioner resource
		type : String,
		required : false
	} ], 
	access : [ {			// list of patients the user has access to, for a determined period
		id : String,
		start : Date,
		end : Date
	} ], 
	token : {
		type : String
	},
	email : {
		type : String,
		required : true,
		unique : true
	},
	password : {
		type : String,
		required : true
	},
	language: { 
		type: String, 
		required: true 
	},
	isPatient: {
		type: Boolean,
		required: true
	},
	isPractitioner: {
		type: Boolean,
		required: true
	}
	

});

var user = mongoose.model('User', UserSchema);
exports.User = user;