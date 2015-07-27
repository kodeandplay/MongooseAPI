var express 	= require('express'),
	PostModel 	= require('../models/post');

var router = express.Router({
		caseSensitive: 	false,	// '/Foo' and '/foo' aret treated the same
		mergeParams: 	false,	// Parent and child have conflicting param names
		strict: 		false 	// '/foo' and '/foo/' are treated the same
	});


router.param('id', function(req, res, next, id) {

	PostModel.findOne({ _id: id }, function(err, post) {
		if(err) {
			console.log('Error:', err);
			return next(err);
		} 

		if(post) {
			req.post = post;
			return next();
		}

		// Post not found for the submitted id
		next(new Error('Post not found'));
	});
});

router.get('/', function(req, res, next) {

	PostModel.find({}, function(err, posts) {
	
		if(err) return next(err);
		
		res.send(posts);		
	});

});

router.put('/:id', function(req, res, next) {

	// We could use update but would not perform validation, or pre/post hooks
	// No reason to use update with Mongoose, might as well not use Mongoose. Use save.
	var post = req.post;
	post.set(req.body)
	post.save(function(err, result) {

		if(err) {
			console.log('Error:', err);
			return next(err);
		}

		res.send(result.toJSON());
	});

});

router.get('/:id', function(req ,res, next) {
	
	var post = req.post;
	res.send(post.toJSON()); // just to be safe

});

router.post('/', function(req, res, next) {

	var post = new PostModel(req.body);

	// validate method provided by Mongoose
	post.validate(function (error) {

		if(error) {
			console.log('Error:', error);
			return next(error);
		}

		// save is preferred if you would like to call pre/post hooks
		// update will not call hooks
		post.save(function(err, result) {
			if(err) return next(err);

			res.send(result);
		});

	});

});

module.exports = router;