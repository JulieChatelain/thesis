
var controller = require('../databases/controllers/userCtrl');

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.register = function(req, res) {
	res.render('register', {
		title : 'Créer un compte'
	});
};

exports.login = function(req, res) {
	controller.findUser(req,res);
};

exports.signin = function(req, res) {
	controller.createUser(req, res);
}