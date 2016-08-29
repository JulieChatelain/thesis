
var i18n 	   = require('./config/i18n');

var express    = require("express");
var http 	   = require('http')
var path 	   = require('path')
var morgan     = require("morgan");
var app        = express();

app.use(morgan("dev"));

// environment
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.set('port', process.env.PORT || 8080);


// translation
app.use(i18n);

// main folder
app.use(express.static(path.join(__dirname, 'public')));

//partials
app.get('/partials/:view', function(req, res){
	var view = req.params.view;
	res.render('partials/' + view);
});

// index

app.get("/", function(req, res) {
	res.render('index');
});


//launch server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});