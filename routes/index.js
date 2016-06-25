
//-----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
//-----------------------------------------------------------------------------


exports.index = function(req, res) {
	res.render('index', {
		title : res.__('EhrServer')
	});
};

exports.ehr = function(req, res) {
	res.render('ehr', {
		title : res.__('MedicalRecord')
	});
};

exports.register = function(req, res) {
	res.render('register', {
		title : res.__('Register')
	});
};

exports.patients = function(req, res) {
	res.render('patients', {
		title : res.__('Patients')
	});
};

