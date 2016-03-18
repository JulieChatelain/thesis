var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
	userID: { type: String, required: true, unique: true },
	reference: { type: String, required: true },
	patients : [{
        reference: { type: String, required: true },
        display: String,
        ehrOptions : [{
    		name : { type: String, required: true, unique: true },
    		url: { type: String, required: true, unique: true },
    		show : { type: Boolean, required: true },
    		unfold : { type: Boolean, required: true }
    	}]
    }],
    created: { type: Date }
});

//Define Models
var userModel = mongoose.model('User', User);


// Export Models
exports.UserModel = userModel;