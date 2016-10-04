

var i18n 	    = require('./config/i18n');
var db 			= require('./databases/mongoose.js');
var rest		= require('./routes/REST');
var user 		= require('./routes/user');

var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var http 	   = require('http')
var path	   = require('path');
var auth       = require('./routes/AuthManager');

var app        = express();


app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT','DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token, Authorization');
    next();
});

//translation
app.use(i18n);

// ----------------------------------------------------------------------------
// ------------------------ Authentication ------------------------------------

app.post('/login', user.login);
app.post('/register', user.register);
app.post('/changePassword', auth.ensureAuthorized, user.changePassword);

//---------------------- Authorizations Requests ------------------------------

app.post('/requestAccess', auth.ensureAuthorized, auth.requestAccess);
app.post('/changeAccess', auth.ensureAuthorized, auth.changeAccess);
app.post('/removeAccess', auth.ensureAuthorized, auth.removeAccess);
app.post('/listAccess', auth.ensureAuthorized, auth.listAccess);

// ----------------------------------------------------------------------------
// -------------------------- REST service ------------------------------------

app.post('/rest/:model', auth.ensureAuthorized, rest.create);
app.get('/rest/:model/:id', auth.ensureAuthorized, rest.read);
app.get('/rest/:model', auth.ensureAuthorized, rest.search);
app.get('/rest/:model/:id/_history/:vid', auth.ensureAuthorized, rest.vread);
app.get('/rest/:model/:id/_history', auth.ensureAuthorized, rest.history);
app.put('/rest/:model/:id', auth.ensureAuthorized, rest.update);
app.delete('/rest/:model/:id', auth.ensureAuthorized, rest.del);

//--------------------------- Patient specific -------------------------------

app.post('/rest/patientId/:pId/:model', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId), rest.create);
app.get('/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId), rest.read);
app.get('/rest/patientId/:pId/:model', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId), rest.search);
app.get('/rest/patientId/:pId/:model/:id/_history/:vid', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId), rest.vread);
app.get('/rest/patientId/:pId/:model/:id/_history', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId), rest.history);
app.put('/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId, 'post'), rest.update);
app.delete('/rest/patientId/:pId/:model/:id', auth.ensureAuthorized, auth.acl.middleware(3, auth.getUserId, 'post'), rest.del);


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
/*
process.on('uncaughtException', function(err) {
    console.log("Uncaught Exception : " + err);
});
*/
//launch server
http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});