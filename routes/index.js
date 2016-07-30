
//-----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
//-----------------------------------------------------------------------------


exports.index = function(req, res) {
	res.render('index');
};

exports.ehr = function(req, res) {
	res.render('ehr',{
		loggedIn: true
	});
};

exports.register = function(req, res) {
	res.render('register');
};

exports.patients = function(req, res) {
	res.render('patients',{
		loggedIn: true
	});
};

