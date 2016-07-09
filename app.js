
/**
 * Module dependencies.
 */
var db 			= require('./databases/mongoose.js');
var i18n 		= require('./config/i18n');
var routes 		= require('./routes');
var rest		= require('./routes/REST');
var user 		= require('./routes/user');
var provider	= require('./routes/provider');

var express 	= require('express')
  , http 		= require('http')
  , path 		= require('path')
  , mongoose   	= require('mongoose')
  , bodyParser 	= require('body-parser')
  , morgan     	= require("morgan")
  , jwt			= require('jsonwebtoken');

var app = express();
var router = express.Router(); 

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');

// translation
app.use(i18n);

// main folder
app.use(express.static(path.join(__dirname, 'public')));

// Token authentication
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// routes
// non-protected routes:
router.get('/', routes.index);
router.get('/login', user.loginForm);
router.post('/login', user.login);
router.get('/register', user.registerForm);
router.post('/register',user.register);

// protected routes:
router.use(user.ensureAuthorized);

router.get('/ehr/', routes.ehr);
router.get('/ehr/#/Patient/:id', routes.ehr);
router.get('/patients', routes.patients);

//Menu provider
router.get('/ehrmenu', provider.ehrmenu);

//REST api
router.post('/rest/:model', rest.create);
router.get('/rest/:model/:id', rest.read);
router.get('/rest/:model', rest.search);
router.get('/rest/:model/:id/_history/:vid', rest.vread);
router.get('/rest/:model/:id/_history', rest.history);
router.put('/rest/:model/:id', rest.update);
router.delete('/rest/:model/:id', rest.del);


app.use('/', router);

process.on('uncaughtException', function(err) {
    console.log(err);
});

// launch server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

