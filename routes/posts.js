var express 	= require('express'),
	PostModel 	= require('../models/post');

var router = express.Router({
		caseSensitive: 	false,	// '/Foo' and '/foo' aret treated the same
		mergeParams: 	false,	// Parent and child have conflicting param names
		strict: 		false 	// '/foo' and '/foo/' are treated the same
	});


router.get('/', function(req, res, next) {

	PostModel.find({}, function(err, posts) {
	
		if(err) return next(err);
		
		res.send(posts);		
	});

});


router.post('/', function(req, res, next) {
	var post = new PostModel(req.body);
	post.save(function(err, result) {
		if(err) return next(err);

		res.send(result);
	});
});

module.exports = router;