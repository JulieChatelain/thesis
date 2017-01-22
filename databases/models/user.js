var mongoose = require('mongoose');
//var bcrypt          = require('bcrypt');

var SALT_WORK_FACTOR = 10;

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
		familyName: {
			type : String,
			required : false
		},
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
		required: false 
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


UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
    
   //next();
});


UserSchema.methods.comparePassword = function(password, cb) {
	//cb(password == this.password);
	
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
    
};

var user = mongoose.model('User', UserSchema);
exports.User = user;