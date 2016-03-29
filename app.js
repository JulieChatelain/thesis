
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , rest = require('./routes/REST')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

//MongoDB
//var db = require('./databases/mongoose');

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

// REST api
/* 
    Create = POST https://example.com/path/{resourceType}
    Read = GET https://example.com/path/{resourceType}/{id}
    Update = PUT https://example.com/path/{resourceType}/{id}
    Delete = DELETE https://example.com/path/{resourceType}/{id}
    Search = GET https://example.com/path/{resourceType}?search parameters...
    History = GET https://example.com/path/{resourceType}/{id}/_history
    Transaction = POST https://example.com/path/ (POST a transaction bundle to the system)
    Operation = GET https://example.com/path/{resourceType}/{id}/${opname}
 */

app.post('/:model', rest.create);
app.get('/:model/:id', rest.read);
app.get('/:model', rest.search);
app.get('/:model/:id/_history/:vid', rest.vread);
app.get('/:model/:id/_history', rest.history);
app.put('/:model/:id', rest.update);
app.del('/:model/:id', rest.del);

// launch server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
