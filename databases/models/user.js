
var mongoose = require('mongoose');

/**
 * 
 */

var UserSchema = new mongoose.Schema({

    //email: { type: String, required: true, unique: true },
    //activationToken: { type: String, required: true },
    //password: { type: String, required: true },
    //resetPasswordToken: { type: String, required: false },
    //resetPasswordExpires: { type: Date, required: false },
    //language: { type: String, required: true },
    //created: { type: Date },
    reference : [{type: String, required : false}], 	// refer to a patient or practitioner resource
    access : [{id : String, start : Date, end : Date}]	// list of patients the user has access to, for a determined period
    
});

var user = mongoose.model('User', UserSchema);
exports.User = user;