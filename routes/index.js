/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.ehr = function(req, res){
	res.render('ehr', { title: 'Dossier Médical' });
};