

var i18n 	   = require('./config/i18n');
var db 			= require('./databases/mongoose.js');
var routes 		= require('./routes');
var rest		= require('./routes/REST');
var user 		= require('./routes/user');
var provider	= require('./routes/provider');

var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var http 	   = require('http')
var path	   = require('path');
var app        = express();

app.set('port', process.env.PORT || 3000);

process.env.JWT_SECRET = "64DXqaYyC6zFpsUFPBgPCELFRF8ka9gZHE6f2kp79xMp3ASK";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token, Authorization');
    next();
});

//translation
app.use(i18n);

// check authorizations
function checkToken(req, res, next) {
	var header = req.headers["x-access-token"];
	if(typeof header !== 'undefined'){
		req.token = header;
		console.log("Token found: " + req.token);
        next();
	}else{
		header = req.headers["authorization"];
	    if (typeof header !== 'undefined') {
	        var token = header.split(" ");
	        req.token = token[1];
	        console.log("Token found: " + req.token);
	        next();
	    } else {
	        res.sendStatus(403);
	    }
	}
}

// ----------------------------------------------------------------------------
// ------------------------ Authentication ------------------------------------

app.post('/login', user.login);
app.post('/register', user.register);

// ----------------------------------------------------------------------------
// -------------------------- REST service ------------------------------------

app.post('/rest/:model', checkToken, rest.create);
app.get('/rest/:model/:id', checkToken, rest.read);
app.get('/rest/:model', checkToken, rest.search);
app.get('/rest/:model/:id/_history/:vid', checkToken, rest.vread);
app.get('/rest/:model/:id/_history', checkToken, rest.history);
app.put('/rest/:model/:id', checkToken, rest.update);
app.delete('/rest/:model/:id', checkToken, rest.del);

//----------------------------------------------------------------------------
//------------------------------ Others --------------------------------------

app.get('/ehrmenu', provider.ehrmenu);

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

process.on('uncaughtException', function(err) {
    console.log("Uncaught Exception : " + err);
});

//launch server
http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});