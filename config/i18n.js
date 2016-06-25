
var i18n = require('i18n');

i18n.configure({
	
  locales:['en', 'fr'],

  // location of translation files:
  directory: __dirname + '/locales',
  
  defaultLocale: 'fr',
  
  // cookie name: 
  cookie: 'lang',
});

module.exports = function(req, res, next) {

  i18n.init(req, res);
  //res.local('__', res.__);

  var current_locale = i18n.getLocale();

  return next();
};
