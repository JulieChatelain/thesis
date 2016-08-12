
var db 			= require('../databases/mongoose.js');
var mongoose   	= require('mongoose');
var async 		= require('async');

//-----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
//-----------------------------------------------------------------------------

/**
 * Send le menu list of options.
 */
exports.ehrmenu = function(req, res) {
	var EHROption = mongoose.model('EHROption');
	
	EHROption.find({}, function(err, options) {
		if (err) {
			console.log("Got an error while searching for ehr menu: " + err);
			res.sendStatus(500);
		} else {
			// Translate the menu options
			result = [];
			var len = options.length;
			for (var i = 0; i < len; i++) {
				options[i] = JSON.parse(JSON.stringify(options[i]));
				options[i]['name'] = res.__(options[i].name);
				result.push(options[i]);				
			}
			// Send the result
			res.contentType('application/json');
			var json = JSON.stringify(result);
			res.status(200);
			res.send(json);
		}
	});
};