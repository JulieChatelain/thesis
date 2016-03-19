
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
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
app.post('/:model', routes.create);
app.get('/:model/:id', routes.read);
app.get('/:model', routes.searchRead);
app.get('/:model/:id/_history/:vid', routes.vread);
app.get('/:model/:id/_history', routes.history);
app.put('/:model/:id', routes.update);
app.put('/:model', routes.searchUpdate);
app.del('/:model/:id', routes.del);
app.del('/:model', routes.searchDel);


// launch server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
