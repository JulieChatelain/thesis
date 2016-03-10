/*
 * GET health reccord page.
 */

exports.index = function(req, res){
  res.render('ehr', { title: 'Dossier Médical' });
};