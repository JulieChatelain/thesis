

var i18n 	    = require('./config/i18n');
var db 			= require('./databases/mongoose.js');
var rest		= require('./routes/REST');
var user 		= require('./routes/user');

var fs         	= require('fs');
var express    	= require("express");
var morgan     	= require("morgan");
var bodyParser 	= require("body-parser");
var http 	   	= require('http');
var https      	= require('https');
var path	   	= require('path');
var auth       	= require('./routes/AuthManager');

var app        	= express();


app.set('port', process.env.PORT || 3000);
app.set('portHttps', 3007);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token, Authorization');
    next();
});

//translation
app.use(i18n);

// ----------------------------------------------------------------------------
// ------------------------ Authentication ------------------------------------

app.post('/ehr/login', user.login);
app.post('/ehr/register', user.register);
app.post('/ehr/changePassword', auth.ensureAuthorized, user.changePassword);

//---------------------- Authorizations Requests ------------------------------

app.post('/ehr/requestAccess', auth.ensureAuthorized, auth.requestAccess);
app.post('/ehr/changeAccess', auth.ensureAuthorized, auth.changeAccess);
app.post('/ehr/removeAccess', auth.ensureAuthorized, auth.removeAccess);
app.post('/ehr/revokeOwnAccess', auth.ensureAuthorized, auth.revokeOwnAccess);
app.get('/ehr/listAccess', auth.ensureAuthorized, auth.listAccess);

// ----------------------------------------------------------------------------
// -------------------------- REST service ------------------------------------

app.post('/ehr/rest/Patient', auth.ensureAuthorized, rest.create);
app.get('/ehr/rest/Patient', auth.ensureAuthorized, rest.search);

//--------------------------- Patient specific -------------------------------

app.post('/ehr/rest/patientId/:pId/:model', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'edit'), rest.create);
app.get('/ehr/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'view'), rest.read);
app.get('/ehr/rest/patientId/:pId/:model', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'view'), rest.search);
app.get('/ehr/rest/patientId/:pId/:model/:id/_history/:vid', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'view'), rest.vread);
app.get('/ehr/rest/patientId/:pId/:model/:id/_history', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'view'), rest.history);
app.put('/ehr/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'edit'), rest.update);
app.delete('/ehr/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(4, auth.getUserId, 'delete'), rest.del);


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
/*
process.on('uncaughtException', function(err) {
    console.log("Uncaught Exception : " + err);
});*/

// Create and start HTTPS server

https.createServer({
    key: fs.readFileSync('config/pem/ssl_key.pem').toString(),
    cert: fs.readFileSync('config/pem/ssl_cert.pem').toString()
}, app).listen(app.get('portHttps'), function(){
console.log('Express server (https) listening on port ' + app.get('portHttps'));
});

// Create a server for HTTP -> HTTPS redirection
/*
var httpApp = express();
httpApp.all('*', function (req, res, next) {
    res.redirect(301, 'https://' + req.headers.host + req.url);
});
http.createServer(httpApp);
httpApp.listen(app.get('port'), function(){
console.log('Express server (http) listening on port ' + app.get('port'));
});*/



//launch server

http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});
