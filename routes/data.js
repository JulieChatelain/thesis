var mongoose = require('mongoose');
var EHROption = mongoose.model('EHROption');

exports.erhMenu = function(req, res) {

	EHROption.find(null, function(err, options) {
		if (err) {
			console.log("Got an error: " + err);
			res.send(500);
		} else {
			var json = JSON.stringify(options);
			res.send(json);
		}
	});
};