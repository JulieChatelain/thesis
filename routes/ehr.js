/*
 * GET health reccord page.
 */

exports.ehr = function(req, res){
  res.render('ehr', { title: 'Dossier Médical' });
};