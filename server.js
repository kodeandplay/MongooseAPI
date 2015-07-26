var express 	= require('express'),
	mongoose 	= require('mongoose'),
	bodyParser 	= require('body-parser'),
	logger 		= require('morgan'),
	postsRoute 	= require('./routes/posts'),
	app 		= express();


// Database setup using Mongo and Mongoose
var dbURI = 'mongodb://localhost:27017/api'
mongoose.connect(dbURI);

var db = mongoose.connection;
db.on('error', function(err) {
	console.log('Error connection to Mongo:', err);
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Nested objects can also be parsed

app.get('/', function(req, res) {
	res.status(200).send('Ok');
});

app.use('/posts', postsRoute);


// Run Server
var http = require('http');

var server = http.createServer(app).listen(3000, function() {
	console.log('Server listening on port %d', 3000);
});