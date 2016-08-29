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
		type : Date,
		required: true
	},
	reference : {			// refer to a patient and/or practitioner resource
		patientId : {
			type : String,
			required : false
		},
		practitionerId : {
			type : String,
			required : false
		}
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