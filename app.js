
/**
 * Module dependencies.
 */
var db = require('./databases/mongoose.js');

var mongoose = require('mongoose');

var express = require('express')
  , routes = require('./routes')
  , rest = require('./routes/REST')
  , data = require('./routes/data')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/ehr', routes.ehr);
app.get('/users', user.list);

//Data provider
app.get('/ehrmenu', function(req, res) {
	
	var EHROption = mongoose.model('EHROption');
	EHROption.find({}, function(err, options) {
		if (err) {
			console.log("Got an error: " + err);
			res.send(500);
		} else {
			console.log(options);
			var json = JSON.stringify(options);
			res.send(json);
		}
	});
});

//REST api
/* 
 Create = POST https://example.com/path/{resourceType}
 Read = GET https://example.com/path/{resourceType}/{id}
 Update = PUT https://example.com/path/{resourceType}/{id}
 Delete = DELETE https://example.com/path/{resourceType}/{id}
 Search = GET https://example.com/path/{resourceType}?search parameters...
 History = GET https://example.com/path/{resourceType}/{id}/_history
 Todo:
 Transaction = POST https://example.com/path/ (POST a transaction bundle to the system)
 Operation = GET https://example.com/path/{resourceType}/{id}/${opname}
*/


app.post('/rest/:model', rest.create);
app.get('/rest/:model/:id', rest.read);
app.get('/rest/:model', rest.search);
app.get('/rest/:model/:id/_history/:vid', rest.vread);
app.get('/rest/:model/:id/_history', rest.history);
app.put('/rest/:model/:id', rest.update);
app.del('/rest/:model/:id', rest.del);


// launch server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
