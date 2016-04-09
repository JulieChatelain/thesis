
var mongoose = require('mongoose');

/**
 * Piece of medical record (ex: diabetes history, risk factors,...)
 */

var EHROption = new mongoose.Schema({
	name: String,	// name of the option ex "Histoire du diabète"
	url : String  // url of the html file (ex: views/ehrOptions/diabHistory.html)
});


var EHROption = mongoose.model('EHROption', EHROption);
exports.EHROption = EHROption;