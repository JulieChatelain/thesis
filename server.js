

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT','DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token, Authorization');
    next();
});

//translation
app.use(i18n);

// check token and get user
function checkToken(req, res, next) {
	var header = req.headers["x-access-token"];
	if(typeof header !== 'undefined'){
		req.token = header;
        // verify token is valid & get user from token
	    jwt.verify(req.token, process.env.JWT_SECRET, function(err, decoded) {      
	      if (err) {
	    	 console.log("CheckToken error: " + err);
	        return res.sendStatus(403);
	      } else {
	        req.user = decoded;    
	        console.log("decoded : " + JSON.stringify(decoded));
	        next();
	      }
	    });
	}else{
		header = req.headers["authorization"];
	    if (typeof header !== 'undefined') {
	        var token = header.split(" ");
	        req.token = token[1];
	        // verify token is valid & get user from token
		    jwt.verify(req.token, process.env.JWT_SECRET, function(err, decoded) {      
		      if (err) {
			    console.log("CheckToken error: " + err);
		        return res.sendStatus(403);
		      } else {
			    req.user = decoded;    
		        console.log("decoded : " + JSON.stringify(decoded));
		        next();
		      }
		    });
	    } else {
	    	console.log("CheckToken error: typeof header === 'undefined'");
	        res.sendStatus(403);
	    }
	}
}

// ----------------------------------------------------------------------------
// ------------------------ Authentication ------------------------------------

app.post('/login', user.login);
app.post('/register', user.register);
app.post('/changePassword', user.changePassword);

//----------------------------------------------------------------------------
//---------------------- Authorizations Requests ------------------------------

app.post('/approveAccess', checkToken, user.approveAccess);
app.post('/requestAccess', checkToken, user.requestAccess);
app.post('/changeAccess', checkToken, user.changeAccess);
app.post('/removeAccess', checkToken, user.removeAccess);
app.post('/listAccess', checkToken, user.listAccess);

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
/*
process.on('uncaughtException', function(err) {
    console.log("Uncaught Exception : " + err);
});
*/
//launch server
http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});