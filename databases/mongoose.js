
var mongoose = require('mongoose');

var mongodbURL = 'mongodb://localhost:27017/institution';
var mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
    	console.log('Connection refused to ' + mongodbURL);
    	console.log(err);
    } else {
        console.log('Express server listening on port 27017');
    }
});