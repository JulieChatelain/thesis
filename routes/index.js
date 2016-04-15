
//-----------------------------------------------------------------------------
// ------------------------------ ROUTES --------------------------------------
//-----------------------------------------------------------------------------


exports.index = function(req, res) {
	res.render('index', {
		title : 'Serveur de stockage de dossiers médicaux'
	});
};

exports.ehr = function(req, res) {
	res.render('ehr', {
		title : 'Dossier Médical'
	});
};

exports.patients = function(req, res) {
	res.render('patients', {
		title : 'Patiens'
	});
};