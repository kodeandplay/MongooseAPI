var logger 			= require('morgan'),
	express 		= require('express'),
	cluster 		= require('cluster'),
	numCPUs 		= require('os').cpus().length,
	mongoose 		= require('mongoose'),
	bodyParser 		= require('body-parser'),
	errorhandler	= require('errorhandler'),
	postsRoute 		= require('./routes/posts'),
	app 			= express();

if(cluster.isMaster) {

	// Fork Workers
	for(var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(deadWorker, code, signal) {

		// Restart the worker
		var worker = cluster.fork();

		// Note the difference in process ids
		var newPID = worker.process.pid,
			oldPID = deadWorker.process.pid;

		// Log the event
		console.log('Worker:', oldPID, 'died.');
		console.log('Worker:', newPID, 'born.');
		
	});

} else {

	/***** Database setup using Mongo and Mongoose *****/
	var dbURI = 'mongodb://localhost:27017/api'
	mongoose.connect(dbURI);

	var db = mongoose.connection;
	db.on('error', function(err) {
		console.log('Error connection to Mongo:', err);
	});

	db.once('open', function(cb) {
		console.log('Mongoose connection: ok');
	});


	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true })); // Nested objects can also be parsed

	app.all('*', function(req, res, next) {
		console.log('Worker handling request:', cluster.worker.id);
		next();
	});

	app.get('/', function(req, res) {
		res.status(200).send('Ok');
	});

	app.use('/posts', postsRoute);

	if( process.env.NODE_ENV == 'development' || typeof process.env.NODE_ENV == 'undefined') {
		app.use(errorhandler());
	}


	// Run Server
	var http = require('http');

	var server = http.createServer(app).listen(3000, function() {
		console.log('Server listening on port %d', 3000);
		console.log('Worker id:', cluster.worker.id, 'is running.');
	});	

}
