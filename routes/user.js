
var controller = require('../databases/controllers/userCtrl');

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.registerForm = function(req, res) {
	res.render('register', {
		title : 'Créer un compte'
	});
};

exports.register = function(req, res) {
	controller.createUser(req, res);
}

exports.loginForm = function(req, res) {
	res.render('login');
};

exports.login = function(req, res) {
	controller.findUser(req,res);
};


exports.ensureAuthorized = function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {
	    // verifies secret and checks exp
	    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {      
	      if (err) {
	        return res.render('error',{ loggedIn: false, message: 'FailedToken.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	        next();
	      }
	    });
	  } else {
	    // if there is no token
	    // return an error
	    return res.status(403).render('error',{ 
	        loggedIn: false, 
	        message: 'NoToken' 
	    });	    
	  }	
}