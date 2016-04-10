
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

var fs = require('fs');
var models_path = __dirname + '\\models';
console.log(models_path);
var models = fs.readdirSync(models_path);

models.forEach(function (file) {
  if (~file.indexOf('.js')) {
    require(models_path + '/' + file);
  }
});
